import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';

function BracketView() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenTournament(tid, (data) => {
      setTournament(data);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [tid]);

  if (loading || !tournament) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)]">
        <div className="text-[var(--main-gold)] font-bold text-xl animate-pulse">
          Loading tournament...
        </div>
      </div>
    );
  }

  if (!Array.isArray(tournament.bracket) || tournament.bracket.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)]">
        <span className="text-lg text-[var(--main-gold-dark)]">
          No bracket available for this tournament.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--main-bg)] via-[var(--main-dark)] to-[var(--main-gold-dark)]">
      <div className="max-w-7xl w-full mx-auto pt-16 pb-12 px-4 flex flex-col gap-10">
        
        {/* Header */}
        <header className="text-center animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--main-gold)] drop-shadow">
            {tournament.title || "Live Tournament Bracket"}
          </h2>
          <p className="mt-3 text-[var(--main-gold-dark)] font-semibold tracking-wide">
            Round {tournament.currentRound}
          </p>
        </header>

        {/* Bracket content */}
        <div className="u-card p-6 animate-fade-in">
          <BracketDisplay tournament={tournament} />
        </div>
      </div>
    </div>
  );
}

export default BracketView;
