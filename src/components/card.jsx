export const Card = ({ children, style: s }) => (
  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", ...s }}>
    {children}
  </div>
);