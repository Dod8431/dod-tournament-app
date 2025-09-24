import React from "react";
import MyTournaments from "./MyTournaments";

export default function AdminPanelHome() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--main-bg)] via-[var(--main-dark)] to-[var(--main-gold-dark)] py-16 px-6 animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--main-gold)] drop-shadow mb-2">
            Admin Panel
          </h1>
          <div className="h-1 w-24 mx-auto bg-[var(--main-gold)] rounded-full shadow-md"></div>
          <p className="mt-4 text-[var(--main-gold-dark)] text-lg tracking-wide">
            Manage and monitor your tournaments
          </p>
        </header>

        {/* Content */}
        <div className="u-card p-8 flex flex-col gap-6">
          <MyTournaments />
        </div>
      </div>
    </div>
  );
}
