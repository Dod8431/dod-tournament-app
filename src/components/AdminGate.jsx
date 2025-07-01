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
    <div className="min-h-screen flex items-center justify-center bg-[#10002b] text-white">
      <form
        onSubmit={handleCheck}
        className="bg-[#240046] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-5 border-2 border-[#9d4edd] transition-all animate-fade-in"
        style={{ minWidth: 340 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-[#c77dff] tracking-wide drop-shadow">
          Admin Panel Access
        </h2>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          type="password"
          className="w-full px-4 py-3 rounded-xl bg-[#3c096c] text-white border-2 border-[#7b2cbf] focus:ring-2 focus:ring-[#9d4edd] text-center text-lg font-mono outline-none transition-all"
          placeholder="Enter Admin Code"
          autoFocus
        />
        <button
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#9d4edd] via-[#7b2cbf] to-[#5a189a] text-white font-extrabold tracking-widest shadow-lg hover:from-[#c77dff] hover:to-[#7b2cbf] transition-all duration-200 text-lg"
          type="submit"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
