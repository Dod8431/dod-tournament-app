import React from 'react';

// Minimalist SVG-style bracket visualization for unlimited rounds
export default function BracketDisplay({ tournament }) {
  if (!tournament?.bracket) return null;
  const maxMatches = Math.max(...tournament.bracket.map(r => r.matches.length));
  return (
    <div className="overflow-x-auto w-full flex justify-center pb-10">
      <div className="flex gap-8">
        {tournament.bracket.map((round, ridx) => (
          <div key={ridx} className="flex flex-col gap-4">
            <div className="font-bold text-lg text-center">Round {round.round}</div>
            {round.matches.map((m, i) => {
              const vidA = tournament.videos.find(v => v.id === m.videoAId);
              const vidB = tournament.videos.find(v => v.id === m.videoBId);
              return (
                <div key={m.id} className="bg-white rounded-lg shadow p-2 min-w-[220px] flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <span className="font-bold text-blue-700 text-center text-base">{vidA?.title || 'A'}</span>
                    <span className="text-gray-400 text-xs">vs</span>
                    <span className="font-bold text-pink-700 text-center text-base">{vidB?.title || 'B'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Votes A: {(tournament.votes||[]).filter(v=>v.matchId===m.id&&v.votedFor===m.videoAId).length} | Votes B: {(tournament.votes||[]).filter(v=>v.matchId===m.id&&v.votedFor===m.videoBId).length}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
