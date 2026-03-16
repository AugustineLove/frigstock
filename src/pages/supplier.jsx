import { useState } from "react";
import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { SearchBar } from "../components/searchBar";
import { Table } from "../components/table";
import { Modal } from "../components/modal";
import { Input } from "../components/input";


export const SuppliersPage = ({ data, setData }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = data.suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setForm({ name: "", email: "", phone: "", address: "" }); setModal("add"); };
  const openEdit = (s) => { setForm({ ...s }); setModal("edit"); };
  const save = () => {
    const s = { ...form, id: form.id || uid() };
    if (modal === "add") setData(d => ({ ...d, suppliers: [...d.suppliers, s] }));
    else setData(d => ({ ...d, suppliers: d.suppliers.map(x => x.id === s.id ? s : x) }));
    setModal(null);
  };
  const del = (id) => setData(d => ({ ...d, suppliers: d.suppliers.filter(s => s.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Suppliers</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.suppliers.length} suppliers registered</p>
        </div>
        <Btn icon="plus" onClick={openAdd}>Add Supplier</Btn>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}><SearchBar value={search} onChange={setSearch} /></div>
        <Table
          cols={[
            { key: "name", label: "SUPPLIER NAME" },
            { key: "email", label: "EMAIL", muted: true },
            { key: "phone", label: "PHONE", muted: true },
            { key: "address", label: "ADDRESS", muted: true },
          ]}
          rows={filtered}
          actions={(row) => [
            <Btn key="e" size="sm" variant="ghost" icon="edit" onClick={() => openEdit(row)}>Edit</Btn>,
            <Btn key="d" size="sm" variant="danger" icon="trash" onClick={() => del(row.id)}>Del</Btn>,
          ]}
        />
      </Card>
      {modal && (
        <Modal title={modal === "add" ? "Add Supplier" : "Edit Supplier"} onClose={() => setModal(null)}>
          <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Input label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <Input label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}