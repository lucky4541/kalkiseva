import { useEffect, useState } from "react";

interface Blessing {
  id: number;
  left: number;
  delay: number;
  type: "flower" | "om";
}

export const FloatingBlessings = () => {
  const [blessings, setBlessings] = useState<Blessing[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomType = Math.random() > 0.5 ? "flower" : "om";
      setBlessings((prev) => [
        ...prev,
        { id: Date.now(), left: Math.random() * 100, delay: Math.random() * 5, type: randomType },
      ]);
    }, 1200); // New blessing every 1.2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blessings.map((blessing) => (
        <div
          key={blessing.id}
          className={`absolute text-3xl animate-blessingFall ${
            blessing.type === "flower" ? "text-pink-400" : "text-yellow-400"
          }`}
          style={{
            left: `${blessing.left}%`,
            animationDelay: `${blessing.delay}s`,
          }}
        >
          {blessing.type === "flower" ? "🌸" : "🕉️"}
        </div>
      ))}
    </div>
  );
};
