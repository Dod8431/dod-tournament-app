import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, addUserToTournament } from '../firebase/firestore';

const themeClasses = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200",
  retro: "bg-yellow-200 text-pink-700 font-mono",
  meme: "bg-green-200 text-purple-900 font-bold",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black"
};

function JoinTournament() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTournament(tid).then(setTournament);
  }, [tid]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      userId: crypto.randomUUID(),
      username,
      joinedAt: Date.now(),
    };
    localStorage.setItem(`tourn_${tid}_user`, JSON.stringify(user));
    await addUserToTournament(tid, user);
    setLoading(false);
    navigate(`/tournament/${tid}/vote`);
  };

  if (!tournament) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen flex flex-col items-center justify-center p-4`;

  return (
    <div className={mainClass}>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">Join Tournament</h2>
        <div className="font-semibold text-lg">{tournament.title}</div>
        <div className="text-sm text-gray-500 mb-2">Theme: {tournament.theme}</div>
        <form onSubmit={handleJoin} className="flex flex-col gap-3">
          <input className="input input-bordered" required placeholder="Enter a username" value={username} onChange={e => setUsername(e.target.value)} />
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Joining...' : 'Join & Vote'}</button>
        </form>
      </div>
    </div>
  );
}

export default JoinTournament;
