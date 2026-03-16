import { Badge } from "../components/badge";
import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { Table } from "../components/table";

export const CategoriesPage = ({ data, setData }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const openAdd = () => { setForm({ name: "", parent: null }); setModal("add"); };
  const openEdit = (c) => { setForm({ ...c }); setModal("edit"); };
  const save = () => {
    const c = { ...form, id: form.id || uid() };
    if (modal === "add") setData(d => ({ ...d, categories: [...d.categories, c] }));
    else setData(d => ({ ...d, categories: d.categories.map(x => x.id === c.id ? c : x) }));
    setModal(null);
  };
  const del = (id) => setData(d => ({ ...d, categories: d.categories.filter(c => c.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Categories</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.categories.length} categories</p>
        </div>
        <Btn icon="plus" onClick={openAdd}>Add Category</Btn>
      </div>
      <Card>
        <Table
          cols={[
            { key: "name", label: "CATEGORY NAME" },
            { key: "parent", label: "PARENT", render: v => v ? data.categories.find(c => c.id === v)?.name || "—" : <span style={{ color: "var(--muted)" }}>Root</span> },
            { key: "id", label: "ITEMS", render: v => <Badge color="muted">{data.items.filter(i => i.categoryId === v).length} items</Badge> },
          ]}
          rows={data.categories}
          actions={(row) => [
            <Btn key="e" size="sm" variant="ghost" icon="edit" onClick={() => openEdit(row)}>Edit</Btn>,
            <Btn key="d" size="sm" variant="danger" icon="trash" onClick={() => del(row.id)}>Del</Btn>,
          ]}
        />
      </Card>
      {modal && (
        <Modal title={modal === "add" ? "Add Category" : "Edit Category"} onClose={() => setModal(null)}>
          <Input label="Category Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Parent Category (optional)" value={form.parent ? String(form.parent) : ""} onChange={v => setForm(f => ({ ...f, parent: v ? +v : null }))} options={data.categories.filter(c => c.id !== form.id).map(c => ({ value: String(c.id), label: c.name }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}