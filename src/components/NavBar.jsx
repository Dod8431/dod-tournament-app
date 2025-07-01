import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("adminPanelCodeOk") === "yes";
  }

  return (
    <nav
      className="w-full z-40 fixed top-0 left-0 backdrop-blur bg-[var(--main-dark)]/95 border-b-2 border-[var(--main-gold)] shadow-lg"
      style={{
        background: "var(--main-dark)",
        borderBottom: "2px solid var(--main-gold)",
        boxShadow: "0 3px 16px 0 var(--main-gold-dark)",
      }}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 sm:gap-8 font-extrabold text-[1.2rem] tracking-tight">
          <NavLink to="/" pathname={pathname} text="Home" />
          {isAdmin && (
            <NavLink to="/my-tournaments" pathname={pathname} text="My Tournaments" />
          )}
          <NavLink to="/admin" pathname={pathname} text="Admin Panel" />
        </div>
        <span className="text-xs font-bold text-[var(--main-gold-dark)] opacity-80 tracking-wider uppercase">
          Dod Tournaments
        </span>
      </div>
    </nav>
  );
}

// Custom link for animated underline
function NavLink({ to, pathname, text }) {
  const active = pathname.startsWith(to) || (to === "/" && pathname === "/");
  return (
    <Link
      to={to}
      className={`relative transition-all px-2 py-1
        ${active ? "text-[var(--main-gold)]" : "text-[var(--main-gold-dark)]"}
        hover:text-[var(--main-gold)] focus:text-[var(--main-gold-dark)]`}
      style={{ transition: "color 0.22s" }}
    >
      <span>{text}</span>
      <span
        className="absolute left-0 -bottom-0.5 w-full h-[2.5px] rounded bg-[var(--main-gold)] transition-all duration-200"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scaleX(1)" : "scaleX(0.4)",
        }}
      />
    </Link>
  );
}
