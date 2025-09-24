import clsx from "clsx";

export default function Button({ variant="primary", className, ...props }) {
  return (
    <button
      className={clsx(
        "u-btn",
        variant==="primary" && "u-btn--primary",
        variant==="ghost" && "u-btn--ghost",
        variant==="danger" && "u-btn--danger",
        className
      )}
      {...props}
    />
  );
}
