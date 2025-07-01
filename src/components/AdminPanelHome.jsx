import React from "react";
import MyTournaments from "./MyTournaments";

export default function AdminPanelHome() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[var(--main-bg)] via-[var(--main-dark)] to-[var(--main-gold-dark)] py-16 animate-fade-in">
      {/* Removed container max-width constraint */}
      <div className="w-full h-full flex justify-center items-center p-8">
        <div className="w-full h-full p-8 rounded-2xl bg-[var(--main-dark)]/90 border-2 border-[var(--main-gold-dark)] shadow-2xl flex flex-col gap-6 animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-10 text-[var(--main-gold)] tracking-wider drop-shadow-lg">
            Admin Panel
          </h1>
          <MyTournaments />
        </div>
      </div>
    </div>
  );
}
