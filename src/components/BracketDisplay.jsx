import React, { useState, useEffect } from "react";

const BracketDisplay = ({ tournament }) => {
  const [usernames, setUsernames] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Helper: get username
  const getUsername = (userId) => {
    const user = tournament.users?.find((u) => u.userId === userId);
    return user ? user.username : userId;
  };

  // Préparer map userId -> username
  useEffect(() => {
    if (tournament?.votes) {
      const userVotes = {};
      tournament.votes.forEach((vote) => {
        if (!userVotes[vote.userId]) {
          userVotes[vote.userId] = getUsername(vote.userId);
        }
      });
      setUsernames(userVotes);
    }
  }, [tournament]);

  if (!tournament?.bracket?.length) {
    return <div className="text-[var(--text-dim)]">No bracket available.</div>;
  }

  return (
    <div className="overflow-x-auto w-full flex justify-center pb-10">
      <div className="flex gap-8 flex-col sm:flex-row min-w-max px-6">
        {tournament.bracket.map((round) => (
          <div
            key={round.round}
            className="u-card flex flex-col gap-4 min-w-[280px] px-4 py-5"
          >
            <h3 className="text-lg font-bold text-center text-[var(--gold)]">
              Round {round.round}
            </h3>

            {(round.matches || []).map((match) => {
              const vidA = tournament.videos.find((v) => v.id === match.videoAId);
              const vidB = tournament.videos.find((v) => v.id === match.videoBId);

              const votesA = (tournament.votes || []).filter(
                (v) => v.matchId === match.id && v.votedFor === match.videoAId
              ).length;
              const votesB = (tournament.votes || []).filter(
                (v) => v.matchId === match.id && v.votedFor === match.videoBId
              ).length;

              const totalVotes = votesA + votesB;
              const percentA = totalVotes ? (votesA / totalVotes) * 100 : 0;
              const percentB = totalVotes ? (votesB / totalVotes) * 100 : 0;

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="bg-[var(--main-dark)] border border-[var(--line)] rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                >
                  {/* Titres : A toujours bleu, B toujours rouge */}
                  <div className="text-center mb-2">
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

                  {/* Deux barres distinctes */}
                  <div className="mt-3 w-full flex flex-col gap-2">
                    {/* A */}
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

                    {/* B */}
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

                  {/* Votes bruts en bas */}
                  <div className="flex justify-between text-xs mt-2 text-[var(--text-dim)]">
                    <span>A: {votesA}</span>
                    <span>B: {votesB}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Votes détaillés */}
      {selectedMatch && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="u-card p-6 relative">
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-2 right-3 text-[var(--text-dim)] hover:text-[var(--gold)]"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-[var(--gold)] mb-3">
              Votes Details
            </h3>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">Votes A</h4>
              <ul className="mb-3 text-sm">
                {tournament.votes
                  .filter(
                    (vote) =>
                      vote.matchId === selectedMatch.id &&
                      vote.votedFor === selectedMatch.videoAId
                  )
                  .map((vote, i) => (
                    <li key={i}>{usernames[vote.userId] || vote.userId}</li>
                  ))}
              </ul>
              <h4 className="font-semibold text-red-400 mb-1">Votes B</h4>
              <ul className="text-sm">
                {tournament.votes
                  .filter(
                    (vote) =>
                      vote.matchId === selectedMatch.id &&
                      vote.votedFor === selectedMatch.videoBId
                  )
                  .map((vote, i) => (
                    <li key={i}>{usernames[vote.userId] || vote.userId}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketDisplay;
