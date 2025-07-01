import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament } from '../firebase/firestore';

const palette = {
  bg: "#16002b",         // deepest
  glass: "#240046f2",    // translucent
  accent: "#c77dff",     // bright accent
  accent2: "#e0aaff",    // lighter accent
  card: "#240046",
  block: "#3c096c",
  fg: "#ecdcf8",
  muted: "#9d4edd",
  border: "#7b2cbf",
  shadow: "#200a33aa",
  error: "#ff99ba",
  errorBg: "#310087"
};

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
    }).catch(e => {
      setError("Error loading tournament data.");
    });
  }, [tid]);

  if (error) return (
    <div className="flex justify-center items-center min-h-screen" style={{background: palette.bg, color: palette.error}}>
      <div className="bg-[#310087] text-[#ff99ba] rounded-2xl p-8 shadow-lg text-xl font-bold border-2 border-[#c77dff]">
        {error}
      </div>
    </div>
  );
  if (!tournament || !myVotes)
    return <div className="flex justify-center items-center min-h-screen" style={{background: palette.bg}}>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2" style={{background: palette.bg}}>
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl border-4"
        style={{
          background: `linear-gradient(140deg, ${palette.card} 60%, ${palette.block} 100%)`,
          borderColor: palette.accent,
          boxShadow: `0 6px 40px 0 ${palette.shadow}`
        }}
      >
        <div className="flex flex-col gap-3 p-8">
          <h2 className="text-2xl font-extrabold mb-2 text-[#e0aaff] tracking-tight drop-shadow"
              style={{textShadow: "0 2px 16px #9d4edd80"}}>
            <span className="inline-block mr-2">🟣</span>
            Your Votes — Round {tournament.currentRound}
          </h2>
          {myVotes.length === 0 ? (
            <div className="text-[#b36ef3] text-lg font-semibold px-4 py-3 rounded-xl bg-[#24004670] border border-[#7b2cbf]">
              No votes yet!
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {myVotes.map((v, i) => {
                const match = (tournament.bracket.find(r => r.round === tournament.currentRound)?.matches || []).find(m => m.id === v.matchId);
                const votedVid = tournament.videos.find(x => x.id === v.votedFor);
                return (
                  <li
                    className="flex gap-4 items-center bg-[#3c096c] rounded-xl px-5 py-4 border-2"
                    key={i}
                    style={{
                      borderColor: palette.border,
                      boxShadow: "0 2px 14px 0 #10002b88"
                    }}
                  >
                    {votedVid ? (
                      <iframe
                        width="140"
                        height="80"
                        src={`https://www.youtube.com/embed/${votedVid.ytId}`}
                        title={votedVid.title || "YouTube video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg border-2 border-[#b36ef3]"
                      ></iframe>
                    ) : (
                      <div className="w-[140px] h-[80px] bg-[#7b2cbf] rounded-lg flex items-center justify-center text-xs text-[#e0aaff] border-2 border-[#c77dff]">
                        No video
                      </div>
                    )}
                    <span className="font-bold text-lg text-[#e0aaff] drop-shadow" style={{textShadow:"0 1px 6px #c77dff80"}}>
                      Voted: <span className="text-[#c77dff]">{votedVid?.title ? votedVid.title : "Unknown"}</span>
                    </span>
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
