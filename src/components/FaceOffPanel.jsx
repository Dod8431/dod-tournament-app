import React from "react";

export default function FaceOffPanel({
  videoA, videoB,
  revealedA, revealedB,
  onRevealA, onRevealB,
  onVote
}) {
  // Defensive: guard against missing data
  if (!videoA || !videoB) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl font-bold">
        <div>
          <div>❌ Cannot load face-off match.</div>
          <div className="text-base font-mono mt-2">
            {!videoA && "Left video missing. "}
            {!videoB && "Right video missing."}
          </div>
        </div>
      </div>
    );
  }

  function isValidId(id) {
    return typeof id === "string" && /^[\w-]{11,}$/.test(id);
  }

  // Both videos must have a valid YouTube id
  if (!isValidId(videoA.ytId) || !isValidId(videoB.ytId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-2xl font-bold">
        <div>
          <div>⚠️ Invalid YouTube video ID</div>
          <div className="text-base mt-2">A: {videoA?.ytId || "N/A"}, B: {videoB?.ytId || "N/A"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Blue/Red background split */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-gradient-to-br from-blue-900 to-blue-700" />
        <div className="w-32 flex items-center justify-center">
          <span className="text-6xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] select-none pointer-events-none">VS</span>
        </div>
        <div className="flex-1 bg-gradient-to-bl from-red-900 to-red-700" />
      </div>
      {/* Face-off content */}
      <div className="relative z-10 flex flex-row w-full max-w-6xl items-center justify-center gap-12 py-20">
        {/* LEFT */}
        <div className="flex-1 flex flex-col items-center">
          {!revealedA ? (
            <button
              onClick={onRevealA}
              className="bg-black/60 text-white px-12 py-8 rounded-xl text-2xl font-bold border-4 border-blue-700 shadow-xl hover:bg-blue-900 transition"
            >Reveal</button>
          ) : (
            <>
              <iframe
                width="440"
                height="248"
                src={`https://www.youtube.com/embed/${videoA.ytId}`}
                title={videoA.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl shadow-lg border-4 border-blue-600"
              ></iframe>
              <div className="text-blue-200 font-semibold mt-5 text-xl text-center px-2 max-w-xs line-clamp-2">{videoA.title}</div>
            </>
          )}
        </div>
        {/* RIGHT */}
        <div className="flex-1 flex flex-col items-center">
          {!revealedB ? (
            <button
              onClick={onRevealB}
              className="bg-black/60 text-white px-12 py-8 rounded-xl text-2xl font-bold border-4 border-red-700 shadow-xl hover:bg-red-900 transition"
            >Reveal</button>
          ) : (
            <>
              <iframe
                width="440"
                height="248"
                src={`https://www.youtube.com/embed/${videoB.ytId}`}
                title={videoB.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl shadow-lg border-4 border-red-600"
              ></iframe>
              <div className="text-red-200 font-semibold mt-5 text-xl text-center px-2 max-w-xs line-clamp-2">{videoB.title}</div>
            </>
          )}
        </div>
      </div>
      {/* Vote buttons appear only if both revealed */}
      {revealedA && revealedB && (
        <div className="flex gap-16 z-20 mt-4">
          <button onClick={() => onVote(videoA.id)}
                  className="btn text-xl px-10 py-5 bg-blue-700 hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-lg border-2 border-blue-300">
            Vote Left
          </button>
          <button onClick={() => onVote(videoB.id)}
                  className="btn text-xl px-10 py-5 bg-red-700 hover:bg-red-600 text-white font-extrabold rounded-xl shadow-lg border-2 border-red-300">
            Vote Right
          </button>
        </div>
      )}
    </div>
  );
}
