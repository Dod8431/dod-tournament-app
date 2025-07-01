import React, { useEffect, useState } from "react";
import { getAllActiveTournaments } from "../firebase/firestore";

// Violet palette
const palette = {
  bg: "bg-[#16002b]",
  grad: "bg-gradient-to-br from-[#240046] via-[#3c096c] to-[#10002b]",
  card: "bg-[#3c096c]/90 border-[#b36ef3]",
  accent: "text-[#e0aaff]",
  accent2: "text-[#c77dff]",
  accent3: "text-[#7b2cbf]",
  border: "border-[#c77dff]",
  muted: "text-[#b36ef3]",
  error: "text-[#ff99ba]",
  shadow: "shadow-[0_2px_32px_#10002b70]",
};

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
    <div className={`min-h-screen w-full ${palette.grad} py-14 px-3 flex flex-col items-center`}>
      <h1
        className="font-black text-4xl md:text-5xl mb-12 bg-[#240046a0] text-[#e0aaff] px-10 py-4 rounded-2xl border-4 border-[#c77dff] drop-shadow-lg tracking-tight animate-fade-in"
        style={{backdropFilter: "blur(3px)", boxShadow: "0 8px 48px #7b2cbf44"}}
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
              className={`block transition-all duration-200 rounded-3xl p-7 ${palette.card} ${palette.border} border-2 ${palette.shadow} hover:scale-[1.05] hover:border-[#e0aaff] group`}
              style={{ boxShadow: "0 2px 28px #200a3350" }}
            >
              <div className={`text-2xl font-extrabold mb-2 ${palette.accent2} group-hover:text-[#e0aaff]`}>
                {t.title || <span className={palette.error}>Untitled</span>}
              </div>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-xs font-semibold uppercase text-[#e0aaff]">Videos:</span>
                <span className="text-sm font-bold text-[#c77dff]">{Array.isArray(t.videos) ? t.videos.length : 0}</span>
              </div>
            </a>
          );
        })}
      </div>
      {tournaments.length === 0 && (
        <div className="mt-16 text-xl font-semibold text-[#c77dff] bg-[#240046c0] px-6 py-4 rounded-xl border-2 border-[#7b2cbf] shadow">
          No tournaments right now.
        </div>
      )}
    </div>
  );
}
