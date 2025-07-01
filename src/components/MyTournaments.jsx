import React, { useEffect, useState } from "react";
import { getTournamentsByAdmin, archiveTournament, deleteTournament } from "../firebase/firestore";

function getLocalAdminId() {
  let id = localStorage.getItem("adminId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("adminId", id);
  }
  return id;
}
function safeId(id) {
  return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
}

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const adminId = getLocalAdminId();

  useEffect(() => {
    getTournamentsByAdmin(adminId).then(data => {
      if (!Array.isArray(data)) setTournaments([]);
      else setTournaments(data);
    });
  }, [adminId, loading]);

  function isClosed(t) {
    if (t.isActive === false) return true;
    if (!t.bracket?.length) return false;
    const last = t.bracket[t.bracket.length - 1];
    return last?.matches?.length === 1 && t.currentRound === last.round && last.matches[0].videoBId === undefined;
  }
  const ongoing = tournaments.filter(t => !isClosed(t));
  const closed = tournaments.filter(isClosed);

  async function handleArchive(id) {
    if (!safeId(id)) return;
    if (window.confirm("Archive this tournament?")) {
      setLoading(true);
      await archiveTournament(id);
      setLoading(false);
    }
  }
  async function handleDelete(id) {
    if (!safeId(id)) return;
    if (window.confirm("Delete this tournament? This cannot be undone!")) {
      setLoading(true);
      await deleteTournament(id);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)] text-[var(--main-gold-dark)]"
    >
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-black mb-10 tracking-tight text-center text-[var(--main-gold)] drop-shadow">
          My Tournaments
        </h1>
        <div className="flex flex-col gap-10">
          {/* Ongoing */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-[var(--main-gold-dark)]">Ongoing</h2>
            {ongoing.length === 0 && (
              <div className="rounded-xl px-4 py-3 text-base font-medium bg-[var(--main-dark)] text-[var(--main-gold-dark)] shadow-inner">
                No ongoing tournaments yet.
              </div>
            )}
            <ul className="space-y-4">
              {ongoing.map(t => {
                const id = safeId(t.id);
                if (!id) return null;
                return (
                  <li
                    key={id}
                    className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-[var(--main-dark)]/90 border-l-8 border-[var(--main-gold)] rounded-2xl shadow-md p-5 transition hover:scale-[1.015]"
                  >
                    <a
                      href={`/tournament/${id}/admin`}
                      className="font-extrabold text-lg text-[var(--main-gold)] hover:underline"
                    >
                      {t.title || <span className="text-[#ff6584]">Untitled</span>}
                    </a>
                    <span className="ml-1 text-xs text-[var(--main-gold-dark)]">
                      (Created {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"})
                    </span>
                    <div className="flex flex-row gap-2 ml-auto">
                      <button
                        className="px-3 py-1 rounded-lg font-semibold bg-[var(--main-gold)] text-[var(--main-dark)] shadow hover:bg-[var(--main-gold-dark)] hover:text-[var(--main-gold)] transition"
                        onClick={() => handleArchive(id)}
                        disabled={loading}
                      >Archive</button>
                      <button
                        className="px-3 py-1 rounded-lg font-semibold bg-[#ff6584] text-white shadow hover:bg-[#ff88a1] transition"
                        onClick={() => handleDelete(id)}
                        disabled={loading}
                      >Delete</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Closed */}
          <div>
            <h2 className="text-2xl font-bold mt-6 mb-3 text-[var(--main-gold-dark)]">Closed</h2>
            {closed.length === 0 && (
              <div className="rounded-xl px-4 py-3 text-base font-medium bg-[var(--main-dark)] text-[var(--main-gold-dark)] shadow-inner">
                No closed tournaments yet.
              </div>
            )}
            <ul className="space-y-4">
              {closed.map(t => {
                const id = safeId(t.id);
                if (!id) return null;
                return (
                  <li
                    key={id}
                    className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-[var(--main-dark)]/75 border-l-8 border-[var(--main-gold-dark)] rounded-2xl shadow-md p-5"
                  >
                    <a
                      href={`/tournament/${id}/admin`}
                      className="font-bold text-[var(--main-gold-dark)] hover:underline"
                    >
                      {t.title || <span className="text-[#ff6584]">Untitled</span>}
                    </a>
                    <span className="ml-1 text-xs text-[var(--main-gold)]">
                      (Last active {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"})
                    </span>
                    <button
                      className="px-3 py-1 rounded-lg font-semibold bg-[#ff6584] text-white shadow hover:bg-[#ff88a1] transition ml-auto"
                      onClick={() => handleDelete(id)}
                      disabled={loading}
                    >Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <a
          href="/create"
          className="inline-block mt-12 bg-[var(--main-gold)] hover:bg-[var(--main-gold-dark)] text-[var(--main-dark)] py-3 px-8 rounded-2xl font-extrabold text-lg shadow-xl transition-all duration-200 focus:ring-2 focus:ring-[var(--main-gold)] focus:outline-none"
        >
          + Create Tournament
        </a>
      </div>
    </div>
  );
}
