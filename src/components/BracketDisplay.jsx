import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Assuming you have db configured

// Custom theme colors for the progress bar
const themeColors = {
  blue: 'bg-blue-500',   // Color for Video A
  red: 'bg-red-500',     // Color for Video B
  neutral: 'bg-gray-300', // Neutral color when no leader
  background: 'bg-[#18191A]', // Background color for matchup
};

const BracketDisplay = ({ tournament }) => {
  const [usernames, setUsernames] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null); // Added state for selected match

  // Randomize the tournament videos for matchups
  const randomizeMatchups = (videos) => {
    const randomizedVideos = [...videos];
    for (let i = randomizedVideos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedVideos[i], randomizedVideos[j]] = [randomizedVideos[j], randomizedVideos[i]];
    }
    return randomizedVideos;
  };

  // Helper function to get the winning side
  const getVoteLeader = (match) => {
    const votesA = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoAId).length;
    const votesB = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoBId).length;
    return votesA > votesB ? 'A' : (votesB > votesA ? 'B' : null);
  };

  // Fetch username from the users array inside the tournament document
  const getUsername = (userId) => {
    const user = tournament.users?.find(u => u.userId === userId); // Find the user in the tournament's users array
    return user ? user.username : userId;  // Return the username or fallback to userId
  };

  // Fetch usernames for the votes (this will be done after tournament data is available)
  useEffect(() => {
    if (tournament) {
      const userVotes = {};
      tournament.votes.forEach((vote) => {
        if (!userVotes[vote.userId]) {
          const username = getUsername(vote.userId); // Get the username from tournament's users array
          userVotes[vote.userId] = username;
        }
      });
      setUsernames(userVotes); // Set the usernames state
    }
  }, [tournament]);

  if (!tournament || !tournament.bracket || !Array.isArray(tournament.bracket)) return <div>No tournament bracket available.</div>;
  if (!Array.isArray(tournament.videos)) return <div>No videos available.</div>;
  if (tournament.bracket.length === 0) return <div>No rounds available.</div>;

  // Randomize videos in the bracket
  const randomizedVideos = randomizeMatchups(tournament.videos);

  return (
    <div className="overflow-x-auto w-full flex justify-center pb-10">
      <div className="flex gap-12 min-h-[400px] flex-col sm:flex-row">
        {tournament.bracket.map((round, ridx) => (
          <div
            key={ridx}
            className="flex flex-col gap-5 min-w-[300px] bg-gradient-to-b from-[bg-gray-300] to-[bg-gray-300] rounded-2xl shadow-lg border-2 border-[bg-gray-300]/50 px-6 py-3"
          >
            <div className="font-extrabold text-xl text-center tracking-wider text-[bg-[#18191A]] drop-shadow pb-2">
              Round {round.round}
            </div>

            {/* Render Matches */}
            {(round.matches || []).map((match) => {
              const vidA = randomizedVideos.find(v => v.id === match.videoAId);
              const vidB = randomizedVideos.find(v => v.id === match.videoBId);
              const votesA = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoAId).length;
              const votesB = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoBId).length;
              const leader = getVoteLeader(match);

              const totalVotes = votesA + votesB;
              const progressA = totalVotes === 0 ? 0 : (votesA / totalVotes) * 100;
              const progressB = totalVotes === 0 ? 0 : (votesB / totalVotes) * 100;

              return (
                <div
                  key={match.id}
                  className="flex flex-col items-center py-6 px-3 rounded-xl shadow-xl border-2 bg-[#18191A] transition-all"
                  onClick={() => setSelectedMatch(match)}  // Click on match to see votes
                >
                  <div className="w-full flex flex-col items-center">
                    <span className={`font-bold text-lg text-center ${leader === 'A' ? 'text-blue-500' : 'text-gray-300'}`}>
                      {vidA?.title || 'A'}
                    </span>
                    <span className="text-[#E5E7EB] text-sm my-1">vs</span>
                    <span className={`font-bold text-lg text-center ${leader === 'B' ? 'text-red-500' : 'text-gray-300'}`}>
                      {vidB?.title || 'B'}
                    </span>
                  </div>

                  {/* Voting and Results */}
                  <div className="text-xs text-[#E5E7EB] mt-3 w-full flex justify-between">
                    <div className="w-full text-left">
                      <span className="font-semibold text-[#3B82F6]">A:</span> {votesA}
                    </div>
                    <div className="w-full text-right">
                      <span className="font-semibold text-[#EF4444]">B:</span> {votesB}
                    </div>
                  </div>

                  {/* Vote Progress (colored progress bar for A and B) */}
                  <div className="w-full mt-2 h-2 bg-gray-400 rounded-full">
                    {/* Blue for A */}
                    <div
                      className={`h-full ${themeColors.blue}`}
                      style={{
                        width: `${progressA}%`,
                      }}
                    />
                  </div>
                  <div className="w-full mt-2 h-2 bg-gray-400 rounded-full">
                    {/* Red for B */}
                    <div
                      className={`h-full ${themeColors.red}`}
                      style={{
                        width: `${progressB}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Display selected match's votes when clicked */}
      {selectedMatch && (
        <div className="mt-6 p-6 bg-[--main-bg] rounded-xl shadow-2xl">
          <h3 className="font-bold text-lg text-[#E5E7EB]">Votes for Match</h3>
          <div className="text-[#E5E7EB]">
            <h4 className="font-semibold text-[#3B82F6] mt-3">Votes for A:</h4>
            <ul>
              {tournament.votes.filter(vote => vote.matchId === selectedMatch.id && vote.votedFor === selectedMatch.videoAId)
                .map((vote, index) => (
                  <li key={index} className="text-[#3B82F6]">{usernames[vote.userId] || vote.userId}</li>
                ))}
            </ul>
            <h4 className="font-semibold text-[#ff6584] mt-3">Votes for B:</h4>
            <ul>
              {tournament.votes.filter(vote => vote.matchId === selectedMatch.id && vote.votedFor === selectedMatch.videoBId)
                .map((vote, index) => (
                  <li key={index} className="text-[#ff6584]">{usernames[vote.userId] || vote.userId}</li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketDisplay;
