import { Badge } from "../components/badge";
import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { SearchBar } from "../components/searchBar";
import { Table } from "../components/table";

export const ItemsPage = ({ data, setData }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const catMap = {};
  data.categories.forEach(c => catMap[c.id] = c.name);

  const filtered = data.items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ name: "", sku: "", categoryId: "", type: "physical", costPrice: "", sellingPrice: "", quantity: "", threshold: "", description: "" }); setModal("add"); };
  const openEdit = (item) => { setForm({ ...item }); setModal("edit"); };

  const save = () => {
    if (!form.name || !form.sku) return;
    const item = { ...form, id: form.id || uid(), costPrice: +form.costPrice, sellingPrice: +form.sellingPrice, quantity: +form.quantity, threshold: +form.threshold, categoryId: +form.categoryId };
    if (modal === "add") setData(d => ({ ...d, items: [...d.items, item] }));
    else setData(d => ({ ...d, items: d.items.map(i => i.id === item.id ? item : i) }));
    setModal(null);
  };

  const del = (id) => setData(d => ({ ...d, items: d.items.filter(i => i.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Items</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.items.length} products in inventory</p>
        </div>
        <Btn icon="plus" onClick={openAdd}>Add Item</Btn>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}><SearchBar value={search} onChange={setSearch} placeholder="Search by name or SKU..." /></div>
        <Table
          cols={[
            { key: "sku", label: "SKU", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted2)" }}>{v}</span> },
            { key: "name", label: "ITEM NAME" },
            { key: "categoryId", label: "CATEGORY", render: v => catMap[v] || "—" },
            { key: "type", label: "TYPE", render: v => <Badge color={v === "physical" ? "accent2" : v === "digital" ? "accent" : "muted"}>{v}</Badge> },
            { key: "quantity", label: "QTY", render: (v, row) => <span style={{ color: v <= row.threshold ? "var(--danger)" : "var(--text)", fontWeight: 700, fontFamily: "var(--mono)" }}>{v}</span> },
            { key: "costPrice", label: "COST", render: v => <span style={{ fontFamily: "var(--mono)" }}>{fmt(v)}</span> },
            { key: "sellingPrice", label: "PRICE", render: v => <span style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{fmt(v)}</span> },
          ]}
          rows={filtered}
          actions={(row) => [
            <Btn key="e" size="sm" variant="ghost" icon="edit" onClick={() => openEdit(row)}>Edit</Btn>,
            <Btn key="d" size="sm" variant="danger" icon="trash" onClick={() => del(row.id)}>Del</Btn>,
          ]}
        />
      </Card>

      {modal && (
        <Modal title={modal === "add" ? "Add New Item" : "Edit Item"} onClose={() => setModal(null)}>
          <Input label="Item Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="SKU" value={form.sku} onChange={v => setForm(f => ({ ...f, sku: v }))} required />
          <Input label="Category" value={String(form.categoryId)} onChange={v => setForm(f => ({ ...f, categoryId: v }))} options={data.categories.map(c => ({ value: String(c.id), label: c.name }))} />
          <Input label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={[{ value: "physical", label: "Physical" }, { value: "service", label: "Service" }, { value: "digital", label: "Digital" }]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Cost Price" type="number" value={form.costPrice} onChange={v => setForm(f => ({ ...f, costPrice: v }))} />
            <Input label="Selling Price" type="number" value={form.sellingPrice} onChange={v => setForm(f => ({ ...f, sellingPrice: v }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Quantity" type="number" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} />
            <Input label="Low Stock Threshold" type="number" value={form.threshold} onChange={v => setForm(f => ({ ...f, threshold: v }))} />
          </div>
          <Input label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Item</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
