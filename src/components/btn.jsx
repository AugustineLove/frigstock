import { icons } from "../utils/constants";
import { Icon } from "./icon";

export const Btn = ({ children, onClick, variant = "primary", size = "md", icon, disabled }) => {
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