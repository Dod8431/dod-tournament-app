import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, addUserToTournament } from '../firebase/firestore';

const palette = {
  bg: "#10002b",
  card: "#1e0039",
  border: "#9d4edd",
  accent: "#c77dff",
  white: "#f9eeff",
  error: "#ff6584",
  glass: "rgba(36,0,70,0.85)",
  shadow: "#9d4edd88",
};

function JoinTournament() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [tid]);

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
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: `linear-gradient(135deg, ${palette.bg} 80%, ${palette.card})` }}>
        <div
          className="rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col gap-2 animate-fade-in"
          style={{
            background: palette.glass,
            border: `2.5px solid ${palette.error}`,
            color: palette.white,
            boxShadow: `0 8px 32px 0 ${palette.shadow}`,
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
      <div className="flex justify-center items-center min-h-screen text-2xl" style={{ background: palette.bg }}>
        <span className="text-[#c77dff] animate-fade-in">Loading…</span>
      </div>
    );

  const isClosed = tournament.isActive === false;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${palette.bg} 80%, ${palette.card})` }}
    >
      <div
        className="p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 animate-fade-in"
        style={{
          background: palette.glass,
          border: `2.5px solid ${palette.border}`,
          color: palette.white,
          boxShadow: `0 8px 32px 0 ${palette.shadow}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-2xl font-black text-[#c77dff] mb-2 drop-shadow">Join Tournament</h2>
        <div className="font-semibold text-lg text-[#e0aaff] mb-1">
          {tournament.title || <span className="text-[#ff6584]">Untitled</span>}
        </div>
        <div className="text-sm text-[#c77dff] mb-2">
          Theme: <span className="uppercase tracking-widest">{tournament.theme || "unknown"}</span>
        </div>
        {isClosed && (
          <div className="text-[#ff6584] font-semibold text-base mb-2">
            This tournament is closed.
          </div>
        )}
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            className="rounded-xl px-4 py-3 text-base bg-[#1e0039] border border-[#7b2cbf] focus:ring-2 focus:ring-[#c77dff] text-[#e0aaff] outline-none transition"
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
            className={`rounded-2xl px-6 py-3 font-bold tracking-wide text-lg shadow bg-[#7b2cbf] hover:bg-[#c77dff] text-white transition-all duration-300 focus:ring-2 focus:ring-[#e0aaff] ${isClosed ? "opacity-60 cursor-not-allowed" : ""}`}
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
