import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const OmMusic = () => {
  const omRef = useRef<HTMLAudioElement | null>(null);
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showSlider, setShowSlider] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isCheckout = location.pathname.includes("checkout");

  // Smooth Fade-in
  const fadeIn = (audio: HTMLAudioElement, target: number) => {
    let vol = 0;
    audio.volume = 0;

    const interval = setInterval(() => {
      if (vol < target) {
        vol += 0.02;
        audio.volume = vol;
      } else {
        clearInterval(interval);
      }
    }, 150);
  };

  // Start music on first interaction (Mobile + Desktop Safe)
  useEffect(() => {
    const startMusic = () => {
      if (hasStarted) return;
      if (!omRef.current || !bellRef.current) return;

      omRef.current.loop = true;
      bellRef.current.loop = true;

      omRef.current.muted = false;
      bellRef.current.muted = false;

      // MUST call play directly inside interaction
      omRef.current.play().then(() => {
        fadeIn(omRef.current!, volume);
      }).catch(() => {});

      bellRef.current.play().then(() => {
        fadeIn(bellRef.current!, volume * 0.4);
      }).catch(() => {});

      setHasStarted(true);

      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("scroll", startMusic);
    };

    window.addEventListener("click", startMusic);
    window.addEventListener("touchstart", startMusic);
    window.addEventListener("scroll", startMusic);

    return () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("scroll", startMusic);
    };
  }, [hasStarted, volume]);

  // Stop music on checkout page
  useEffect(() => {
    if (isCheckout && omRef.current && bellRef.current) {
      omRef.current.pause();
      bellRef.current.pause();
    }
  }, [isCheckout]);

  const toggleMute = () => {
    if (!omRef.current || !bellRef.current) return;

    const newMute = !isMuted;
    setIsMuted(newMute);

    omRef.current.muted = newMute;
    bellRef.current.muted = newMute;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);

    if (omRef.current && bellRef.current) {
      omRef.current.volume = newVol;
      bellRef.current.volume = newVol * 0.4;
    }
  };

  return (
    <>
      <audio ref={omRef} src="/audio/ommantra.mp3" />
      <audio ref={bellRef} src="/audio/temple-bell.mp3" />

      {/* 🛕 Floating Om Chakra Button */}
      <div className="fixed bottom-28 left-6 z-[10000] flex flex-col items-center">
        <button
          onClick={() => {
            toggleMute();
            setShowSlider(!showSlider);
          }}
          className="relative w-14 h-14 rounded-full
                     bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600
                     shadow-2xl flex items-center justify-center
                     transition-transform duration-300 hover:scale-110"
        >
          <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></span>

          <span
            className={`relative text-white text-2xl ${
              !isMuted && hasStarted ? "animate-spin-slow" : ""
            }`}
          >
            🕉
          </span>
        </button>

        {showSlider && !isMuted && (
          <div className="mt-3 bg-white p-3 rounded-xl shadow-xl">
            <input
              type="range"
              min="0"
              max="0.6"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-32"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default OmMusic;
