import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament, advanceRound } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';

const themeClasses = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200",
  retro: "bg-yellow-200 text-pink-700 font-mono",
  meme: "bg-green-200 text-purple-900 font-bold",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black"
};

function AdminPanel() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = listenTournament(tid, (data) => {
      setTournament(data);
      setCanAdvance(true); // Always allow admin to proceed
    });
    return () => unsub && unsub();
  }, [tid]);

  async function handleAdvance() {
    setLoading(true);
    const currentRound = tournament.currentRound;
    const thisRound = tournament.bracket.find(r => r.round === currentRound);
    let winners = [];
    for (const match of thisRound.matches) {
      const votesA = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoAId).length;
      const votesB = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoBId).length;
      const winnerId = votesA >= votesB ? match.videoAId : match.videoBId;
      winners.push(winnerId);
    }
    let nextMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) {
        nextMatches.push({
          id: crypto.randomUUID(),
          videoAId: winners[i],
          videoBId: winners[i + 1],
          votesA: 0,
          votesB: 0,
          votes: [],
          round: currentRound + 1
        });
      }
    }
    if (nextMatches.length === 0) {
      // Tournament is complete
      const winner = tournament.videos.find(v => v.id === winners[0]);
      alert("Tournament Complete! Winner: " + (winner?.title || "Unknown Video"));
      setLoading(false);
      return;
    }
    const newBracket = [
      ...tournament.bracket,
      { round: currentRound + 1, matches: nextMatches }
    ];
    await advanceRound(tid, newBracket, currentRound + 1);
    setLoading(false);
  }

  if (!tournament) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen p-6 flex flex-col items-center`;

  return (
    <div className={mainClass}>
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl w-full flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-2">Admin Panel: {tournament.title}</h2>
        <div className="text-md text-gray-700 mb-2">Current Round: {tournament.currentRound}</div>
        <div>
          <h3 className="font-semibold mb-2">Live Bracket</h3>
          <BracketDisplay tournament={tournament} />
        </div>
        <button
          className="btn btn-primary"
          disabled={!canAdvance || loading}
          onClick={handleAdvance}
        >
          {loading ? 'Advancing...' : 'Proceed to Next Round'}
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
