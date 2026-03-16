export const Table = ({ cols, rows, actions }) => (
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
