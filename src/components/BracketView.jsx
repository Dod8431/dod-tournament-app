import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenTournament } from '../firebase/firestore';
import BracketDisplay from './BracketDisplay';

const themeClasses = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200",
  retro: "bg-yellow-200 text-pink-700 font-mono",
  meme: "bg-green-200 text-purple-900 font-bold",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black"
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (!Array.isArray(tournament.bracket) || tournament.bracket.length === 0)
    return <div className="flex justify-center items-center min-h-screen text-lg">No bracket available.</div>;

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen w-screen p-0 flex flex-col items-stretch`;

  return (
    <div className={mainClass} style={{ minHeight: "100vh", width: "100vw", padding: 0, margin: 0 }}>
      <h2 className="text-2xl font-bold mb-6 text-center pt-8">Live Bracket</h2>
      <BracketDisplay tournament={tournament} />
    </div>
  );
}

export default BracketView;
