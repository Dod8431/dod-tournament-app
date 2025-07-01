import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament, advanceRound } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';

// All theme classes are now palette-aware by round (can expand as needed)
const themeClasses = {
  classic: "bg-gradient-to-br from-[#10002b] via-[#3c096c] to-[#240046] text-white",
  retro: "bg-gradient-to-br from-[#240046] via-[#c77dff] to-[#10002b] text-white",
  meme: "bg-gradient-to-br from-[#10002b] via-[#a100fe] to-[#7b2cbf] text-white",
  dark: "bg-[#10002b] text-white",
  light: "bg-white text-[#10002b]"
};

function AdminPanel() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = listenTournament(tid, (data) => {
      setTournament(data);
      setCanAdvance(true);
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

  if (!tournament)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#10002b] text-[#c77dff] animate-fade-in">
        Loading...
      </div>
    );

  // Palette "block" card for admin actions
  return (
    <div className={`${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen w-full p-0 flex flex-col items-stretch transition-all`}>
      <div className="mx-auto w-full max-w-3xl p-8 my-16 rounded-2xl bg-[#240046] border-2 border-[#7b2cbf] shadow-2xl flex flex-col gap-6 animate-fade-in">
        <h2 className="text-3xl font-black mb-2 text-[#c77dff] drop-shadow tracking-wider">Admin Panel: <span className="text-[#e0aaff]">{tournament.title}</span></h2>
        <div className="text-lg text-[#9d4edd] font-bold mb-2">
          Current Round: <span className="text-white">{tournament.currentRound}</span>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-[#7b2cbf] text-lg">Live Bracket</h3>
          <BracketDisplay tournament={tournament} />
        </div>
        <button
          className={`py-4 rounded-xl bg-gradient-to-r from-[#7b2cbf] via-[#9d4edd] to-[#c77dff] text-[#10002b] font-black text-lg tracking-wide shadow-xl border-2 border-[#c77dff] hover:from-[#c77dff] hover:to-[#7b2cbf] transition-all duration-200 active:scale-95`}
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
