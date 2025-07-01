import React, { useEffect, useState } from "react";
import { getAllActiveTournaments } from "../firebase/firestore";

export default function UserTournamentList() {
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    getAllActiveTournaments().then(setTournaments);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8">Ongoing Tournaments</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map(t => (
          <a key={t.id} href={`/tournament/${t.id}/vote`} className="block bg-white rounded-2xl p-6 shadow-xl hover:scale-105 transition border-2 border-transparent hover:border-blue-400">
            <div className="font-bold text-xl mb-2">{t.title}</div>
            <div className="text-xs mb-1">Theme: {t.theme}</div>
            <div className="text-xs opacity-70">Videos: {t.videos?.length || 0}</div>
          </a>
        ))}
      </div>
      {tournaments.length === 0 && <div className="text-gray-500 mt-8">No tournaments right now.</div>}
    </div>
  );
}
