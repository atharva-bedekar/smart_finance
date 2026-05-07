// client/src/components/Spinner.js
export default function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid #2a2a34`,
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin .7s linear infinite",
      display: "inline-block",
    }} />
  );
}
