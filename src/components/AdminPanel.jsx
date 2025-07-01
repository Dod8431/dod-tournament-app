import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';
import { advanceRound, crownWinner } from '../firebase/firestore'; // Adjusted import path

// Custom theme background
const themeBg = {
  violet: "bg-gradient-to-br from-[var(--main-dark)] via-[var(--main-gold-dark)] to-[var(--main-gold)]",
  dark: "bg-[var(--main-bg)]",
};

function AdminPanel() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [winner, setWinner] = useState(null);
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
      const finalWinner = tournament.videos.find(v => v.id === winners[0]);
      // Crown winner
      await crownWinner(tid, finalWinner?.title || "Unknown Video");
      setWinner(finalWinner?.title || "Unknown Video");
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
      <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)] text-[var(--main-gold)] animate-fade-in">
        Loading...
      </div>
    );

  return (
    <div className={`${themeBg.violet} min-h-screen w-full flex flex-col items-stretch`}>
      <div className="flex justify-center items-center w-full min-h-screen">
        <div className="mx-auto w-full max-w-7xl p-8 my-16 rounded-2xl bg-[var(--main-dark)] border-2 border-[var(--main-gold-dark)] shadow-2xl flex flex-col gap-6 animate-fade-in">
          <h2 className="text-3xl font-black mb-2 text-[var(--main-gold)] drop-shadow tracking-wider">
            Admin Panel: <span className="text-[var(--main-accent)]">{tournament.title}</span>
          </h2>
          <div className="text-lg text-[var(--main-gold-dark)] font-bold mb-2">
            Current Round: <span className="text-white">{tournament.currentRound}</span>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[var(--main-gold-dark)] text-lg">Live Bracket</h3>
            <BracketDisplay tournament={tournament} />
          </div>

          {winner && (
            <div className="winner-banner bg-yellow-200 text-xl font-bold rounded-xl px-6 py-4 shadow-lg text-center my-8">
              🎉 Tournament Winner: <span className="text-[var(--main-gold-dark)]">{winner}</span> 🎉
            </div>
          )}

          <button
            className={`py-4 px-8 rounded-xl bg-gradient-to-r from-[#EF4444] via-[#9d4edd] to-[#3B82F6] text-[var(--main-dark)] font-black text-lg tracking-wide shadow-xl border-2 border-[#3B82F6] hover:from-[#3B82F6] hover:to-[#EF4444] transition-all duration-200 active:scale-95 mt-8 mx-auto`}
            disabled={!canAdvance || loading}
            onClick={handleAdvance}
          >
            {loading ? 'Advancing...' : 'Proceed to Next Round'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
