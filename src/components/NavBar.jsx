import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("adminPanelCodeOk") === "yes";
  }

  return (
    <nav className="w-full bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-lg fixed top-0 left-0 z-40">
      <div className="flex items-center gap-6 font-bold text-lg">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        {isAdmin && (
          <Link
            to="/my-tournaments"
            className={pathname.startsWith("/my-tournaments") ? "text-blue-400 font-bold" : ""}
          >
            My Tournaments
          </Link>
        )}
        <Link
          to="/admin"
          className={pathname.startsWith("/admin") ? "text-blue-400 font-bold" : ""}
        >
          Admin Panel
        </Link>
      </div>
      <span className="text-xs opacity-60">YouTube Tournament App</span>
    </nav>
  );
}
