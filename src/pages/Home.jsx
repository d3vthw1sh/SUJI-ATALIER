import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import ParallaxHero from "../sections/ParallaxHero";

/**
 * MouseTrail Component
 * Creates a glowing trail following the cursor
 */
/**
 * MouseTrail Component
 * Creates a glowing trail following the cursor
 */
function MouseTrail() {
  const [trail, setTrail] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e) => {
      // Only visible if inside .parallax-hero
      const isInsideHero = e.target.closest('.parallax-hero');
      setIsVisible(!!isInsideHero);

      if (!isInsideHero) return;

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Add particle
      const id = Date.now();
      setTrail((prev) => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
      
      // Cleanup
      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== id));
      }, 500);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {trail.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-4 h-4 rounded-full bg-white/30 blur-md"
          style={{ left: p.x - 8, top: p.y - 8 }}
        />
      ))}
      <motion.div 
        className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ left: mouseX, top: mouseY }}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.2 + (0.1 * i), ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  // ⌘K / Ctrl+K → open link
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-link"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="pt-14 min-h-[calc(100dvh-56px)]">
      <MouseTrail />
      
      <ParallaxHero forceMotion>
        <motion.div initial="hidden" animate="show" className="max-w-3xl px-4">
          <motion.div variants={fadeUp} custom={0} className="mb-6">
            <span className="inline-block px-3 py-1 text-[10px] tracking-[0.3em] uppercase border border-white/30 rounded-full text-white/70 backdrop-blur-sm">
              Audio / Visual / Experience
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-6xl md:text-8xl font-light text-white tracking-tight mb-6"
          >
            <span className="font-serif italic">SUJi</span>
            <span className="text-white/50 text-4xl md:text-6xl align-top ml-2">°</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-white/80 font-light max-w-xl mx-auto leading-relaxed mb-10"
          >
            Weaving orchestral textures with electronic pulse. 
            A high-fidelity soundscape for the dreaming mind.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/works"
              className="group relative px-8 py-3 rounded-full bg-white text-black font-medium overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Works <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <a
              href="https://soundcloud.com/suji_lament/popular-tracks"
              target="_blank"
              rel="noreferrer"
              className="group px-8 py-3 rounded-full border border-white/30 text-white backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Listen on Cloud
            </a>
          </motion.div>
        </motion.div>
      </ParallaxHero>
    </main>
  );
}
