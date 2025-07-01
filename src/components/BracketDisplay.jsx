import React from 'react';

// Palette for theme
const roundColors = [
  "from-[#3c096c] to-[#7b2cbf]",   // Round 1
  "from-[#5a189a] to-[#9d4edd]",   // Round 2
  "from-[#240046] to-[#3c096c]",   // Round 3
  "from-[#7b2cbf] to-[#c77dff]",   // Round 4+
];

export default function BracketDisplay({ tournament }) {
  if (!tournament?.bracket || !Array.isArray(tournament.bracket)) return null;
  if (!Array.isArray(tournament.videos)) return <div className="text-red-500">No videos data</div>;
  if (tournament.bracket.length === 0) return <div className="text-gray-500">No rounds available.</div>;

  return (
    <div className="overflow-x-auto w-full flex justify-center pb-10">
      <div className="flex gap-10 min-h-[350px]">
        {tournament.bracket.map((round, ridx) => (
          <div
            key={ridx}
            className={`
              flex flex-col gap-5 min-w-[250px]
              bg-gradient-to-b ${roundColors[ridx % roundColors.length]} rounded-2xl shadow-lg border-2 border-[#7b2cbf]/50 px-4 py-3
            `}
          >
            <div className="font-extrabold text-xl text-center tracking-wider text-[#e0aaff] drop-shadow pb-2">
              Round {round.round}
            </div>
            {(round.matches || []).map((m, i) => {
              const vidA = tournament.videos.find(v => v.id === m.videoAId);
              const vidB = tournament.videos.find(v => v.id === m.videoBId);
              return (
                <div
                  key={m.id}
                  className="
                    bg-[#240046] border-2 border-[#9d4edd]/70 rounded-xl shadow-xl flex flex-col items-center py-4 px-2
                    hover:border-[#c77dff] transition-all
                  "
                >
                  <div className="w-full flex flex-col items-center">
                    <span className="font-bold text-[#c77dff] text-lg text-center max-w-[200px] truncate">{vidA?.title || 'A'}</span>
                    <span className="text-[#e0aaff]/70 text-sm my-1">vs</span>
                    <span className="font-bold text-[#7b2cbf] text-lg text-center max-w-[200px] truncate">{vidB?.title || 'B'}</span>
                  </div>
                  <div className="text-xs text-[#e0aaff]/80 mt-3">
                    <span className="font-semibold text-[#c77dff]">A:</span> {(tournament.votes || []).filter(v => v.matchId === m.id && v.votedFor === m.videoAId).length}
                    <span className="mx-1 text-[#e0aaff]/50">|</span>
                    <span className="font-semibold text-[#7b2cbf]">B:</span> {(tournament.votes || []).filter(v => v.matchId === m.id && v.votedFor === m.videoBId).length}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
