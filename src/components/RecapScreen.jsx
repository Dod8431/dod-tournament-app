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
    }).catch(e => {
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
        className="w-full max-w-2xl rounded-2xl shadow-2xl border-4"
        style={{
          background: `linear-gradient(140deg, var(--main-dark) 60%, var(--main-bg) 100%)`,
          borderColor: 'var(--main-gold)',
          boxShadow: `0 6px 40px 0 var(--main-gold-dark)`
        }}
      >
        <div className="flex flex-col gap-3 p-8">
          <h2 className="text-2xl font-extrabold mb-2 text-[var(--main-gold)] tracking-tight drop-shadow"
              style={{textShadow: "0 2px 16px var(--main-gold-dark)"}}
          >
            <span className="inline-block mr-2" role="img" aria-label="gold medal">🏆</span>
            Your Votes — Round {tournament.currentRound}
          </h2>
          {myVotes.length === 0 ? (
            <div className="text-[var(--main-gold-dark)] text-lg font-semibold px-4 py-3 rounded-xl bg-[var(--main-dark)]/70 border border-[var(--main-gold-dark)]">
              No votes yet!
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {myVotes.map((v, i) => {
                const match = (tournament.bracket.find(r => r.round === tournament.currentRound)?.matches || []).find(m => m.id === v.matchId);
                const votedVid = tournament.videos.find(x => x.id === v.votedFor);
                return (
                  <li
                    className="flex gap-4 items-center bg-[var(--main-dark)] rounded-xl px-5 py-4 border-2"
                    key={i}
                    style={{
                      borderColor: 'var(--main-gold)',
                      boxShadow: "0 2px 14px 0 var(--main-gold-dark)"
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
                        className="rounded-lg border-2 border-[var(--main-gold-dark)]"
                      ></iframe>
                    ) : (
                      <div className="w-[140px] h-[80px] bg-[var(--main-gold-dark)] rounded-lg flex items-center justify-center text-xs text-[var(--main-gold)] border-2 border-[var(--main-gold)]">
                        No video
                      </div>
                    )}
                    <span className="font-bold text-lg text-[var(--main-gold)] drop-shadow" style={{textShadow:"0 1px 6px var(--main-gold-dark)"}}>
                      Voted: <span className="text-[var(--main-gold-dark)]">{votedVid?.title ? votedVid.title : "Unknown"}</span>
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
