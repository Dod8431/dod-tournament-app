import React, { useEffect, useState } from "react";
import { getAllActiveTournaments, getAllArchivedTournaments } from "../firebase/firestore";

export default function UserTournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [archivedTournaments, setArchivedTournaments] = useState([]);

  useEffect(() => {
    // Fetch ongoing tournaments
    getAllActiveTournaments().then(data => {
      setTournaments(Array.isArray(data) ? data : []);
    });

    // Fetch archived tournaments
    getAllArchivedTournaments().then(data => {
      setArchivedTournaments(Array.isArray(data) ? data : []);
    });
  }, []);

  function safeTournamentId(id) {
    return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
  }

  // Add icon/emojis for special rounds
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
      64: ["Last 64", "Last 32", "Last 16", "Quarter-finals", "Semi-finals", "Final", ""],
      32: ["Last 32", "Last 16", "Quarter-finals", "Semi-finals", "Final", "", ""],
      16: ["Last 16", "Quarter-finals", "Semi-finals", "Final", "", "", ""],
      8: ["Quarter-finals", "Semi-finals", "Final", "", "", "", ""],
      4: ["Semi-finals", "Final", "", "", "", "", ""],
      2: ["Final", "", "", "", "", "", ""]
    };
    if (roundMapping[videoCount] && currentRound <= roundMapping[videoCount].length) {
      return roundMapping[videoCount][currentRound - 1];
    }
    return null;
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

          const videoCount = Array.isArray(t.videos) ? t.videos.length : 0;
          const roundName = getRoundNameBasedOnVideos(t.currentRound, videoCount);

          return (
            <a
              key={safeId}
              href={`/tournament/${safeId}/vote`}
              className="block transition-all duration-200 rounded-3xl p-7 bg-gradient-to-br from-[var(--main-dark)] to-[var(--main-bg)] border-2 border-[var(--main-gold)] shadow-lg hover:scale-[1.03] hover:border-[var(--main-gold-dark)] hover:shadow-2xl group"
              style={{ boxShadow: "0 2px 28px var(--main-dark)" }}
            >
              <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-extrabold text-[var(--main-gold-dark)] group-hover:text-[var(--main-gold)] text-center mb-2">
                  {t.title || (
                    <span className="text-[#ff99ba]">Untitled</span>
                  )}
                </div>
                {/* ROUND BADGE */}
                {roundName && (
                  <span className="
                    inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-full
                    bg-gradient-to-r from-yellow-300/80 to-[var(--main-gold)] text-[var(--main-dark)]
                    font-extrabold text-base shadow-md ring-2 ring-[var(--main-gold-dark)] animate-fade-in
                  ">
                    {getRoundBadge(roundName)}
                  </span>
                )}
                <div className="flex gap-2 items-center mt-2 bg-[var(--main-dark)]/80 px-3 py-1 rounded-xl">
                  <span className="text-xs font-semibold uppercase text-[var(--main-gold-dark)]">Videos:</span>
                  <span className="text-sm font-bold text-[var(--main-gold)]">
                    {videoCount}
                  </span>
                </div>
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

      {/* Archived Tournaments */}
      <h2 className="font-black text-2xl md:text-3xl mt-16 mb-6 text-[var(--main-gold)]">
        Archived Tournaments
      </h2>
      <div className="w-full max-w-2xl grid grid-cols-1 gap-6 mb-10">
        {archivedTournaments.length === 0 && (
          <div className="text-lg text-[var(--main-gold-dark)]">No archived tournaments.</div>
        )}
        {archivedTournaments.map((t, i) => (
          <div key={t.id} className="flex justify-between items-center p-4 rounded-xl bg-[var(--main-dark)] border-2 border-[var(--main-gold)] shadow">
            <div className="font-semibold text-[var(--main-gold)]">{t.title || "Untitled"}</div>
            <div className="italic text-[var(--main-gold-dark)]">Winner: <span className="font-bold">{t.winner || "TBD"}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
