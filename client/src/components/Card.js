// client/src/components/Card.js
export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--surface)",
      border:     "1px solid var(--border)",
      borderRadius: 14,
      padding:    24,
      ...style,
    }}>
      {children}
    </div>
  );
}
