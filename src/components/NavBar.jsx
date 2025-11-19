// components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuSun, LuMoon, LuPlay, LuPause } from "react-icons/lu";

export function NavBar({
  dark,
  setDark,
  audioSrc = "/music/you again.mp3",
  targetVolume = 0.12,
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);
  const fadeRaf = useRef(null);
  const triedAutoplay = useRef(false);
  const location = useLocation();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = open ? "hidden" : prev || "";
    return () => {
      root.style.overflow = prev || "";
    };
  }, [open]);

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;

  const cancelFade = () => {
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    fadeRaf.current = null;
  };

  const fadeTo = (to, ms = 700) => {
    const el = audioRef.current;
    if (!el) return;
    cancelFade();
    const from = el.volume;
    const start = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - start) / ms);
      el.volume = from + (to - from) * k;
      if (k < 1) fadeRaf.current = requestAnimationFrame(tick);
    };
    fadeRaf.current = requestAnimationFrame(tick);
  };

  const doPlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (!el.paused && !el.ended) {
      setPlaying(true);
      return;
    }
    try {
      el.muted = true;
      el.volume = 0;
      await el.play();
      el.muted = false;
      setPlaying(true);
      fadeTo(targetVolume, 700);
    } catch {}
  };

  const doPause = () => {
    const el = audioRef.current;
    if (!el) return;
    fadeTo(0, 220);
    setTimeout(() => {
      el.pause();
      setPlaying(false);
    }, 230);
  };

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    !el.paused ? doPause() : await doPlay();
  };

  // autoplay logic
  useEffect(() => {
    if (!audioSrc) return;
    const el = audioRef.current;
    if (el) {
      el.loop = true;
      el.preload = "auto";
      el.volume = 0;
      el.playsInline = true;
    }

    const tryAuto = () => {
      if (triedAutoplay.current) return;
      triedAutoplay.current = true;
      if (!isMobile()) doPlay();
    };

    tryAuto();

    const wake = () => {
      tryAuto();
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
    window.addEventListener("pointerdown", wake, { once: true });
    window.addEventListener("keydown", wake, { once: true });

    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      cancelFade();
    };
  }, [audioSrc]);

  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { label: "Works", to: "/works" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Links", to: "/link" },
  ];

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-[9999] border-b transition-all duration-300",
        "bg-white/80 dark:bg-black/80 backdrop-blur-md h-14 supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/60",
        open ? "border-transparent" : "border-black/5 dark:border-white/5",
      ].join(" ")}
    >
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      {/* Top bar */}
      <div className="relative z-[10000] flex h-14 w-full items-center px-4 sm:px-5 md:px-6">
        <Link
          to="/"
          className="group flex items-center gap-0.5 text-[17px] font-semibold tracking-wide outline-none"
        >
          <div className="flex overflow-hidden">
            {["S", "U", "J", "i"].map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  initial: { y: 0 },
                  hover: { y: -3 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: i * 0.05,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.span
            className="inline-block text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            °+
          </motion.span>
        </Link>

        {/* Desktop controls */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-3 text-[13px]">
            {links.map((l) => (
              <NavItem
                key={l.to}
                to={l.to}
                active={normalize(location.pathname) === normalize(l.to)}
              >
                {l.label}
              </NavItem>
            ))}
          </nav>

          <div className="h-5 w-px bg-black/10 dark:bg-white/10" />

          {audioSrc && (
            <button
              onClick={togglePlay}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-2.5 py-1 text-[12px] hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800 transition-all hover:border-black/20 dark:hover:border-white/20"
            >
              {playing ? <LuPause size={14} /> : <LuPlay size={14} />}
              {playing ? "Pause" : "Play"}
            </button>
          )}

          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[12px] hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800 transition-all hover:border-black/20 dark:hover:border-white/20"
          >
            {dark ? <LuSun size={14} /> : <LuMoon size={14} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            {dark ? <LuSun size={16} /> : <LuMoon size={16} />}
          </button>

          {/* bars → X */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
          >
            <span
              className="absolute block h-[2px] w-4 rounded-full bg-current transition-transform duration-200 will-change-transform"
              style={{
                transform: open
                  ? "translateY(0) rotate(45deg)"
                  : "translateY(-3px) rotate(0deg)",
              }}
            />
            <span
              className="absolute block h-[2px] w-4 rounded-full bg-current transition-transform duration-200 will-change-transform"
              style={{
                transform: open
                  ? "translateY(0) rotate(-45deg)"
                  : "translateY(3px) rotate(0deg)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile full-screen content */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9998] h-[100dvh] w-screen bg-white dark:bg-black md:hidden flex flex-col items-center justify-center"
            style={{
              paddingTop: "3.5rem", // match header height (h-14)
            }}
          >
            <ul className="flex flex-col items-center gap-8 text-2xl font-medium tracking-tight">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="relative block p-2 hover:text-neutral-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- subcomponents ---------- */

function NavItem({ to, children, active }) {
  return (
    <Link
      to={to}
      className="relative rounded-full px-3 py-1 text-neutral-600 outline-none transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
    >
      <motion.span
        className="relative z-10"
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>

      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10 -z-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </Link>
  );
}

function normalize(p) {
  if (!p) return "/";
  return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
}

export default NavBar;
