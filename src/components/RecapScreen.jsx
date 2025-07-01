import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament } from '../firebase/firestore';

const themeClasses = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200",
  retro: "bg-yellow-200 text-pink-700 font-mono",
  meme: "bg-green-200 text-purple-900 font-bold",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black"
};

function RecapScreen() {
  const { tid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [myVotes, setMyVotes] = useState([]);
  const user = JSON.parse(localStorage.getItem(`tourn_${tid}_user`));
  const navigate = useNavigate();

  useEffect(() => {
    getTournament(tid).then(data => {
      setTournament(data);
      if (!user) return;
      const my = (data.votes || []).filter(v => v.userId === user.userId && v.roundNum === data.currentRound);
      setMyVotes(my);
    });
  }, [tid]);

  if (!tournament || !myVotes) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const mainClass = `${themeClasses[tournament.theme] || themeClasses.classic} min-h-screen flex flex-col items-center justify-center p-4`;

  return (
    <div className={mainClass}>
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-2">Your Votes for Round {tournament.currentRound}</h2>
        {myVotes.length === 0 ? <div className="text-gray-500">No votes yet!</div> : (
          <ul className="flex flex-col gap-3">
            {myVotes.map((v, i) => {
              const match = (tournament.bracket.find(r => r.round === tournament.currentRound)?.matches || []).find(m => m.id === v.matchId);
              const votedVid = tournament.videos.find(x => x.id === v.votedFor);
              return (
                <li className="bg-gray-100 rounded-xl p-3 flex gap-4 items-center" key={i}>
                  <iframe
                    width="140" height="80" src={`https://www.youtube.com/embed/${votedVid.ytId}`}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                    className="rounded-xl"
                  ></iframe>
                  <span className="font-semibold text-base">Voted: Video #{i+1}</span>
                </li>
              );
            })}
          </ul>
        )}
        <button className="btn btn-primary mt-4" onClick={() => navigate(`/tournament/${tid}/vote`)}>Back to Voting</button>
      </div>
    </div>
  );
}

export default RecapScreen;
