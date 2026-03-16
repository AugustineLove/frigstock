export const Input = ({ label, value, onChange, type = "text", placeholder, options, required }) => (
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