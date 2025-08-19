import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParallaxHero from "../sections/ParallaxHero";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  // ⌘K / Ctrl+K → open link (still works, just not displayed)
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
      <ParallaxHero forceMotion>
        <motion.div initial="hidden" animate="show" className="max-w-2xl">
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-6xl font-semibold text-white drop-shadow-md tracking-tight"
          >
            SUJi °
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-3 text-base md:text-lg text-white/90 drop-shadow"
          >
            Music artist blending orchestral, fantasy, and electronic elements —
            minimal &amp; cinematic.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="mt-6 flex justify-center gap-3"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium
                         bg-black text-white hover:bg-black/90
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-black/60 dark:focus-visible:ring-black/60 transition-colors"
            >
              See all works →
            </Link>

            <a
              href="https://soundcloud.com/suji_lament/popular-tracks" // swap to your link
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium
                         bg-black/70 text-white hover:bg-black/80 transition-colors"
            >
              Listen
            </a>
          </motion.div>
        </motion.div>
      </ParallaxHero>
    </main>
  );
}
