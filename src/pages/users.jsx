import { Badge } from "../components/badge";
import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { Table } from "../components/table";

export const UsersPage = ({ data, setData }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const openAdd = () => { setForm({ name: "", email: "", role: "Staff" }); setModal("add"); };
  const openEdit = (u) => { setForm({ ...u }); setModal("edit"); };
  const save = () => {
    const u = { ...form, id: form.id || uid() };
    if (modal === "add") setData(d => ({ ...d, users: [...d.users, u] }));
    else setData(d => ({ ...d, users: d.users.map(x => x.id === u.id ? u : x) }));
    setModal(null);
  };
  const del = (id) => setData(d => ({ ...d, users: d.users.filter(u => u.id !== id) }));

  const roleColor = { Admin: "danger", Manager: "accent2", Staff: "muted" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Users</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.users.length} team members</p>
        </div>
        <Btn icon="plus" onClick={openAdd}>Add User</Btn>
      </div>
      <Card>
        <Table
          cols={[
            { key: "name", label: "NAME" },
            { key: "email", label: "EMAIL", muted: true },
            { key: "role", label: "ROLE", render: v => <Badge color={roleColor[v] || "muted"}>{v}</Badge> },
          ]}
          rows={data.users}
          actions={(row) => [
            <Btn key="e" size="sm" variant="ghost" icon="edit" onClick={() => openEdit(row)}>Edit</Btn>,
            <Btn key="d" size="sm" variant="danger" icon="trash" onClick={() => del(row.id)}>Del</Btn>,
          ]}
        />
      </Card>
      {modal && (
        <Modal title={modal === "add" ? "Add User" : "Edit User"} onClose={() => setModal(null)}>
          <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Input label="Role" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} options={[{ value: "Admin", label: "Admin" }, { value: "Manager", label: "Manager" }, { value: "Staff", label: "Staff" }]} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}