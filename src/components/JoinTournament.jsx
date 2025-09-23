import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, addUserToTournament } from '../firebase/firestore';

function JoinTournament() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est déjà stocké (reprend automatiquement)
  useEffect(() => {
    try {
      const existingUser = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));
      if (existingUser) {
        navigate(`/tournament/${tid}/vote`);
        return;
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }

    if (!tid) {
      setError("Invalid tournament ID.");
      return;
    }
    getTournament(tid)
      .then(t => {
        if (!t) {
          setError("Tournament not found.");
        } else {
          setTournament(t);
        }
      })
      .catch(e => {
        setError("Error loading tournament.");
        console.error("getTournament error:", e);
      });
  }, [tid, navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Username required.");
      return;
    }
    setLoading(true);
    try {
      const user = {
        userId: crypto.randomUUID(),
        username,
        joinedAt: Date.now(),
      };
      localStorage.setItem(`tourn_${tid}_user`, JSON.stringify(user));
      await addUserToTournament(tid, user);
      setLoading(false);
      navigate(`/tournament/${tid}/vote`);
    } catch (err) {
      setLoading(false);
      setError("Failed to join tournament.");
      console.error("Join error:", err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)]">
        <div
          className="rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col gap-2 animate-fade-in bg-[var(--main-dark)] border-2.5 border-[#ff6584] text-[var(--main-gold)]"
          style={{
            boxShadow: "0 8px 32px 0 var(--main-gold-dark)",
            backdropFilter: "blur(10px)"
          }}
        >
          <h2 className="text-2xl font-bold text-[#ff6584] mb-1">Error</h2>
          <div className="text-base">{error}</div>
        </div>
      </div>
    );
  }

  if (!tournament)
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl bg-[var(--main-bg)]">
        <span className="text-[var(--main-gold)] animate-fade-in">Loading…</span>
      </div>
    );

  const isClosed = tournament.isActive === false;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)]"
    >
      <div
        className="p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 animate-fade-in bg-[var(--main-dark)] border-2.5 border-[var(--main-gold)] text-[var(--main-gold)]"
        style={{
          boxShadow: "0 8px 32px 0 var(--main-gold-dark)",
          backdropFilter: "blur(10px)"
        }}
      >
        <h2 className="text-2xl font-black text-[var(--main-gold)] mb-2 drop-shadow">Join Tournament</h2>
        <div className="font-semibold text-lg text-[var(--main-gold-dark)] mb-1">
          {tournament.title || <span className="text-[#ff6584]">Untitled</span>}
        </div>
        {isClosed && (
          <div className="text-[#ff6584] font-semibold text-base mb-2">
            This tournament is closed.
          </div>
        )}
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            className="rounded-xl px-4 py-3 text-base bg-[var(--main-bg)] border border-[var(--main-gold-dark)] focus:ring-2 focus:ring-[var(--main-gold)] text-[var(--main-gold)] outline-none transition"
            required
            disabled={isClosed}
            placeholder="Choose a username"
            value={username}
            maxLength={24}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
          />
          <button
            type="submit"
            className={`rounded-2xl px-6 py-3 font-bold tracking-wide text-lg shadow bg-[var(--main-gold)] hover:bg-[var(--main-gold-dark)] text-[var(--main-dark)] transition-all duration-300 focus:ring-2 focus:ring-[var(--main-gold)] focus:outline-none ${isClosed ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading || isClosed}
          >
            {loading ? 'Joining...' : 'Join & Vote'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinTournament;
