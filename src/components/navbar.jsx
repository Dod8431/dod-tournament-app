import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-lg fixed top-0 left-0 z-40">
      <div className="flex items-center gap-6 font-bold text-lg">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/my-tournaments" className={pathname.startsWith("/my-tournaments") ? "text-blue-400 font-bold" : ""}>My Tournaments</Link>
        <Link to="/admin" className={pathname.startsWith("/admin") ? "text-blue-400 font-bold" : ""}>Admin Panel</Link>
        <Link to="/create" className={pathname.startsWith("/create") ? "text-blue-400 font-bold" : ""}>Create Tournament</Link>
      </div>
      <span className="text-xs opacity-60">YouTube Tournament App</span>
    </nav>
  );
}
