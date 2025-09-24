import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament } from '../firebase/firestore';

function RecapScreen() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [myVotes, setMyVotes] = useState(null);
  const [error, setError] = useState("");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));
  } catch (e) { user = null; }
  const navigate = useNavigate();

  useEffect(() => {
    if (!tid) {
      setError("Invalid tournament ID.");
      return;
    }
    getTournament(tid).then(data => {
      setTournament(data);
      if (!user) {
        setMyVotes([]);
        return;
      }
      const my = (data.votes || []).filter(
        v => v.userId === user.userId && v.roundNum === data.currentRound
      );
      setMyVotes(my);
    }).catch(() => {
      setError("Error loading tournament data.");
    });
  }, [tid]);

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)] text-[#ff99ba]">
      <div className="bg-[var(--main-dark)] text-[#ff99ba] rounded-2xl p-8 shadow-lg text-xl font-bold border-2 border-[var(--main-gold)]">
        {error}
      </div>
    </div>
  );

  if (!tournament || !myVotes)
    return <div className="flex justify-center items-center min-h-screen bg-[var(--main-bg)]">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-[var(--main-bg)]">
      <div
        className="w-full max-w-3xl rounded-2xl shadow-2xl border-4"
        style={{
          background: `linear-gradient(140deg, var(--main-dark) 60%, var(--main-bg) 100%)`,
          borderColor: 'var(--main-gold)',
          boxShadow: `0 6px 40px 0 var(--main-gold-dark)`
        }}
      >
        <div className="flex flex-col gap-6 p-8">
          <h2
            className="text-2xl font-extrabold text-[var(--main-gold)] tracking-tight drop-shadow mb-4"
            style={{ textShadow: "0 2px 16px var(--main-gold-dark)" }}
          >
            🏆 Your Votes — Round {tournament.currentRound}
          </h2>

          {myVotes.length === 0 ? (
            <div className="text-[var(--main-gold-dark)] text-lg font-semibold px-4 py-3 rounded-xl bg-[var(--main-dark)]/70 border border-[var(--main-gold-dark)]">
              No votes yet!
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {myVotes.map((v, i) => {
                const round = tournament.bracket.find(r => r.round === tournament.currentRound);
                const match = round?.matches.find(m => m.id === v.matchId);

                const vidA = tournament.videos.find(x => x.id === match?.videoAId);
                const vidB = tournament.videos.find(x => x.id === match?.videoBId);

                const votesA = (tournament.votes || []).filter(
                  (vote) => vote.matchId === match?.id && vote.votedFor === match?.videoAId
                ).length;
                const votesB = (tournament.votes || []).filter(
                  (vote) => vote.matchId === match?.id && vote.votedFor === match?.videoBId
                ).length;

                const totalVotes = votesA + votesB;
                const percentA = totalVotes ? (votesA / totalVotes) * 100 : 0;
                const percentB = totalVotes ? (votesB / totalVotes) * 100 : 0;

                return (
                  <li
                    key={i}
                    className="bg-[var(--main-dark)] rounded-xl border-2 p-5 shadow-md"
                    style={{
                      borderColor: "var(--main-gold)",
                      boxShadow: "0 2px 12px 0 var(--main-gold-dark)",
                    }}
                  >
                    {/* Titres */}
                    <div className="text-center mb-3">
                      <div
                        className={`font-bold ${
                          percentA > percentB
                            ? "text-blue-400"
                            : "text-[var(--text-dim)]"
                        }`}
                      >
                        {vidA?.title || "Video A"}
                      </div>
                      <div className="text-sm text-[var(--text-dim)]">vs</div>
                      <div
                        className={`font-bold ${
                          percentB > percentA
                            ? "text-red-400"
                            : "text-[var(--text-dim)]"
                        }`}
                      >
                        {vidB?.title || "Video B"}
                      </div>
                    </div>

                    {/* Barres */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-blue-400">Blue Side</span>
                          <span className="text-[var(--text-dim)]">{votesA} votes</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--line)] rounded-full">
                          <div
                            className={`h-full bg-blue-500 rounded-full ${
                              percentA > percentB ? "shadow-[0_0_6px_var(--gold)]" : ""
                            }`}
                            style={{ width: `${percentA}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-red-400">Red Side</span>
                          <span className="text-[var(--text-dim)]">{votesB} votes</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--line)] rounded-full">
                          <div
                            className={`h-full bg-red-500 rounded-full ${
                              percentB > percentA ? "shadow-[0_0_6px_var(--gold)]" : ""
                            }`}
                            style={{ width: `${percentB}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Résumé du joueur */}
                    <div className="mt-4 text-center font-bold text-[var(--main-gold)]">
                      You voted for:{" "}
                      <span className="text-[var(--main-gold-dark)]">
                        {tournament.videos.find(x => x.id === v.votedFor)?.title || "Unknown"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecapScreen;
