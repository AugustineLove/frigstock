import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { Table } from "../components/table";

export const SalesPage = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customerId: "", saleDate: "", status: "Paid", itemId: "", qty: "", unitPrice: "" });
  const itemMap = {};
  data.items.forEach(i => itemMap[i.id] = i);
  const custMap = {};
  data.customers.forEach(c => custMap[c.id] = c.name);

  const save = () => {
    if (!form.customerId || !form.itemId || !form.qty) return;
    const newSale = {
      id: uid(), customerId: +form.customerId, totalAmount: +form.qty * +form.unitPrice,
      saleDate: form.saleDate || new Date().toISOString().split("T")[0],
      status: form.status,
      items: [{ itemId: +form.itemId, qty: +form.qty, unitPrice: +form.unitPrice }]
    };
    const movement = { id: uid(), itemId: +form.itemId, type: "OUT", quantity: +form.qty, date: newSale.saleDate, notes: `Sale to ${custMap[+form.customerId]}`, location: "Main Store" };
    setData(d => ({
      ...d,
      sales: [...d.sales, newSale],
      items: d.items.map(i => i.id === +form.itemId ? { ...i, quantity: Math.max(0, i.quantity - +form.qty) } : i),
      movements: [...d.movements, movement],
    }));
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Sales</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.sales.length} sales transactions</p>
        </div>
        <Btn icon="plus" onClick={() => setModal(true)}>Record Sale</Btn>
      </div>
      <Card>
        <Table
          cols={[
            { key: "saleDate", label: "DATE", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{fmtDate(v)}</span> },
            { key: "customerId", label: "CUSTOMER", render: v => custMap[v] || "—" },
            { key: "items", label: "ITEMS", render: v => v.map(x => `${itemMap[x.itemId]?.name || "?"} ×${x.qty}`).join(", ") },
            { key: "totalAmount", label: "TOTAL", render: v => <span style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{fmt(v)}</span> },
            { key: "status", label: "STATUS", render: v => <Badge color={v === "Paid" ? "accent" : "warn"}>{v}</Badge> },
          ]}
          rows={data.sales}
        />
      </Card>
      {modal && (
        <Modal title="Record Sale" onClose={() => setModal(false)}>
          <Input label="Customer" value={form.customerId} onChange={v => setForm(f => ({ ...f, customerId: v }))} options={data.customers.map(c => ({ value: String(c.id), label: c.name }))} required />
          <Input label="Item" value={form.itemId} onChange={v => { const item = data.items.find(i => i.id === +v); setForm(f => ({ ...f, itemId: v, unitPrice: item?.sellingPrice || "" })); }} options={data.items.map(i => ({ value: String(i.id), label: `${i.name} (${i.quantity} in stock)` }))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Quantity" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
            <Input label="Unit Price" type="number" value={form.unitPrice} onChange={v => setForm(f => ({ ...f, unitPrice: v }))} />
          </div>
          <Input label="Sale Date" type="date" value={form.saleDate} onChange={v => setForm(f => ({ ...f, saleDate: v }))} />
          <Input label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={[{ value: "Paid", label: "Paid" }, { value: "Unpaid", label: "Unpaid" }]} />
          {form.qty && form.unitPrice && <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12, marginBottom: 16, fontFamily: "var(--mono)", fontSize: 13 }}>Total: <strong style={{ color: "var(--accent)" }}>{fmt(+form.qty * +form.unitPrice)}</strong></div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Sale</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}