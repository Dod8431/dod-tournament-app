// src/components/BracketDisplay.jsx
import React from "react";
import { SingleEliminationBracket, Match, SVGViewer } from "@g-loot/react-tournament-brackets";

// Helper to transform app data to library format
function convertToBracketMatches(tournament) {
  let roundOffset = Math.min(...tournament.bracket.map(r => r.round)) - 1;
  const matches = [];
  tournament.bracket.forEach((round, rIdx) => {
    round.matches.forEach((match, mIdx) => {
      const videoA = tournament.videos.find(v => v.id === match.videoAId) || {};
      const videoB = tournament.videos.find(v => v.id === match.videoBId) || {};
      const votesA = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoAId).length;
      const votesB = (tournament.votes || []).filter(v => v.matchId === match.id && v.votedFor === match.videoBId).length;
      // Compute winner if possible
      let winnerId = null;
      if (votesA > 0 || votesB > 0) winnerId = votesA >= votesB ? videoA.id : videoB.id;
      matches.push({
        id: match.id,
        name: `Match ${mIdx + 1}`,
        nextMatchId: null, // Not needed for simple tree
        tournamentRoundText: `Round ${round.round}`,
        startTime: "",
        state: (votesA > 0 || votesB > 0) ? 'DONE' : 'PENDING',
        participants: [
          videoA.ytId ? {
            id: videoA.id,
            name: videoA.title,
            imgUrl: `https://img.youtube.com/vi/${videoA.ytId}/mqdefault.jpg`
          } : null,
          videoB.ytId ? {
            id: videoB.id,
            name: videoB.title,
            imgUrl: `https://img.youtube.com/vi/${videoB.ytId}/mqdefault.jpg`
          } : null
        ].filter(Boolean),
        winnerId
      });
    });
  });
  return matches;
}

export default function BracketDisplay({ tournament }) {
  const matches = convertToBracketMatches(tournament);

  return (
    <div className="w-full flex justify-center">
      <SingleEliminationBracket
        matches={matches}
        matchComponent={CustomMatch}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer width={1100} height={matches.length * 80 + 80} {...props}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
}

// Custom rendering for each match—big thumbnails, winner highlight
function CustomMatch({ match, ...props }) {
  return (
    <Match
      {...props}
      match={match}
      style={{
        background: "#181818",
        borderRadius: 16,
        boxShadow: "0 2px 14px #0005",
        margin: 8,
        padding: 12
      }}
      participantRenderer={({ participant }) => participant ? (
        <div style={{
          display: "flex", alignItems: "center",
          background: participant.id === match.winnerId ? "#1f8c36" : "transparent",
          borderRadius: 8,
          padding: 6,
          gap: 8,
          color: participant.id === match.winnerId ? "#fff" : "#dde"
        }}>
          <img src={participant.imgUrl} alt="" style={{ width: 54, height: 36, borderRadius: 6 }} />
          <span className="font-bold text-xs md:text-sm" style={{
            maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
          }}>{participant.name}</span>
        </div>
      ) : (
        <span className="italic text-gray-500">TBD</span>
      )}
    />
  );
}
