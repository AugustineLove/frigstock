import { Card } from "./card";
import { Icon } from "./icon";

export const Stat = ({ label, value, sub, color = "accent", icon }) => (
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