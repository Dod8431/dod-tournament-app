import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CrackSVG() {
  return (
    <svg className="crack-svg" viewBox="0 0 40 250" fill="none">
      <polyline
        points="20,0 22,36 14,62 23,95 13,120 27,152 18,180 21,220 20,250"
        stroke="#fff"
        strokeWidth="3.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FaceOffPanel({
  videoA, videoB,
  revealedA, revealedB,
  onRevealA, onRevealB,
  onVote,
  voteRegistered,
  votedFor,
  onNextMatch
}) {
  const [collide, setCollide] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (revealedA && revealedB && !collide) {
      setTimeout(() => setFlash(true), 240);
      setTimeout(() => setCollide(true), 440);
      setTimeout(() => setFlash(false), 650);
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

  const [blueHP, redHP] = !votedFor ? [100, 100] : votedFor === "A" ? [100, 0] : [0, 100];

  const VS = (
    <div className="fixed top-[2vw] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <motion.div
        initial={{ scale: 1.4, opacity: 0.0 }}
        animate={{ scale: [1.7, 1], opacity: [0.72, 1] }}
        transition={{ duration: 1 }}
        className="text-[5vw] font-black text-center uppercase tracking-wide"
        style={{
          color: "white",
          textShadow: "0 0 32px #fff, 0 0 64px #ef4444"
        }}
      >VS</motion.div>
    </div>
  );

  const explosion = flash ? (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0.86 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.27 }}
      style={{
        background: "radial-gradient(circle, #fff 0%, #ffd70090 40%, #be123c15 100%)",
        mixBlendMode: "screen"
      }}
    />
  ) : null;

  return (
    <div className="battle-bg relative min-h-screen flex flex-col items-center justify-center">
      <div className="faceoff-crack">
        <CrackSVG />
      </div>
      {explosion}
      {VS}

      <div className="relative z-10 flex flex-row w-full max-w-7xl items-center justify-center gap-20 pt-24 pb-16">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="healthbar-outer mb-4" style={{ width: '300px' }}>
            <div
              className="healthbar-inner healthbar-blue"
              style={{ width: blueHP + "%" }}
            />
          </div>
          {!revealedA ? (
            <motion.button
              initial={{ scale: 0.97, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevealA}
              className="bg-blue_side px-14 py-10 rounded-2xl text-3xl font-extrabold shadow-2xl border-4 border-blue-500 text-white focus:ring-2 ring-blue-400 transition-all"
            >Reveal</motion.button>
          ) : (
            <motion.div
              initial={{ x: -120, scale: 0.94, opacity: 0 }}
              animate={{
                x: collide ? 0 : -60,
                scale: votedFor === "A" ? 1.08 : votedFor === "B" ? 1 : 1,
                opacity: 1,
                filter: votedFor === "B" ? "grayscale(100%)" : "none"
              }}
              transition={{ type: "spring", stiffness: 250, damping: 16 }}
              className={`w-[460px] h-[260px] bg-black rounded-2xl shadow-2xl border-4 border-blue-500 relative overflow-hidden flex items-center ${collide && "battle-border-blue"}`}
            >
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${videoA.ytId}`}
                title={videoA.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-2xl"
              ></iframe>
              <div className="absolute left-0 bottom-0 w-full px-4 py-2 bg-gradient-to-t from-blue_side/90 to-transparent text-lg font-bold text-white text-center z-10">
                {videoA.title}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="healthbar-outer mb-4" style={{ width: '300px' }}>
            <div
              className="healthbar-inner healthbar-red"
              style={{ width: redHP + "%" }}
            />
          </div>
          {!revealedB ? (
            <motion.button
              initial={{ scale: 0.97, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06, backgroundColor: "#be123c" }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevealB}
              className="bg-red_side px-14 py-10 rounded-2xl text-3xl font-extrabold shadow-2xl border-4 border-red-500 text-white focus:ring-2 ring-red-400 transition-all"
            >Reveal</motion.button>
          ) : (
            <motion.div
              initial={{ x: 120, scale: 0.94, opacity: 0 }}
              animate={{
                x: collide ? 0 : 60,
                scale: votedFor === "B" ? 1.08 : votedFor === "A" ? 1 : 1,
                opacity: 1,
                filter: votedFor === "A" ? "grayscale(100%)" : "none"
              }}
              transition={{ type: "spring", stiffness: 250, damping: 16 }}
              className={`w-[460px] h-[260px] bg-black rounded-2xl shadow-2xl border-4 border-red-500 relative overflow-hidden flex items-center ${collide && "battle-border-red"}`}
            >
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${videoB.ytId}`}
                title={videoB.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-2xl"
              ></iframe>
              <div className="absolute left-0 bottom-0 w-full px-4 py-2 bg-gradient-to-t from-red_side/90 to-transparent text-lg font-bold text-white text-center z-10">
                {videoB.title}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {collide && !voteRegistered && (
          <motion.div
            key="votes"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.34, delay: 0.2 }}
            className="flex gap-16 z-20 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onVote("A")}
              className="text-2xl px-12 py-5 font-black rounded-2xl bg-blue_side hover:bg-blue-400 text-white shadow-xl border-2 border-blue-500 uppercase tracking-wider"
            >Vote Blue Side</motion.button>
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onVote("B")}
              className="text-2xl px-12 py-5 font-black rounded-2xl bg-red_side hover:bg-red-400 text-white shadow-xl border-2 border-red-500 uppercase tracking-wider"
            >Vote Red Side</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="text-xl px-8 py-4 font-extrabold rounded-xl bg-winner_gold text-blue-900 shadow-lg border-2 border-blue-500 mx-auto uppercase"
            >Next Match</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
