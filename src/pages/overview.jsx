import { Badge } from "../components/badge";
import { Card } from "../components/card";
import { Stat } from "../components/stat";
import { Table } from "../components/table";

export const Dashboard = ({ data }) => {
  const totalValue = data.items.reduce((s, i) => s + i.quantity * i.costPrice, 0);
  const lowStock = data.items.filter(i => i.quantity <= i.threshold && i.type === "physical");
  const totalSales = data.sales.reduce((s, sale) => s + sale.totalAmount, 0);
  const totalPurchases = data.purchases.reduce((s, p) => s + p.totalAmount, 0);
  const profit = totalSales - totalPurchases;

  const topItems = [...data.items].sort((a, b) => b.quantity * b.sellingPrice - a.quantity * a.sellingPrice).slice(0, 5);

  const catMap = {};
  data.categories.forEach(c => catMap[c.id] = c.name);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Overview of your inventory & performance</p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <Stat label="TOTAL STOCK VALUE" value={fmt(totalValue)} sub={`${data.items.length} items tracked`} color="accent" icon="items" />
        <Stat label="TOTAL SALES" value={fmt(totalSales)} sub={`${data.sales.length} transactions`} color="accent2" icon="sales" />
        <Stat label="NET PROFIT" value={fmt(profit)} sub="Sales minus purchases" color={profit >= 0 ? "accent" : "danger"} icon="reports" />
        <Stat label="LOW STOCK ALERTS" value={lowStock.length} sub="Items need restocking" color={lowStock.length > 0 ? "warn" : "accent"} icon="alert" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>⚠ LOW STOCK ITEMS</h3>
          {lowStock.length === 0 ? <p style={{ color: "var(--muted)", fontSize: 13 }}>All items are well-stocked.</p> : lowStock.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>{item.sku}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "var(--danger)", fontWeight: 700, fontSize: 16 }}>{item.quantity}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>min {item.threshold}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>🏆 TOP ITEMS BY VALUE</h3>
          {topItems.map((item, i) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--accent)20", color: "var(--accent)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{catMap[item.categoryId] || "—"}</div>
                </div>
              </div>
              <Badge color="accent">{fmt(item.quantity * item.sellingPrice)}</Badge>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>📦 RECENT STOCK MOVEMENTS</h3>
        <Table
          cols={[
            { key: "date", label: "DATE", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{fmtDate(v)}</span> },
            { key: "itemId", label: "ITEM", render: v => data.items.find(i => i.id === v)?.name || "—" },
            { key: "type", label: "TYPE", render: v => <Badge color={v === "IN" ? "accent" : v === "OUT" ? "danger" : "warn"}>{v}</Badge> },
            { key: "quantity", label: "QTY", render: v => <span style={{ fontFamily: "var(--mono)", fontWeight: 600, color: v > 0 ? "var(--accent)" : "var(--danger)" }}>{v > 0 ? `+${v}` : v}</span> },
            { key: "location", label: "LOCATION", muted: true },
            { key: "notes", label: "NOTES", muted: true },
          ]}
          rows={data.movements.slice().reverse()}
        />
      </Card>
    </div>
  );
}
