import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaceOffPanel({
  videoA,
  videoB,
  revealedA,
  revealedB,
  onRevealA,
  onRevealB,
  onVote,
  voteRegistered,
  votedFor,
  onNextMatch,
  progressIndicator,
}) {
  const [collide, setCollide] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (revealedA && revealedB && !collide) {
      setTimeout(() => setCollide(true), 440);
    }
    if (!(revealedA && revealedB)) setCollide(false);
  }, [revealedA, revealedB]);

  useEffect(() => {
    setShowWinner(false);
  }, [videoA?.ytId, videoB?.ytId]);

  useEffect(() => {
    if (votedFor) {
      setTimeout(() => setShowWinner(true), 700);
    } else {
      setShowWinner(false);
    }
  }, [votedFor]);

  // HP bars en fonction du vote
  const [blueHP, redHP] =
    !votedFor ? [100, 100] : votedFor === "A" ? [100, 0] : [0, 100];

  const VS = (
    <div className="fixed top-[2vw] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <motion.div
        initial={{ scale: 1.4, opacity: 0.0 }}
        animate={{ scale: [1.7, 1], opacity: [0.72, 1] }}
        transition={{ duration: 1 }}
        className="text-[5vw] font-black text-center uppercase tracking-wide"
        style={{
          color: "var(--main-gold)",
          textShadow: "0 0 32px var(--main-gold), 0 0 64px #ef4444",
        }}
      >
        VS
      </motion.div>
    </div>
  );

  // --- SHARED styles ---
  const videoBlockStyle =
    "w-[460px] max-w-[95vw] flex flex-col items-center";
  const videoFrameBox =
    "w-[460px] h-[260px] max-w-full bg-black rounded-2xl shadow-2xl border-4 relative overflow-hidden flex items-center";
  const titleBox =
    "mt-4 w-full px-2 h-[2.7em] flex items-center justify-center text-lg font-bold text-center text-white truncate overflow-hidden whitespace-nowrap";

  return (
    <div className="battle-bg relative min-h-screen flex flex-col items-center justify-center">
      {VS}

      <div className="relative z-10 flex flex-row w-full max-w-7xl items-center justify-center gap-20 pt-24 pb-16 flex-wrap">
        {/* Blue Side */}
        <div
          className={`flex-1 flex flex-col items-center justify-center ${videoBlockStyle}`}
        >
          <div className="healthbar-outer mb-4" style={{ width: "300px" }}>
            <div
              className="healthbar-inner healthbar-blue transition-all duration-700 ease-out"
              style={{ width: `${blueHP}%` }}
            ></div>
          </div>

          {!revealedA ? (
            <motion.button
              initial={{ scale: 0.97, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevealA}
              className="bg-blue_side px-14 py-10 rounded-2xl text-3xl font-extrabold shadow-2xl border-4 border-blue-500 text-white focus:ring-2 ring-blue-400 transition-all"
            >
              Reveal
            </motion.button>
          ) : (
            <>
              <motion.div
                initial={{ x: -120, scale: 0.94, opacity: 0 }}
                animate={{
                  x: collide ? 0 : -60,
                  scale:
                    votedFor === "A" ? 1.08 : votedFor === "B" ? 0.95 : 1,
                  opacity: 1,
                  filter: votedFor === "B" ? "grayscale(100%)" : "none",
                  y: votedFor === "B" ? 40 : 0,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 16 }}
                className={`${videoFrameBox} border-blue-500 ${
                  collide && "battle-border-blue"
                }`}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={
                    videoA?.ytId
                      ? `https://www.youtube.com/embed/${videoA.ytId}`
                      : undefined
                  }
                  title={videoA?.title || "Video A"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-2xl"
                />
              </motion.div>

              {/* Title */}
              <div className={titleBox} title={videoA?.title || ""}>
                {videoA?.title || "—"}
              </div>

              {/* Vote button */}
              {collide && !voteRegistered && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVote("A")}
                  className="u-btn bg-blue-600 hover:bg-blue-500 text-white text-2xl px-14 py-6 border-2 border-blue-400 uppercase font-extrabold rounded-2xl shadow-xl mt-3"
                >
                  Vote Blue Side
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Red Side */}
        <div
          className={`flex-1 flex flex-col items-center justify-center ${videoBlockStyle}`}
        >
          <div className="healthbar-outer mb-4" style={{ width: "300px" }}>
            <div
              className="healthbar-inner healthbar-red transition-all duration-700 ease-out"
              style={{ width: `${redHP}%` }}
            ></div>
          </div>

          {!revealedB ? (
            <motion.button
              initial={{ scale: 0.97, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevealB}
              className="bg-red_side px-14 py-10 rounded-2xl text-3xl font-extrabold shadow-2xl border-4 border-red-500 text-white focus:ring-2 ring-red-400 transition-all"
            >
              Reveal
            </motion.button>
          ) : (
            <>
              <motion.div
                initial={{ x: 120, scale: 0.94, opacity: 0 }}
                animate={{
                  x: collide ? 0 : 60,
                  scale:
                    votedFor === "B" ? 1.08 : votedFor === "A" ? 0.95 : 1,
                  opacity: 1,
                  filter: votedFor === "A" ? "grayscale(100%)" : "none",
                  y: votedFor === "A" ? 40 : 0,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 16 }}
                className={`${videoFrameBox} border-red-500 ${
                  collide && "battle-border-red"
                }`}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={
                    videoB?.ytId
                      ? `https://www.youtube.com/embed/${videoB.ytId}`
                      : undefined
                  }
                  title={videoB?.title || "Video B"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-2xl"
                />
              </motion.div>

              {/* Title */}
              <div className={titleBox} title={videoB?.title || ""}>
                {videoB?.title || "—"}
              </div>

              {/* Vote button */}
              {collide && !voteRegistered && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVote("B")}
                  className="u-btn bg-red-600 hover:bg-red-500 text-white text-2xl px-14 py-6 border-2 border-red-400 uppercase font-extrabold rounded-2xl shadow-xl mt-3"
                >
                  Vote Red Side
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Next Match */}
      <AnimatePresence>
        {showWinner && voteRegistered && (
          <motion.div
            key="next"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, delay: 0.27 }}
            className="flex z-30 mt-12"
          >
            <button
              onClick={onNextMatch}
              className="text-xl px-8 py-4 font-extrabold rounded-xl bg-[var(--main-gold)] text-[var(--main-dark)] shadow-lg border-2 border-[var(--main-gold-dark)] mx-auto uppercase"
            >
              Next Match
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {progressIndicator && progressIndicator}
    </div>
  );
}
