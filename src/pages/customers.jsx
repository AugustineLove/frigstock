import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { SearchBar } from "../components/searchBar";
import { Table } from "../components/table";

export const CustomersPage = ({ data, setData }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = data.customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setForm({ name: "", email: "", phone: "" }); setModal("add"); };
  const openEdit = (c) => { setForm({ ...c }); setModal("edit"); };
  const save = () => {
    const c = { ...form, id: form.id || uid() };
    if (modal === "add") setData(d => ({ ...d, customers: [...d.customers, c] }));
    else setData(d => ({ ...d, customers: d.customers.map(x => x.id === c.id ? c : x) }));
    setModal(null);
  };
  const del = (id) => setData(d => ({ ...d, customers: d.customers.filter(c => c.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Customers</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.customers.length} customers</p>
        </div>
        <Btn icon="plus" onClick={openAdd}>Add Customer</Btn>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}><SearchBar value={search} onChange={setSearch} /></div>
        <Table
          cols={[
            { key: "name", label: "CUSTOMER NAME" },
            { key: "email", label: "EMAIL", muted: true },
            { key: "phone", label: "PHONE", muted: true },
          ]}
          rows={filtered}
          actions={(row) => [
            <Btn key="e" size="sm" variant="ghost" icon="edit" onClick={() => openEdit(row)}>Edit</Btn>,
            <Btn key="d" size="sm" variant="danger" icon="trash" onClick={() => del(row.id)}>Del</Btn>,
          ]}
        />
      </Card>
      {modal && (
        <Modal title={modal === "add" ? "Add Customer" : "Edit Customer"} onClose={() => setModal(null)}>
          <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Input label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}