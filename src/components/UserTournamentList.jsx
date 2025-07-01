import React, { useEffect, useState } from "react";
import { getAllActiveTournaments } from "../firebase/firestore";

export default function UserTournamentList() {
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    getAllActiveTournaments().then(data => {
      setTournaments(Array.isArray(data) ? data : []);
    });
  }, []);

  function safeTournamentId(id) {
    return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--main-bg)] via-[var(--main-dark)] to-[var(--main-dark)] py-14 px-3 flex flex-col items-center">
      <h1
        className="font-black text-4xl md:text-5xl mb-12 bg-[var(--main-dark)]/80 text-[var(--main-gold)] px-10 py-4 rounded-2xl border-4 border-[var(--main-gold)] drop-shadow-lg tracking-tight animate-fade-in"
        style={{
          backdropFilter: "blur(3px)",
          boxShadow: "0 8px 48px var(--main-gold-dark), 0 2px 32px var(--main-dark)",
        }}
      >
        Ongoing Tournaments
      </h1>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {tournaments.map((t, i) => {
          const safeId = safeTournamentId(t.id);
          if (!safeId) return null;
          return (
            <a
              key={safeId}
              href={`/tournament/${safeId}/vote`}
              className="block transition-all duration-200 rounded-3xl p-7 bg-[var(--main-dark)]/90 border-2 border-[var(--main-gold)] shadow-lg hover:scale-[1.05] hover:border-[var(--main-gold-dark)] group"
              style={{ boxShadow: "0 2px 28px var(--main-dark)" }}
            >
              <div className="text-2xl font-extrabold mb-2 text-[var(--main-gold-dark)] group-hover:text-[var(--main-gold)]">
                {t.title || (
                  <span className="text-[#ff99ba]">Untitled</span>
                )}
              </div>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-xs font-semibold uppercase text-[var(--main-gold-dark)]">Videos:</span>
                <span className="text-sm font-bold text-[var(--main-gold)]">
                  {Array.isArray(t.videos) ? t.videos.length : 0}
                </span>
              </div>
            </a>
          );
        })}
      </div>
      {tournaments.length === 0 && (
        <div className="mt-16 text-xl font-semibold text-[var(--main-gold-dark)] bg-[var(--main-dark)]/80 px-6 py-4 rounded-xl border-2 border-[var(--main-gold-dark)] shadow">
          No tournaments right now.
        </div>
      )}
    </div>
  );
}
