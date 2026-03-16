import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { Table } from "../components/table";

export const MovementsPage = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ itemId: "", type: "ADJUSTMENT", quantity: "", notes: "", location: "" });
  const itemMap = {};
  data.items.forEach(i => itemMap[i.id] = i);

  const save = () => {
    if (!form.itemId || !form.quantity) return;
    const qty = +form.quantity;
    const movement = { id: uid(), itemId: +form.itemId, type: form.type, quantity: form.type === "OUT" ? -Math.abs(qty) : qty, date: new Date().toISOString().split("T")[0], notes: form.notes, location: form.location };
    setData(d => ({
      ...d,
      movements: [...d.movements, movement],
      items: d.items.map(i => i.id === +form.itemId ? { ...i, quantity: Math.max(0, i.quantity + movement.quantity) } : i),
    }));
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Stock Movements</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{data.movements.length} movement records</p>
        </div>
        <Btn icon="plus" onClick={() => setModal(true)}>Add Movement</Btn>
      </div>
      <Card>
        <Table
          cols={[
            { key: "date", label: "DATE", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{fmtDate(v)}</span> },
            { key: "itemId", label: "ITEM", render: v => itemMap[v]?.name || "—" },
            { key: "type", label: "TYPE", render: v => <Badge color={v === "IN" ? "accent" : v === "OUT" ? "danger" : "warn"}>{v}</Badge> },
            { key: "quantity", label: "QTY", render: v => <span style={{ fontFamily: "var(--mono)", fontWeight: 600, color: v > 0 ? "var(--accent)" : "var(--danger)" }}>{v > 0 ? `+${v}` : v}</span> },
            { key: "location", label: "LOCATION", render: v => v ? <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted2)", fontSize: 12 }}><Icon d={icons.location} size={12} />{v}</span> : "—" },
            { key: "notes", label: "NOTES", muted: true },
          ]}
          rows={[...data.movements].reverse()}
        />
      </Card>
      {modal && (
        <Modal title="Add Stock Movement" onClose={() => setModal(false)}>
          <Input label="Item" value={form.itemId} onChange={v => setForm(f => ({ ...f, itemId: v }))} options={data.items.map(i => ({ value: String(i.id), label: `${i.name} (${i.quantity} in stock)` }))} required />
          <Input label="Movement Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={[{ value: "IN", label: "Stock In (Restock)" }, { value: "OUT", label: "Stock Out (Consumption/Damage)" }, { value: "ADJUSTMENT", label: "Manual Adjustment" }]} />
          <Input label="Quantity" type="number" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} />
          <Input label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Warehouse A" />
          <Input label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Reason for adjustment..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Movement</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
