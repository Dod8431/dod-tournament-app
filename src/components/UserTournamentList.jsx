import React, { useEffect, useState } from "react";
import { getAllActiveTournaments } from "../firebase/firestore";

export default function UserTournamentList() {
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    getAllActiveTournaments().then(data => {
      // Debug: log all tournaments for quick diagnosis!
      console.log("[UserTournamentList] tournaments:", data);
      setTournaments(Array.isArray(data) ? data : []);
    });
  }, []);

  function safeTournamentId(id) {
    return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8">Ongoing Tournaments</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t, i) => {
          const safeId = safeTournamentId(t.id);
          if (!safeId) {
            // Debug log any tournaments with invalid IDs
            console.warn("Skipping tournament with invalid id:", t);
            return null;
          }
          return (
            <a
              key={safeId}
              href={`/tournament/${safeId}/vote`}
              className="block bg-white rounded-2xl p-6 shadow-xl hover:scale-105 transition border-2 border-transparent hover:border-blue-400"
            >
              <div className="font-bold text-xl mb-2">{t.title || <span className="text-red-600">Untitled</span>}</div>
              <div className="text-xs mb-1">Theme: {t.theme || <span className="text-gray-400">unknown</span>}</div>
              <div className="text-xs opacity-70">Videos: {Array.isArray(t.videos) ? t.videos.length : 0}</div>
            </a>
          );
        })}
      </div>
      {tournaments.length === 0 && <div className="text-gray-500 mt-8">No tournaments right now.</div>}
    </div>
  );
}
