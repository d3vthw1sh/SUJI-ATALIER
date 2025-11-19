import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Floating Particles Component
 * Renders drifting "dust motes" for atmosphere
 * @param {number} count - Number of particles
 * @param {string} color - Tailwind color class or hex (default: bg-white/40)
 */
export default function FloatingParticles({ count = 20, className = "bg-white/40" }) {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${className}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
