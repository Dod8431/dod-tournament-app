import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listenTournament, submitVote } from "../firebase/firestore";
import FaceOffPanel from "./FaceOffPanel";
import {
  saveUserProgress,
  loadUserProgress,
} from "../firebase/firestore";

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

  // Charger tournoi + progression
  useEffect(() => {
    if (!user) {
      navigate(`/tournament/${tid}/join`);
      return;
    }
    const unsub = listenTournament(tid, async (data) => {
      setTournament(data);
      setLoading(false);

      const round = data.currentRound;
      const rBracket = data.bracket?.find?.((r) => r.round === round);
      setMatches(rBracket ? rBracket.matches : []);

      const progress = await loadUserProgress(user.userId, tid);
  if (progress) {
    // 🔹 Si le round a changé → reset
    if (progress.currentRound !== round) {
      setCurrentIdx(0);
      setSelected({});
      saveUserProgress(user.userId, tid, {
        currentRound: round,
        currentMatch: 0,
        selected: {},
      });
    } else {
      setCurrentIdx(progress.currentMatch || 0);
      setSelected(progress.selected || {});
    }
  }
});
    return () => unsub && unsub();
    // eslint-disable-next-line
  }, [tid]);

  useEffect(() => {
    setVoteRegistered(false);
    setCurrentVote(null);
  }, [currentIdx]);

  // 🔹 Écrans intermédiaires
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)] text-[var(--gold)] text-xl">
        Redirecting...
      </div>
    );
  }

  if (loading || !tournament) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="u-card animate-fade-up text-center font-bold text-xl text-[var(--gold)]">
          Loading Tournament…
        </div>
      </div>
    );
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="u-card text-center">
          <div className="text-2xl font-bold text-[var(--text)]">
            No matches available
          </div>
          <div className="text-[var(--text-dim)] mt-2">
            Wait for the admin to start this round.
          </div>
        </div>
      </div>
    );
  }

  if (voted) {
    setTimeout(() => navigate(`/tournament/${tid}/recap`), 1200);
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="u-card animate-fade-up text-center">
          <div className="text-3xl font-black text-[var(--gold)]">
            Round submitted!
          </div>
          <div className="text-lg mt-2 text-[var(--text-dim)]">
            Loading recap…
          </div>
        </div>
      </div>
    );
  }

  const match = matches[currentIdx];
  if (!match) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="u-card text-center text-[var(--accent-bad)] font-bold text-xl">
          No match data
        </div>
      </div>
    );
  }

  const videoA = tournament.videos?.find((v) => v.id === match.videoAId);
  const videoB = tournament.videos?.find((v) => v.id === match.videoBId);

  if (!videoA || !videoB) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="u-card text-center text-[var(--accent-bad)] font-bold text-xl">
          Video data missing
        </div>
      </div>
    );
  }

  // Handlers
  const handleVote = (side) => {
    const votedVideoId = side === "A" ? videoA.id : videoB.id;
    if (!voteRegistered) {
      submitVote(
        tid,
        user.userId,
        tournament.currentRound,
        match.id,
        votedVideoId
      );
      const newSelected = { ...selected, [match.id]: votedVideoId };
      setSelected(newSelected);
      setVoteRegistered(true);
      setCurrentVote(side);

      saveUserProgress(user.userId, tid, {
        currentRound: tournament.currentRound,
        currentMatch: currentIdx,
        selected: newSelected,
      });
    }
  };

  const handleNextMatch = () => {
    if (currentIdx < matches.length - 1) {
      const newIdx = currentIdx + 1;
      setCurrentIdx(newIdx);
      saveUserProgress(user.userId, tid, {
        currentRound: tournament.currentRound,
        currentMatch: newIdx,
        selected,
      });
    } else {
      setVoted(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] flex items-center justify-center">
      <FaceOffPanel
        videoA={videoA}
        videoB={videoB}
        revealedA={!!selected[`${currentIdx}_A_revealed`]}
        revealedB={!!selected[`${currentIdx}_B_revealed`]}
        onRevealA={() => {
          const newSelected = {
            ...selected,
            [`${currentIdx}_A_revealed`]: true,
          };
          setSelected(newSelected);
          saveUserProgress(user.userId, tid, {
            currentRound: tournament.currentRound,
            currentMatch: currentIdx,
            selected: newSelected,
          });
        }}
        onRevealB={() => {
          const newSelected = {
            ...selected,
            [`${currentIdx}_B_revealed`]: true,
          };
          setSelected(newSelected);
          saveUserProgress(user.userId, tid, {
            currentRound: tournament.currentRound,
            currentMatch: currentIdx,
            selected: newSelected,
          });
        }}
        onVote={handleVote}
        voteRegistered={voteRegistered}
        votedFor={currentVote}
        onNextMatch={handleNextMatch}
        progressIndicator={
          <div className="mt-4 text-center">
            <span className="u-pill">
              Round {tournament.currentRound} – Match {currentIdx + 1} /{" "}
              {matches.length}
            </span>
          </div>
        }
      />
    </div>
  );
}

export default VotingPanel;
