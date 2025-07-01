import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';

// Custom theme background
const themeBg = {
  violet: "bg-gradient-to-br from-[--main-bg] via-[#3c096c] to-[--main-bg]", // Updated with solid color
  dark: "bg-[#10002b]", // Dark background
};

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

  if (loading || !tournament)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#10002b]">
        <span className="text-[#E5E7EB] font-bold text-xl animate-pulse">Loading...</span>
      </div>
    );

  if (!Array.isArray(tournament.bracket) || tournament.bracket.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#10002b]">
        <span className="text-lg text-[#E5E7EB]/70">No bracket available.</span>
      </div>
    );

  return (
    <div className={`${themeBg.violet} min-h-screen w-screen flex flex-col items-stretch`} style={{ minHeight: "100vh", width: "100vw" }}>
      <div className="max-w-7xl w-full mx-auto pt-12 px-2">
        <h2 className="text-4xl font-black tracking-tight text-center mb-8 text-[#E5E7EB] drop-shadow animate-fade-in">
          Live Tournament Bracket
        </h2>
        <div className="animate-fade-in">
          <BracketDisplay tournament={tournament} />
        </div>
      </div>
    </div>
  );
}

export default BracketView;
