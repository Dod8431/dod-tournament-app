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
      className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-[var(--main-dark)]/80 border-b border-[var(--line)]"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--gold)] hover:opacity-90 transition"
        >
          Dod<span className="text-[var(--text)]"> Tournaments</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-3 sm:gap-6 font-semibold text-sm sm:text-base">
          <NavLink to="/" pathname={pathname} text="Home" />
          {isAdmin && (
            <NavLink to="/my-tournaments" pathname={pathname} text="My Tournaments" />
          )}
          <NavLink to="/admin" pathname={pathname} text="Admin Panel" />
        </div>
      </div>
    </nav>
  );
}

// Custom link with pill underline
function NavLink({ to, pathname, text }) {
  const active = pathname.startsWith(to) || (to === "/" && pathname === "/");
  return (
    <Link
      to={to}
      className={`relative px-3 py-1 rounded-full transition-all
        ${active
          ? "text-[var(--gold)] bg-[var(--main-dark)] border border-[var(--gold)]"
          : "text-[var(--text-dim)] hover:text-[var(--gold)]"}
      `}
      style={{ transition: "all 0.25s" }}
    >
      {text}
    </Link>
  );
}
