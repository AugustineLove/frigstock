export const Icon = ({ d, size = 16, color = "currentColor", style: s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
    <path d={d} />
  </svg>
);