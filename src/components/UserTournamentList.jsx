import React, { useEffect, useState } from "react";
import { getAllActiveTournaments, getAllArchivedTournaments } from "../firebase/firestore";

export default function UserTournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [archivedTournaments, setArchivedTournaments] = useState([]);

  useEffect(() => {
    getAllActiveTournaments().then(data => setTournaments(Array.isArray(data) ? data : []));
    getAllArchivedTournaments().then(data => setArchivedTournaments(Array.isArray(data) ? data : []));
  }, []);

  function safeTournamentId(id) {
    return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
  }

  function getRoundBadge(roundName) {
    if (!roundName) return null;
    if (roundName.includes("Final")) {
      if (roundName === "Final") return <>🏆 <span>{roundName}</span> 🏆</>;
      if (roundName === "Semi-finals") return <>🥇 <span>{roundName}</span> 🥇</>;
      return <span>{roundName}</span>;
    }
    if (roundName === "Quarter-finals") return <>✨ <span>{roundName}</span> ✨</>;
    return <span>{roundName}</span>;
  }

  function getRoundNameBasedOnVideos(currentRound, videoCount) {
    const roundMapping = {
      128: ["Last 128", "Last 64", "Last 32", "Last 16", "Quarter-finals", "Semi-finals", "Final"],
      64: ["Last 64", "Last 32", "Last 16", "Quarter-finals", "Semi-finals", "Final"],
      32: ["Last 32", "Last 16", "Quarter-finals", "Semi-finals", "Final"],
      16: ["Last 16", "Quarter-finals", "Semi-finals", "Final"],
      8: ["Quarter-finals", "Semi-finals", "Final"],
      4: ["Semi-finals", "Final"],
      2: ["Final"]
    };
    if (roundMapping[videoCount] && currentRound <= roundMapping[videoCount].length) {
      return roundMapping[videoCount][currentRound - 1];
    }
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--main-bg)] via-[var(--main-dark)] to-[var(--main-dark)] py-14 px-3 flex flex-col items-center">
      
      {/* Title */}
      <h1
        className="font-black text-4xl md:text-5xl mb-12 text-[var(--main-gold)] px-10 py-4 rounded-2xl drop-shadow-lg tracking-tight animate-fade-in"
        style={{ textShadow: "0 4px 20px var(--main-gold-dark)" }}
      >
        🎮 Ongoing Tournaments
      </h1>

      {/* Ongoing Tournaments */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {tournaments.map((t) => {
          const safeId = safeTournamentId(t.id);
          if (!safeId) return null;

          const videoCount = Array.isArray(t.videos) ? t.videos.length : 0;
          const roundName = getRoundNameBasedOnVideos(t.currentRound, videoCount);

          return (
            <a
              key={safeId}
              href={`/tournament/${safeId}/vote`}
              className="block transition-all duration-300 rounded-3xl p-7 bg-gradient-to-br from-[var(--main-dark)] to-[var(--main-bg)] border-2 border-[var(--main-gold)] shadow-xl hover:scale-[1.04] hover:-translate-y-1 hover:border-[var(--main-gold-dark)] hover:shadow-2xl group"
            >
              <div className="flex flex-col gap-3 items-center text-center">
                {/* Title */}
                <div className="text-2xl font-extrabold text-[var(--main-gold-dark)] group-hover:text-[var(--main-gold)] transition">
                  {t.title || <span className="text-[#ff99ba]">Untitled</span>}
                </div>

                {/* Round Badge */}
                {roundName && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-300/90 to-[var(--main-gold)] text-[var(--main-dark)] font-extrabold text-sm shadow ring-2 ring-[var(--main-gold-dark)] animate-fade-in">
                    🟢 {getRoundBadge(roundName)}
                  </span>
                )}

                {/* Video Count */}
                <div className="flex gap-2 items-center bg-[var(--main-dark)]/80 px-3 py-1 rounded-xl">
                  <span className="text-xs font-semibold uppercase text-[var(--main-gold-dark)]">Videos:</span>
                  <span className="text-sm font-bold text-[var(--main-gold)]">{videoCount}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {tournaments.length === 0 && (
        <div className="mt-16 text-xl font-semibold text-[var(--main-gold-dark)] bg-[var(--main-dark)]/80 px-6 py-4 rounded-xl border-2 border-[var(--main-gold-dark)] shadow">
          No tournaments available right now.
        </div>
      )}

      {/* Archived Section */}
      <h2 className="font-black text-3xl mt-20 mb-6 text-[var(--main-gold)] drop-shadow">
        🏅 Archived Tournaments
      </h2>
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6 mb-10">
        {archivedTournaments.length === 0 && (
          <div className="text-lg text-[var(--main-gold-dark)]">No archived tournaments.</div>
        )}
        {archivedTournaments.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center p-5 rounded-2xl bg-[var(--main-dark)]/90 border-2 border-[var(--main-gold-dark)] shadow-lg hover:scale-[1.01] transition"
          >
            <div className="font-bold text-[var(--main-gold)] text-lg">
              {t.title || "Untitled"}
            </div>
            <div className="italic text-[var(--main-gold-dark)]">
              Winner: <span className="font-extrabold text-[var(--main-gold)]">🏆 {t.winner || "TBD"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
