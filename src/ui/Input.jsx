export default function Input(props){
  return (
    <input
      {...props}
      className={
        "w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--gold)] " +
        (props.className || "")
      }
    />
  );
}
