import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listenTournament, submitVote } from '../firebase/firestore';
import FaceOffPanel from './FaceOffPanel';
import { saveUserProgress, loadUserProgress } from "../firebase/firestore";

const bgClass = "bg-[var(--main-bg)]";
const accentText = "text-[var(--main-gold)]";
const errorText = "text-[#ff6f91]";
const borderClass = "border-4 border-[var(--main-gold-dark)]";

function VotingPanel() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voteRegistered, setVoteRegistered] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));
  } catch (e) {}

  useEffect(() => {
    if (!user) {
      navigate(`/tournament/${tid}/join`);
      return;
    }
    const unsub = listenTournament(tid, async (data) => {
      console.log(">>> Tournament data loaded", data);

      setTournament(data);
      setLoading(false);

      const round = data.currentRound;
      const rBracket = data.bracket?.find?.(r => r.round === round);
      setMatches(rBracket ? rBracket.matches : []);

      // Charger progression utilisateur
      const progress = await loadUserProgress(user.userId, tid);
      console.log(">>> Loaded progress from Firestore", progress);

      if (progress) {
        console.log(">>> Restoring state from progress", progress);
        setCurrentIdx(progress.currentMatch || 0);
        setSelected(progress.selected || {});
      }
    });
    return () => unsub && unsub();
    // eslint-disable-next-line
  }, [tid]);

  useEffect(() => {
    setVoteRegistered(false);
    setCurrentVote(null);
  }, [currentIdx]);

  if (!user) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass} ${accentText} text-xl`}>
        Redirecting...
      </div>
    );
  }

  if (loading || !tournament) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass}`}>
        <div className={`px-8 py-6 rounded-2xl font-bold text-2xl animate-fade-in ${accentText} ${borderClass} shadow-lg`}>
          Loading Tournament...
        </div>
      </div>
    );
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass}`}>
        <div className={`px-8 py-6 rounded-2xl font-bold text-2xl ${accentText} ${borderClass} shadow-lg`}>
          No matches available for voting in this round.
        </div>
      </div>
    );
  }

  if (voted) {
    setTimeout(() => navigate(`/tournament/${tid}/recap`), 1200);
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass}`}>
        <div className="animate-fade-in-up px-8 py-6 rounded-2xl font-black text-3xl text-[var(--main-gold)] border-4 border-[var(--main-gold-dark)] shadow-2xl">
          <span>Round submitted!</span>
          <div className="text-lg font-normal mt-2 text-[var(--main-gold-dark)] opacity-70">Loading recap...</div>
        </div>
      </div>
    );
  }

  const match = matches[currentIdx];
  if (!match) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass}`}>
        <div className={`px-8 py-6 rounded-2xl font-bold text-2xl ${errorText} border-4 border-[#ff99ba]`}>
          No match data
        </div>
      </div>
    );
  }

  const videoA = tournament.videos?.find?.(v => v.id === match.videoAId);
  const videoB = tournament.videos?.find?.(v => v.id === match.videoBId);

  if (!videoA || !videoB) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${bgClass}`}>
        <div className={`px-8 py-6 rounded-2xl font-bold text-2xl ${errorText} border-4 border-[#ff99ba]`}>
          Video data missing
        </div>
      </div>
    );
  }

  const handleVote = side => {
    const votedVideoId = side === "A" ? videoA.id : videoB.id;
    if (!voteRegistered) {
      console.log(">>> Submitting vote", { matchId: match.id, votedVideoId });
      submitVote(tid, user.userId, tournament.currentRound, match.id, votedVideoId);
      const newSelected = { ...selected, [match.id]: votedVideoId };
      setSelected(newSelected);
      setVoteRegistered(true);
      setCurrentVote(side);

      saveUserProgress(user.userId, tid, {
        currentRound: tournament.currentRound,
        currentMatch: currentIdx,
        selected: newSelected
      });
    }
  };

  const handleNextMatch = () => {
    if (currentIdx < matches.length - 1) {
      const newIdx = currentIdx + 1;
      console.log(">>> Moving to next match", newIdx);
      setCurrentIdx(newIdx);
      saveUserProgress(user.userId, tid, {
        currentRound: tournament.currentRound,
        currentMatch: newIdx,
        selected
      });
    } else {
      console.log(">>> All matches done, submitting round");
      setVoted(true);
    }
  };

  return (
    <div className={`min-h-screen w-full ${bgClass} flex items-center justify-center`}>
     <FaceOffPanel
  videoA={videoA}
  videoB={videoB}
  revealedA={!!selected[`${currentIdx}_A_revealed`]}
  revealedB={!!selected[`${currentIdx}_B_revealed`]}
  onRevealA={() => {
    const newSelected = { ...selected, [`${currentIdx}_A_revealed`]: true };
    setSelected(newSelected);
    saveUserProgress(user.userId, tid, {
      currentRound: tournament.currentRound,
      currentMatch: currentIdx,
      selected: newSelected
    });
  }}
  onRevealB={() => {
    const newSelected = { ...selected, [`${currentIdx}_B_revealed`]: true };
    setSelected(newSelected);
    saveUserProgress(user.userId, tid, {
      currentRound: tournament.currentRound,
      currentMatch: currentIdx,
      selected: newSelected
    });
  }}
  onVote={handleVote}
  voteRegistered={voteRegistered}
  votedFor={currentVote}
  onNextMatch={handleNextMatch}
  // 👇 nouvelle prop
  progressIndicator={
    <div className="mt-4 text-center font-bold text-[var(--main-gold)]">
      Round {tournament.currentRound} – Match {currentIdx + 1} / {matches.length}
    </div>
  }
/>

    </div>
  );
}

export default VotingPanel;
