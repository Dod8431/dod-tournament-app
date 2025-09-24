export default function Card({ className="", children }) {
  return <div className={`u-card p-6 ${className}`}>{children}</div>;
}
