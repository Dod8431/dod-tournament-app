
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const themeColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  neutral: 'bg-gray-300',
  background: 'bg-[#18191A]',
};

const BracketDisplay = ({ tournament }) => {
  const [usernames, setUsernames] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Randomize the tournament videos for matchups
  const randomizeMatchups = (videos) => {
    const randomizedVideos = [...videos];
    for (let i = randomizedVideos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedVideos[i], randomizedVideos[j]] = [randomizedVideos[j], randomizedVideos[i]];
    }
    return randomizedVideos;
  };

  // Assuming the tournament object has the videos array
  const randomizedVideos = randomizeMatchups(tournament.videos);

  // Helper function to get the winning side
  const getVoteLeader = (match) => {
    const votesA = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoAId).length;
    const votesB = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoBId).length;
    return votesA > votesB ? match.videoAId : match.videoBId;
  };

  return (
    <div>
      {/* Display randomized matchups here */}
    </div>
  );
};

export default BracketDisplay;
