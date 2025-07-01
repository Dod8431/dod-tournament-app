import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listenTournament, submitVote } from '../firebase/firestore';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Defensive user fetch
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        navigate(`/tournament/${tid}/join`);
      }
      return;
    }
    const unsub = listenTournament(tid, (data) => {
      setTournament(data);
      setLoading(false);
      const round = data.currentRound;
      const rBracket = data.bracket?.find?.(r => r.round === round);
      setMatches(rBracket ? rBracket.matches : []);
    });
    return () => unsub && unsub();
    // eslint-disable-next-line
  }, [tid]);

  const handleReveal = (idx, side) => {
    setSelected(prev => ({ ...prev, [`${idx}_${side}_revealed`]: true }));
  };

  const handleVote = async (match, voteFor) => {
    if (!match || !user) return;
    await submitVote(tid, user.userId, tournament.currentRound, match.id, voteFor);
    setSelected(prev => ({ ...prev, [match.id]: voteFor }));
    if (currentIdx < matches.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setVoted(true);
    }
  };

  // BLANK/LOADING states
  if (loading || !tournament) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center min-h-screen text-red-700">User not found. Please join tournament.</div>;

  if (!Array.isArray(matches) || matches.length === 0) {
    return <div className="flex justify-center items-center min-h-screen text-lg">No matches available for voting in this round.</div>;
  }

  // Recap state
  const votedRef = useRef(false);
  if (voted && !votedRef.current) {
    votedRef.current = true;
    setTimeout(() => navigate(`/tournament/${tid}/recap`), 1200);
    return <div className="flex justify-center items-center min-h-screen text-2xl font-bold">Round submitted! Loading recap...</div>;
  }

  // Defensive: handle match
  const match = matches[currentIdx];
  if (!match) return <div className="flex justify-center items-center min-h-screen text-red-600">No match data</div>;

  const videoA = tournament.videos?.find?.(v => v.id === match.videoAId);
  const videoB = tournament.videos?.find?.(v => v.id === match.videoBId);

  if (!videoA || !videoB) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Video data missing</div>;
  }

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
