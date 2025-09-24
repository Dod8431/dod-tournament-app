import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, addUserToTournament } from '../firebase/firestore';

function JoinTournament() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Vérifie si un user est déjà enregistré → skip direct vers vote
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
    setError('');
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--main-bg)] px-4">
        <div className="u-card border-[#ff6584] text-[#ff6584]">
          <h2 className="text-2xl font-extrabold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)]">
        <span className="text-[var(--main-gold)] font-bold animate-pulse text-xl">
          Loading tournament...
        </span>
      </div>
    );
  }

  const isClosed = tournament.isActive === false;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)]">
      <div className="u-card w-full max-w-lg p-10 animate-fade-in flex flex-col gap-6">
        
        {/* Header */}
        <h2 className="text-3xl font-black text-center text-[var(--main-gold)] drop-shadow">
          Join Tournament
        </h2>
        <div className="text-center">
          <p className="text-lg font-semibold text-[var(--main-gold-dark)]">
            {tournament.title || <span className="text-[#ff6584]">Untitled</span>}
          </p>
        </div>

        {isClosed && (
          <div className="text-[#ff6584] font-bold text-center text-base bg-[#ff658422] border border-[#ff6584] rounded-lg px-4 py-2">
            🚫 This tournament is closed.
          </div>
        )}

        {/* Form */}
        {!isClosed && (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <input
              className="rounded-xl px-4 py-3 text-base bg-[var(--main-bg)] border border-[var(--main-gold-dark)] focus:ring-2 focus:ring-[var(--main-gold)] text-[var(--main-gold)] outline-none transition text-center font-semibold"
              required
              placeholder="Enter your nickname"
              value={username}
              maxLength={24}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl px-6 py-3 font-extrabold tracking-wide text-lg shadow bg-[var(--main-gold)] hover:bg-[var(--main-gold-dark)] text-[var(--main-dark)] transition-all duration-300 focus:ring-2 focus:ring-[var(--main-gold)] focus:outline-none disabled:opacity-60"
            >
              {loading ? "Joining..." : "Join & Vote"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default JoinTournament;
