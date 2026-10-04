// src/pages/SessionExpiredPremium.tsx
import React from "react";
import { motion, Variants } from "framer-motion";

/**
 * SessionExpiredPremium
 * - TailwindCSS + Framer Motion (v10) friendly
 * - TypeScript-safe: no transition inside variant objects
 * - Uses the uploaded local background image path:
 *   /mnt/data/eef3bd96-4d7c-4385-9aed-ea0653c2435b.png
 *
 * If you deploy to production and put the image in /public/assets,
 * update the bgImage path accordingly (e.g. "/assets/temple_bg.jpg").
 */

// Use the exact uploaded path (will be mapped to URL by your environment)
const bgImage = "/mnt/data/eef3bd96-4d7c-4385-9aed-ea0653c2435b.png";

/* ---------- Variants (no transition inside variants) ---------- */

const petalVariants: Variants = {
  initial: { y: -40, opacity: 0 },
  animate: (i: number) => ({
    y: "110vh",
    x: (i % 2 === 0 ? -1 : 1) * (15 + (i % 5) * 10),
    rotate: i % 2 === 0 ? 160 : -160,
    opacity: [1, 0.8, 0.5, 0.2],
  }),
};

const sparkleVariants: Variants = {
  animate: {
    opacity: [0.2, 1, 0.2],
    scale: [0.6, 1.2, 0.6],
  },
};

const mantraVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: [1, 1.02, 1] },
};

/* ---------- Component ---------- */

const SessionExpiredPremium: React.FC = () => {
  const petals = Array.from({ length: 12 }); // falling petals
  const sparkles = Array.from({ length: 20 }); // golden sparkles

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-purple-100">
      {/* BACKGROUND IMAGE (blur + darken) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('${bgImage}')`,
          filter: "brightness(0.65) saturate(1.05) blur(6px)",
        }}
      />

      {/* SACRED AURA */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="aura" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.18" />
              <stop offset="30%" stopColor="#ffefcf" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#aura)" />
        </svg>
      </div>

      {/* PETALS (animated) */}
      <div className="pointer-events-none absolute inset-0">
        {petals.map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={petalVariants}
            initial="initial"
            animate="animate"
            transition={{
              delay: i * 0.28,
              duration: 10 + (i % 3),
              repeat: Infinity,
              // repeatType must be one of the allowed literals
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute text-3xl md:text-4xl"
            style={{
              left: `${(i * 8) % 100}%`,
              top: `${-8 - (i % 4) * 5}%`,
            }}
          >
            {i % 3 === 0 ? "🌺" : i % 2 === 0 ? "🌸" : "🌼"}
          </motion.div>
        ))}
      </div>

      {/* SPARKLES (golden) */}
      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-yellow-300/80"
            style={{
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              left: `${(i * 13) % 100}%`,
              top: `${(i * 9) % 100}%`,
              boxShadow: "0 0 14px rgba(250,204,21,0.7)",
              filter: "blur(6px)",
            }}
            variants={sparkleVariants}
            animate="animate"
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* INCENSE SMOKE (subtle SVG animation) */}
      <motion.svg
        className="pointer-events-none absolute left-6 top-8 opacity-70"
        width="80"
        height="160"
        viewBox="0 0 80 160"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M40 140 C 35 120, 30 100, 40 80 C 50 60, 45 40, 40 20"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(6px)" }}
        />
        <path
          d="M30 140 C 25 120, 20 100, 30 80 C 40 60, 35 40, 30 20"
          stroke="rgba(255,244,230,0.25)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(8px)" }}
        />
      </motion.svg>

      {/* CENTER CONTENT (card) */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-6 px-6 md:px-12"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.95, ease: "easeOut" }}
      >
        {/* OM ICON + RING */}
        <div className="relative flex flex-col items-center">
          <motion.div
            className="text-8xl md:text-9xl text-amber-300 drop-shadow-[0_12px_30px_rgba(255,165,0,0.16)]"
            animate={{
              scale: [1, 1.06, 1],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🕉️
          </motion.div>

          <motion.div
            className="absolute -bottom-6 w-52 h-52 md:w-64 md:h-64 rounded-full border border-amber-200/40"
            animate={{ opacity: [0.15, 0.32, 0.15], scale: [0.96, 1.03, 0.98] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </div>

        {/* Card */}
        <div className="w-full max-w-lg bg-white/85 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-amber-200 shadow-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-orange-700 tracking-tight">
            Session Expired
          </h2>

          <motion.p
            className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed"
            variants={mantraVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            aria-live="polite"
          >
            Your session ended automatically due to inactivity.
            <br />
            Please log in again to continue your spiritual journey.
          </motion.p>

          <motion.div
            className="mt-6 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-xl transform-gpu hover:scale-[1.03] transition"
            >
              Login Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2 rounded-full border border-amber-300 bg-white/80 text-amber-900 font-medium hover:bg-white transition"
            >
              Continue as Guest
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* DIYA CLUSTER (bottom) */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl"
            >
              🪔
            </motion.div>
          ))}
        </div>
      </div>

      {/* FOOTER MANTRA */}
      <motion.div
        className="pointer-events-none absolute bottom-4 right-6 text-amber-700 text-xs"
        animate={{ opacity: [0.2, 0.9, 0.2] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        ॐ नमः शिवाय — Blessings on your journey
      </motion.div>
    </div>
  );
};

export default SessionExpiredPremium;
