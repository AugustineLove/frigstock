import { icons } from "../utils/constants";
import { Icon } from "./icon";

export const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1 }}>
    <Icon d={icons.search} size={14} color="var(--muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 12px 9px 36px", borderRadius: 8, fontFamily: "var(--font)", fontSize: 13, outline: "none" }} />
  </div>
);