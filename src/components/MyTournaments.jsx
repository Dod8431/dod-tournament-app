import React, { useEffect, useState } from "react";
import { getTournamentsByAdmin, archiveTournament, deleteTournament } from "../firebase/firestore";

// Ensure a persistent adminId in localStorage
function getLocalAdminId() {
  let id = localStorage.getItem("adminId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("adminId", id);
  }
  return id;
}

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const adminId = getLocalAdminId();

  useEffect(() => {
    getTournamentsByAdmin(adminId).then(setTournaments);
  }, [adminId, loading]);

  function isClosed(t) {
    if (t.isActive === false) return true;
    if (!t.bracket?.length) return false;
    const last = t.bracket[t.bracket.length - 1];
    return last?.matches?.length === 1 && t.currentRound === last.round && last.matches[0].videoBId === undefined;
  }

  const ongoing = tournaments.filter(t => !isClosed(t));
  const closed = tournaments.filter(isClosed);

  // --- NEW: ARCHIVE AND DELETE BUTTONS ---
  async function handleArchive(id) {
    if (window.confirm("Archive this tournament?")) {
      setLoading(true);
      await archiveTournament(id);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this tournament? This cannot be undone!")) {
      setLoading(true);
      await deleteTournament(id);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">My Tournaments</h1>
      <div>
        <h2 className="text-xl mb-2">Ongoing</h2>
        {ongoing.length === 0 && <div className="text-gray-400 mb-2">No ongoing tournaments yet.</div>}
        <ul className="mb-6">
          {ongoing.map(t => (
            <li key={t.id} className="mb-2 flex items-center gap-4">
              <a href={`/tournament/${t.id}/admin`} className="underline font-semibold">{t.title}</a>
              <span className="ml-2 text-xs text-gray-400">
                (Created {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"})
              </span>
              <button
                className="bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded-lg text-xs ml-2"
                onClick={() => handleArchive(t.id)}
                disabled={loading}
              >Archive</button>
              <button
                className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg text-xs ml-2"
                onClick={() => handleDelete(t.id)}
                disabled={loading}
              >Delete</button>
            </li>
          ))}
        </ul>
        <h2 className="text-xl mt-6 mb-2">Closed</h2>
        {closed.length === 0 && <div className="text-gray-400 mb-2">No closed tournaments yet.</div>}
        <ul>
          {closed.map(t => (
            <li key={t.id} className="mb-2 flex items-center gap-4">
              <a href={`/tournament/${t.id}/admin`} className="underline font-semibold">{t.title}</a>
              <span className="ml-2 text-xs text-gray-400">
                (Last active {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"})
              </span>
              <button
                className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg text-xs ml-2"
                onClick={() => handleDelete(t.id)}
                disabled={loading}
              >Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <a
        href="/create"
        className="inline-block mt-8 bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-xl font-bold shadow-md"
      >
        + Create Tournament
      </a>
    </div>
  );
}
