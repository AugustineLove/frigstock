import { Btn } from "../components/btn";
import { Card } from "../components/card";
import { Stat } from "../components/stat";
import { Table } from "../components/table";

export const ReportsPage = ({ data }) => {
  const catMap = {};
  data.categories.forEach(c => catMap[c.id] = c.name);

  const totalValue = data.items.reduce((s, i) => s + i.quantity * i.costPrice, 0);
  const totalSelling = data.items.reduce((s, i) => s + i.quantity * i.sellingPrice, 0);
  const totalSales = data.sales.reduce((s, x) => s + x.totalAmount, 0);
  const totalPurchases = data.purchases.reduce((s, x) => s + x.totalAmount, 0);
  const unpaidPurchases = data.purchases.filter(p => p.status === "Unpaid").reduce((s, p) => s + p.totalAmount, 0);
  const lowStock = data.items.filter(i => i.quantity <= i.threshold && i.type === "physical");

  const byCat = {};
  data.items.forEach(i => {
    const cat = catMap[i.categoryId] || "Uncategorized";
    if (!byCat[cat]) byCat[cat] = { value: 0, count: 0 };
    byCat[cat].value += i.quantity * i.costPrice;
    byCat[cat].count += 1;
  });

  const exportCSV = () => {
    const rows = [["SKU", "Name", "Category", "Quantity", "Cost Price", "Selling Price", "Stock Value"]];
    data.items.forEach(i => rows.push([i.sku, i.name, catMap[i.categoryId] || "—", i.quantity, i.costPrice, i.sellingPrice, i.quantity * i.costPrice]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = "frigstock-inventory.csv"; a.click();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Analytics & export</p>
        </div>
        <Btn icon="download" variant="secondary" onClick={exportCSV}>Export CSV</Btn>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <Stat label="INVENTORY COST VALUE" value={fmt(totalValue)} color="accent2" icon="items" />
        <Stat label="INVENTORY SELL VALUE" value={fmt(totalSelling)} color="accent" icon="sales" />
        <Stat label="TOTAL REVENUE" value={fmt(totalSales)} color="accent" icon="reports" />
        <Stat label="UNPAID TO SUPPLIERS" value={fmt(unpaidPurchases)} color={unpaidPurchases > 0 ? "warn" : "accent"} icon="purchases" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>📊 STOCK BY CATEGORY</h3>
          {Object.entries(byCat).map(([cat, val]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{cat}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)" }}>{fmt(val.value)}</span>
              </div>
              <div style={{ height: 4, background: "var(--border2)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--accent)", width: `${Math.min(100, (val.value / totalValue) * 100)}%`, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>⚠ LOW STOCK REPORT</h3>
          {lowStock.length === 0 ? <p style={{ color: "var(--muted)", fontSize: 13 }}>No low-stock items.</p> : lowStock.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13 }}>{item.name}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--danger)" }}>{item.quantity}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>/ min {item.threshold}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--muted2)" }}>📋 FULL INVENTORY REPORT</h3>
        <Table
          cols={[
            { key: "sku", label: "SKU", render: v => <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted2)" }}>{v}</span> },
            { key: "name", label: "ITEM" },
            { key: "categoryId", label: "CATEGORY", render: v => catMap[v] || "—" },
            { key: "quantity", label: "QTY", render: (v, r) => <span style={{ fontFamily: "var(--mono)", color: v <= r.threshold ? "var(--danger)" : "var(--text)", fontWeight: 700 }}>{v}</span> },
            { key: "costPrice", label: "COST", render: v => <span style={{ fontFamily: "var(--mono)" }}>{fmt(v)}</span> },
            { key: "sellingPrice", label: "PRICE", render: v => <span style={{ fontFamily: "var(--mono)" }}>{fmt(v)}</span> },
            { key: "quantity", label: "STOCK VALUE", render: (v, r) => <span style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{fmt(v * r.costPrice)}</span> },
          ]}
          rows={data.items}
        />
      </Card>
    </div>
  );
}