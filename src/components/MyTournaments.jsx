import React, { useState, useEffect } from "react";
import {
  getTournamentsByAdmin,
  archiveTournament,
  deleteTournament,
} from "../firebase/firestore";

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
    getTournamentsByAdmin(adminId).then((data) => {
      if (!Array.isArray(data)) setTournaments([]);
      else setTournaments(data);
    });
  }, [adminId, loading]);

  function isClosed(t) {
    if (t.isActive === false) return true;
    if (!t.bracket?.length) return false;
    const last = t.bracket[t.bracket.length - 1];
    return (
      last?.matches?.length === 1 &&
      t.currentRound === last.round &&
      last.matches[0].videoBId === undefined
    );
  }

  const ongoing = tournaments.filter((t) => !isClosed(t));
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)] text-[var(--main-gold-dark)]">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-center text-[var(--main-gold)] drop-shadow-lg">
          My Tournaments
        </h1>

        <div className="flex flex-col gap-12">
          {/* Ongoing */}
          <section>
            <h2 className="text-2xl font-extrabold mb-4 text-[var(--main-gold-dark)]">
              🟢 Ongoing
            </h2>
            {ongoing.length === 0 && (
              <div className="u-card text-center font-semibold">
                No ongoing tournaments yet.
              </div>
            )}
            <ul className="space-y-5">
              {ongoing.map((t) => {
                const id = safeId(t.id);
                if (!id) return null;
                return (
                  <li
                    key={id}
                    className="u-card flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-l-8 border-[var(--main-gold)]"
                  >
                    <div className="flex-1">
                      <a
                        href={`/tournament/${id}/admin`}
                        className="font-bold text-lg text-[var(--main-gold)] hover:underline"
                      >
                        {t.title || (
                          <span className="text-[#ff6584]">Untitled</span>
                        )}
                      </a>
                      <div className="text-xs text-[var(--main-gold-dark)] mt-1">
                        Created{" "}
                        {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"}
                      </div>
                    </div>

                    <div className="flex flex-row gap-2 ml-auto">
                      <button
                        className="px-4 py-2 rounded-lg font-semibold bg-[var(--main-gold)] text-[var(--main-dark)] shadow hover:bg-[var(--main-gold-dark)] hover:text-[var(--main-gold)] transition disabled:opacity-60"
                        onClick={() => handleArchive(id)}
                        disabled={loading}
                      >
                        {loading ? "..." : "Archive"}
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg font-semibold bg-[#ff6584] text-white shadow hover:bg-[#ff88a1] transition disabled:opacity-60"
                        onClick={() => handleDelete(id)}
                        disabled={loading}
                      >
                        {loading ? "..." : "Delete"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Closed */}
          <section>
            <h2 className="text-2xl font-extrabold mb-4 text-[var(--main-gold-dark)]">
              🔴 Closed
            </h2>
            {closed.length === 0 && (
              <div className="u-card text-center font-semibold">
                No closed tournaments yet.
              </div>
            )}
            <ul className="space-y-5">
              {closed.map((t) => {
                const id = safeId(t.id);
                if (!id) return null;
                return (
                  <li
                    key={id}
                    className="u-card flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-l-8 border-[var(--main-gold-dark)]"
                  >
                    <div className="flex-1">
                      <a
                        href={`/tournament/${id}/admin`}
                        className="font-bold text-[var(--main-gold-dark)] hover:underline"
                      >
                        {t.title || (
                          <span className="text-[#ff6584]">Untitled</span>
                        )}
                      </a>
                      <div className="text-xs text-[var(--main-gold)] mt-1">
                        Last active{" "}
                        {t.createdAt?.toDate?.().toLocaleString?.() || "unknown"}
                      </div>
                    </div>

                    <button
                      className="px-4 py-2 rounded-lg font-semibold bg-[#ff6584] text-white shadow hover:bg-[#ff88a1] transition disabled:opacity-60 ml-auto"
                      onClick={() => handleDelete(id)}
                      disabled={loading}
                    >
                      {loading ? "..." : "Delete"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/create"
            className="inline-block mt-14 bg-[var(--main-gold)] hover:bg-[var(--main-gold-dark)] text-[var(--main-dark)] py-4 px-10 rounded-2xl font-extrabold text-lg shadow-xl transition-all duration-200 focus:ring-2 focus:ring-[var(--main-gold)]"
          >
            + Create Tournament
          </a>
        </div>
      </div>
    </div>
  );
}
