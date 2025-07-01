import React from 'react';

const themeCardBorder = {
  classic: "border-blue-400",
  retro: "border-yellow-400",
  meme: "border-green-400",
  dark: "border-gray-700",
  light: "border-gray-300"
};

function VideoCard({ video, revealed, onReveal, theme = 'classic' }) {
  // Border color by theme, with smooth transition on reveal
  const borderClass = `border-4 ${themeCardBorder[theme] || themeCardBorder.classic}`;

  return (
    <div className={`w-60 h-72 bg-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-md relative overflow-hidden ${borderClass} transition-all duration-300`}>
      {!revealed ? (
        <button
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 flex flex-col items-center justify-center cursor-pointer text-xl font-bold z-10 hover:bg-opacity-90 active:scale-95 transition"
          onClick={onReveal}
          tabIndex={0}
        >
          <span className="opacity-80">Reveal Video</span>
        </button>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
          <iframe
            width="100%"
            height="180"
            src={`https://www.youtube.com/embed/${video.ytId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl mt-2 mb-2"
          ></iframe>
          {/* Title is intentionally hidden during voting */}
        </div>
      )}
    </div>
  );
}

export default VideoCard;
