import React from "react";
import MyTournaments from "./MyTournaments";

export default function AdminPanelHome() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#10002b] via-[#3c096c] to-[#240046] flex flex-col items-center justify-start py-16 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#240046]/90 rounded-2xl shadow-2xl border-2 border-[#7b2cbf] px-8 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-10 text-[#c77dff] tracking-wider drop-shadow-lg">
          Admin Panel
        </h1>
        <MyTournaments />
      </div>
    </div>
  );
}
