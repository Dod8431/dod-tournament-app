import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, submitVote, listenTournament } from '../firebase/firestore';
import FaceOffPanel from './FaceOffPanel';


const themeClasses = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200",
  retro: "bg-yellow-200 text-pink-700 font-mono",
  meme: "bg-green-200 text-purple-900 font-bold",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black"
};

function VotingPanel() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [voted, setVoted] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));

  useEffect(() => {
    if (!user) navigate(`/tournament/${tid}/join`);
    const unsub = listenTournament(tid, (data) => {
      setTournament(data);
      const round = data.currentRound;
      const rBracket = data.bracket.find(r => r.round === round);
      setMatches(rBracket ? rBracket.matches : []);
    });
    return () => unsub && unsub();
  }, [tid]);

  const handleReveal = (idx, side) => {
    setSelected(prev => ({ ...prev, [`${idx}_${side}_revealed`]: true }));
  };

  const handleVote = async (match, voteFor) => {
    await submitVote(tid, user.userId, tournament.currentRound, match.id, voteFor);
    setSelected(prev => ({ ...prev, [match.id]: voteFor }));
    if (currentIdx < matches.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setVoted(true);
    }
  };

  if (!tournament) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!matches.length) return <div className="flex justify-center items-center min-h-screen">No matches yet</div>;
  if (voted) {
    setTimeout(() => navigate(`/tournament/${tid}/recap`), 1200);
    return <div className="flex justify-center items-center min-h-screen text-2xl font-bold">Round submitted! Loading recap...</div>;
  }

  const match = matches[currentIdx];
  const videoA = tournament.videos.find(v => v.id === match.videoAId);
  const videoB = tournament.videos.find(v => v.id === match.videoBId);

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen flex flex-col items-center justify-center p-4`;

  return (
    <FaceOffPanel
  videoA={videoA}
  videoB={videoB}
  revealedA={!!selected[`${currentIdx}_A_revealed`]}
  revealedB={!!selected[`${currentIdx}_B_revealed`]}
  onRevealA={() => handleReveal(currentIdx, 'A')}
  onRevealB={() => handleReveal(currentIdx, 'B')}
  onVote={id => handleVote(match, id)}
/>
  );
}

export default VotingPanel;
