import React, { useState } from "react";

export default function AdminGate({ children }) {
  const [code, setCode] = useState("");
  const [ok, setOk] = useState(localStorage.getItem("adminPanelCodeOk") === "yes");

  function handleCheck(e) {
    e.preventDefault();
    if (code === "8431") {
      localStorage.setItem("adminPanelCodeOk", "yes");
      setOk(true);
    } else {
      alert("Incorrect code.");
    }
  }

  if (ok) return children;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <form onSubmit={handleCheck} className="bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col items-center gap-3">
        <h2 className="text-2xl font-bold mb-2">Admin Panel Access</h2>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          type="password"
          className="input input-bordered text-center"
          placeholder="Enter Admin Code"
          autoFocus
        />
        <button className="btn btn-primary mt-2">Enter</button>
      </form>
    </div>
  );
}
