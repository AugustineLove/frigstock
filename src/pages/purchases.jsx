import { Badge } from "../components/badge";
import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { Table } from "../components/table";

export const PurchasesPage = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", purchaseDate: "", status: "Unpaid", itemId: "", qty: "", unitCost: "" });
  const itemMap = {};
  data.items.forEach(i => itemMap[i.id] = i);
  const supplierMap = {};
  data.suppliers.forEach(s => supplierMap[s.id] = s.name);

  const save = () => {
    if (!form.supplierId || !form.itemId || !form.qty) return;
    const newPurchase = {
      id: uid(), supplierId: +form.supplierId, totalAmount: +form.qty * +form.unitCost,
      purchaseDate: form.purchaseDate || new Date().toISOString().split("T")[0],
      status: form.status,
      items: [{ itemId: +form.itemId, qty: +form.qty, unitCost: +form.unitCost }]
    };
    const movement = { id: uid(), itemId: +form.itemId, type: "IN", quantity: +form.qty, date: newPurchase.purchaseDate, notes: `Purchase from ${supplierMap[+form.supplierId]}`, location: "Warehouse A" };
    setData(d => ({
      ...d,
      purchases: [...d.purchases, newPurchase],
      items: d.items.map(i => i.id === +form.itemId ? { ...i, quantity: i.quantity + +form.qty } : i),
      movements: [...d.movements, movement],
    }));
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Purchases</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.purchases.length} purchase records</p>
        </div>
        <Btn icon="plus" onClick={() => setModal(true)}>Record Purchase</Btn>
      </div>
      <Card>
        <Table
          cols={[
            { key: "purchaseDate", label: "DATE", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{fmtDate(v)}</span> },
            { key: "supplierId", label: "SUPPLIER", render: v => supplierMap[v] || "—" },
            { key: "items", label: "ITEMS", render: v => v.map(x => `${itemMap[x.itemId]?.name || "?"} ×${x.qty}`).join(", ") },
            { key: "totalAmount", label: "TOTAL", render: v => <span style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{fmt(v)}</span> },
            { key: "status", label: "STATUS", render: v => <Badge color={v === "Paid" ? "accent" : "warn"}>{v}</Badge> },
          ]}
          rows={data.purchases}
        />
      </Card>
      {modal && (
        <Modal title="Record Purchase" onClose={() => setModal(false)}>
          <Input label="Supplier" value={form.supplierId} onChange={v => setForm(f => ({ ...f, supplierId: v }))} options={data.suppliers.map(s => ({ value: String(s.id), label: s.name }))} required />
          <Input label="Item" value={form.itemId} onChange={v => { const item = data.items.find(i => i.id === +v); setForm(f => ({ ...f, itemId: v, unitCost: item?.costPrice || "" })); }} options={data.items.filter(i => i.type !== "service").map(i => ({ value: String(i.id), label: i.name }))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Quantity" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
            <Input label="Unit Cost" type="number" value={form.unitCost} onChange={v => setForm(f => ({ ...f, unitCost: v }))} />
          </div>
          <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={v => setForm(f => ({ ...f, purchaseDate: v }))} />
          <Input label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={[{ value: "Paid", label: "Paid" }, { value: "Unpaid", label: "Unpaid" }]} />
          {form.qty && form.unitCost && <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12, marginBottom: 16, fontFamily: "var(--mono)", fontSize: 13 }}>Total: <strong style={{ color: "var(--accent)" }}>{fmt(+form.qty * +form.unitCost)}</strong></div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Purchase</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}