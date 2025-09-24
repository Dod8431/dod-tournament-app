import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listenTournament, advanceRound, crownWinner } from "../firebase/firestore";
import BracketDisplay from "./BracketDisplay";

export default function AdminPanel() {
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
    if (!tournament) return;
    setLoading(true);
    const currentRound = tournament.currentRound;
    const thisRound = tournament.bracket.find((r) => r.round === currentRound);

    let winners = [];
    for (const match of thisRound.matches) {
      const votesA = (tournament.votes || []).filter(
        (v) => v.matchId === match.id && v.votedFor === match.videoAId
      ).length;
      const votesB = (tournament.votes || []).filter(
        (v) => v.matchId === match.id && v.votedFor === match.videoBId
      ).length;
      const winnerId = votesA >= votesB ? match.videoAId : match.videoBId;
      winners.push(winnerId);
    }

    // S'il reste un seul gagnant → couronne le champion
    if (winners.length === 1) {
      const finalWinner = tournament.videos.find((v) => v.id === winners[0]);
      await crownWinner(tid, finalWinner?.title || "Unknown Video");
      setWinner(finalWinner?.title || "Unknown Video");
      setLoading(false);
      return;
    }

    // Génère le prochain tour
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
          round: currentRound + 1,
        });
      }
    }

    const newBracket = [
      ...tournament.bracket,
      { round: currentRound + 1, matches: nextMatches },
    ];
    await advanceRound(tid, newBracket, currentRound + 1);
    setLoading(false);
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)] text-[var(--gold)] animate-fade-in">
        Loading Tournament…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] flex flex-col pt-20 px-4">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-fade-in">
        {/* Header */}
        <div className="u-card flex flex-col gap-2 p-6 text-center">
          <h2 className="text-3xl font-black text-[var(--gold)] tracking-wide">
            Admin Panel
          </h2>
          <h3 className="text-xl font-bold text-[var(--text)]">
            {tournament.title}
          </h3>
          <div className="text-sm text-[var(--text-dim)]">
            Current Round:{" "}
            <span className="u-pill bg-[var(--gold)] text-[var(--dark)]">
              {tournament.currentRound}
            </span>
          </div>
        </div>

{/* Bracket */}
<div className="u-card p-6 overflow-x-auto">
  <h3 className="font-semibold mb-4 text-[var(--gold)] text-lg">
    Live Bracket
  </h3>
  <div className="min-w-max">
    <BracketDisplay tournament={tournament} />
  </div>
</div>


        {/* Winner banner */}
        {winner && (
          <div className="u-card text-center py-6">
            <div className="text-2xl font-black text-[var(--gold)] animate-bounce">
              🎉 Tournament Winner 🎉
            </div>
            <div className="text-xl mt-2 font-bold text-[var(--text)]">
              {winner}
            </div>
          </div>
        )}

        {/* Action button */}
        {!winner && (
          <button
            className={`u-btn u-btn--primary text-lg py-4 ${
              (!canAdvance || loading) && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!canAdvance || loading}
            onClick={handleAdvance}
          >
            {loading ? "Advancing…" : "Proceed to Next Round"}
          </button>
        )}
      </div>
    </div>
  );
}
