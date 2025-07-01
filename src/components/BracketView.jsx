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

  useEffect(() => {
    const unsub = listenTournament(tid, setTournament);
    return () => unsub && unsub();
  }, [tid]);

  if (!tournament) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen p-6 flex flex-col items-center`;

  // Helper to get video info
  const getVideoInfo = (id) => tournament.videos.find(v => v.id === id) || {};

  return (
  <div className={mainClass}>
    <h2 className="text-2xl font-bold mb-6">Live Bracket</h2>
    <BracketDisplay tournament={tournament} />
  </div>
);
}

export default BracketView;
