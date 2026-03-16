import { useState, useEffect, useRef } from "react";
import { SuppliersPage } from "./pages/supplier";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`;

const style = `
  ${FONT}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0c0f;
    --surface: #111318;
    --surface2: #181c23;
    --border: #1e2330;
    --border2: #262d3d;
    --accent: #00e5a0;
    --accent2: #0099ff;
    --accent3: #ff6b35;
    --warn: #ffcc00;
    --danger: #ff4455;
    --text: #e8eaf0;
    --muted: #6b7280;
    --muted2: #9ca3af;
    --font: 'Syne', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
`;

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const seed = {
  categories: [
    { id: 1, name: "Electronics", parent: null },
    { id: 2, name: "Office Supplies", parent: null },
    { id: 3, name: "Furniture", parent: null },
    { id: 4, name: "Peripherals", parent: 1 },
  ],
  items: [
    { id: 1, name: "Laptop Pro 15", sku: "LP-001", categoryId: 1, type: "physical", costPrice: 800, sellingPrice: 1199, quantity: 24, threshold: 5, description: "High-performance laptop" },
    { id: 2, name: "Wireless Mouse", sku: "WM-002", categoryId: 4, type: "physical", costPrice: 12, sellingPrice: 29, quantity: 3, threshold: 10, description: "Ergonomic wireless mouse" },
    { id: 3, name: "Standing Desk", sku: "SD-003", categoryId: 3, type: "physical", costPrice: 300, sellingPrice: 499, quantity: 8, threshold: 2, description: "Adjustable standing desk" },
    { id: 4, name: "Printer Ink", sku: "PI-004", categoryId: 2, type: "physical", costPrice: 8, sellingPrice: 18, quantity: 2, threshold: 15, description: "Black ink cartridge" },
    { id: 5, name: "USB-C Hub", sku: "UH-005", categoryId: 4, type: "physical", costPrice: 20, sellingPrice: 45, quantity: 17, threshold: 8, description: "7-port USB-C hub" },
    { id: 6, name: "Cloud Storage Plan", sku: "CS-006", categoryId: 1, type: "digital", costPrice: 5, sellingPrice: 15, quantity: 999, threshold: 0, description: "Annual cloud storage" },
  ],
  suppliers: [
    { id: 1, name: "TechDistrib Inc.", email: "orders@techdistrib.com", phone: "+1 800 555 0101", address: "123 Warehouse Blvd, CA" },
    { id: 2, name: "OfficeWorld Co.", email: "supply@officeworld.com", phone: "+1 800 555 0202", address: "456 Commerce St, NY" },
  ],
  customers: [
    { id: 1, name: "Acme Corp", email: "procurement@acme.com", phone: "+1 555 100 2000" },
    { id: 2, name: "Nova Agency", email: "orders@nova.agency", phone: "+1 555 300 4000" },
  ],
  purchases: [
    { id: 1, supplierId: 1, totalAmount: 9600, purchaseDate: "2025-03-01", status: "Paid", items: [{ itemId: 1, qty: 12, unitCost: 800 }] },
    { id: 2, supplierId: 2, totalAmount: 240, purchaseDate: "2025-03-05", status: "Unpaid", items: [{ itemId: 4, qty: 30, unitCost: 8 }] },
  ],
  sales: [
    { id: 1, customerId: 1, totalAmount: 2398, saleDate: "2025-03-08", status: "Paid", items: [{ itemId: 1, qty: 2, unitPrice: 1199 }] },
    { id: 2, customerId: 2, totalAmount: 87, saleDate: "2025-03-09", status: "Paid", items: [{ itemId: 2, qty: 3, unitPrice: 29 }] },
  ],
  movements: [
    { id: 1, itemId: 1, type: "IN", quantity: 12, date: "2025-03-01", notes: "Purchase from TechDistrib", location: "Warehouse A" },
    { id: 2, itemId: 1, type: "OUT", quantity: 2, date: "2025-03-08", notes: "Sale to Acme Corp", location: "Warehouse A" },
    { id: 3, itemId: 2, type: "OUT", quantity: 3, date: "2025-03-09", notes: "Sale to Nova Agency", location: "Main Store" },
    { id: 4, itemId: 4, type: "ADJUSTMENT", quantity: -5, date: "2025-03-07", notes: "Damaged goods write-off", location: "Warehouse A" },
  ],
  users: [
    { id: 1, name: "Alex Rivera", email: "alex@frigstock.com", role: "Admin" },
    { id: 2, name: "Sam Chen", email: "sam@frigstock.com", role: "Manager" },
    { id: 3, name: "Jordan Lee", email: "jordan@frigstock.com", role: "Staff" },
  ],
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor", style: s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
    <path d={d} />
  </svg>
);
const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  items: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  suppliers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  customers: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",
  purchases: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  sales: "M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  movements: "M17 1l4 4-4 4 M3 11V9a4 4 0 014-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 01-4 4H3",
  reports: "M18 20V10 M12 20V4 M6 20v-6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  plus: "M12 5v14 M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  close: "M18 6L6 18 M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  logo: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const uid = () => Math.floor(Math.random() * 9000 + 1000);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const Badge = ({ children, color = "accent" }) => {
  const colors = { accent: "#00e5a020", accent2: "#0099ff20", warn: "#ffcc0020", danger: "#ff445520", muted: "#6b728020" };
  const text = { accent: "#00e5a0", accent2: "#0099ff", warn: "#ffcc00", danger: "#ff4455", muted: "#9ca3af" };
  return (
    <span style={{ background: colors[color], color: text[color], padding: "2px 8px", borderRadius: 4, fontSize: 11, fontFamily: "var(--mono)", fontWeight: 500, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
};

const Card = ({ children, style: s }) => (
  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", ...s }}>
    {children}
  </div>
);

const Stat = ({ label, value, sub, color = "accent", icon }) => (
  <Card style={{ flex: 1, minWidth: 160 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: `var(--${color})`, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>{sub}</div>}
      </div>
      {icon && <div style={{ width: 40, height: 40, borderRadius: 10, background: `var(--${color})15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={icons[icon]} color={`var(--${color})`} size={18} />
      </div>}
    </div>
  </Card>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", icon, disabled }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, fontFamily: "var(--font)", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap" };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "9px 16px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  const variants = {
    primary: { background: "var(--accent)", color: "#000" },
    secondary: { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border2)" },
    danger: { background: "#ff445520", color: "var(--danger)", border: "1px solid #ff445540" },
    ghost: { background: "transparent", color: "var(--muted2)", border: "1px solid var(--border)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Icon d={icons[icon]} size={13} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, options, required }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "var(--muted2)", marginBottom: 6, fontFamily: "var(--mono)" }}>{label}{required && <span style={{ color: "var(--accent)" }}>*</span>}</label>}
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)", padding: "9px 12px", borderRadius: 8, fontFamily: "var(--font)", fontSize: 13, outline: "none" }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)", padding: "9px 12px", borderRadius: 8, fontFamily: "var(--font)", fontSize: 13, outline: "none" }} />
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><Icon d={icons.close} size={18} /></button>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  </div>
);

const Table = ({ cols, rows, actions }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border)" }}>
          {cols.map(c => <th key={c.key} style={{ textAlign: "left", padding: "10px 12px", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{c.label}</th>)}
          {actions && <th style={{ padding: "10px 12px", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11 }}>ACTIONS</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={cols.length + (actions ? 1 : 0)} style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>No records found</td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--border)08", transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {cols.map(c => <td key={c.key} style={{ padding: "11px 12px", color: c.muted ? "var(--muted2)" : "var(--text)" }}>{c.render ? c.render(row[c.key], row) : row[c.key]}</td>)}
            {actions && <td style={{ padding: "11px 12px" }}><div style={{ display: "flex", gap: 6 }}>{actions(row)}</div></td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1 }}>
    <Icon d={icons.search} size={14} color="var(--muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 12px 9px 36px", borderRadius: 8, fontFamily: "var(--font)", fontSize: 13, outline: "none" }} />
  </div>
);

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Dashboard({ data }) {
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

function ItemsPage({ data, setData }) {
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

function CustomersPage({ data, setData }) {
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

function PurchasesPage({ data, setData }) {
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

function SalesPage({ data, setData }) {
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

function MovementsPage({ data, setData }) {
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

function ReportsPage({ data }) {
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

function UsersPage({ data, setData }) {
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

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(seed);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "items", label: "Items", icon: "items" },
    { id: "categories", label: "Categories", icon: "purchases" },
    { id: "suppliers", label: "Suppliers", icon: "suppliers" },
    { id: "customers", label: "Customers", icon: "customers" },
    { id: "purchases", label: "Purchases", icon: "purchases" },
    { id: "sales", label: "Sales", icon: "sales" },
    { id: "movements", label: "Stock Movements", icon: "movements" },
    { id: "reports", label: "Reports", icon: "reports" },
    { id: "users", label: "Users", icon: "users" },
  ];

  const lowStockCount = data.items.filter(i => i.quantity <= i.threshold && i.type === "physical").length;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard data={data} />;
      case "items": return <ItemsPage data={data} setData={setData} />;
      case "categories": return <CategoriesPage data={data} setData={setData} />;
      case "suppliers": return <SuppliersPage data={data} setData={setData} />;
      case "customers": return <CustomersPage data={data} setData={setData} />;
      case "purchases": return <PurchasesPage data={data} setData={setData} />;
      case "sales": return <SalesPage data={data} setData={setData} />;
      case "movements": return <MovementsPage data={data} setData={setData} />;
      case "reports": return <ReportsPage data={data} />;
      case "users": return <UsersPage data={data} setData={setData} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{style}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{ width: sidebarOpen ? 240 : 64, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarOpen(o => !o)}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={icons.logo} size={18} color="#000" />
            </div>
            {sidebarOpen && <div><div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em" }}>frigStock</div><div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)" }}>INVENTORY PRO</div></div>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {nav.map(n => {
              const active = page === n.id;
              return (
                <button key={n.id} onClick={() => setPage(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: active ? "var(--accent)15" : "transparent", color: active ? "var(--accent)" : "var(--muted2)", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 13, fontWeight: active ? 700 : 500, marginBottom: 2, transition: "all 0.1s", textAlign: "left", whiteSpace: "nowrap", position: "relative" }}>
                  <Icon d={icons[n.icon]} size={16} color={active ? "var(--accent)" : "var(--muted)"} style={{ flexShrink: 0 }} />
                  {sidebarOpen && n.label}
                  {n.id === "dashboard" && lowStockCount > 0 && sidebarOpen && (
                    <span style={{ marginLeft: "auto", background: "var(--danger)", color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", fontFamily: "var(--mono)" }}>{lowStockCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User */}
          {sidebarOpen && (
            <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent2)30", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent2)", fontWeight: 700, fontSize: 13 }}>A</div>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>Alex Rivera</div><div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>Admin</div></div>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}

function CategoriesPage({ data, setData }) {
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