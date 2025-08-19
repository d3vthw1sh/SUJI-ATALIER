// components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuSun, LuMoon, LuMenu, LuX, LuPlay, LuPause } from "react-icons/lu";

export function NavBar({
  dark,
  setDark,
  audioSrc = "/music/you again.mp3", // set null to hide play/pause
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

  // Detect phone/tablet: coarse pointer is a strong signal
  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;

  // rAF fade helper
  const cancelFade = () => {
    if (fadeRaf.current) {
      cancelAnimationFrame(fadeRaf.current);
      fadeRaf.current = null;
    }
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

  // Play / Pause
  const doPlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    // If already playing, bail
    if (!el.paused && !el.ended) {
      setPlaying(true);
      return;
    }
    try {
      // Start muted (autoplay policy-friendly), then unmute and fade in
      el.muted = true;
      el.volume = 0;
      await el.play();
      el.muted = false;
      setPlaying(true);
      fadeTo(targetVolume, 700);
    } catch {
      // Autoplay blocked until user gesture
    }
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
    if (!el.paused) doPause();
    else await doPlay();
  };

  // Desktop-only autoplay (+ first-gesture fallback)
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
      if (!isMobile()) doPlay(); // desktop/laptop only
    };

    // Attempt right away
    tryAuto();

    // Fallback for strict browsers: start on first gesture
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

  // Close mobile sheet on route change
  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { label: "Works", to: "/works" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Links", to: "/link" }, // label tweak only
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-black/5 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/5 dark:bg-black/40 dark:supports-[backdrop-filter]:bg-black/40">
      {/* Hidden audio element */}
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      {/* Bar */}
      <div className="flex h-full w-full items-center px-4 sm:px-5 md:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="text-[17px] font-semibold tracking-wide hover:opacity-90 transition-opacity"
        >
          SUJi °<span className="text-neutral-400">+</span>
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

          {/* Play/Pause */}
          {audioSrc && (
            <button
              onClick={togglePlay}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-2.5 py-1 text-[12px] hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
              aria-label={
                playing ? "Pause background music" : "Play background music"
              }
              title={playing ? "Pause" : "Play"}
            >
              {playing ? <LuPause size={14} /> : <LuPlay size={14} />}
              {playing ? "Pause" : "Play"}
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[12px] hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            {dark ? <LuSun size={14} /> : <LuMoon size={14} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            {dark ? <LuSun size={16} /> : <LuMoon size={16} />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:hover:bg-neutral-800"
            aria-label="Open menu"
          >
            <LuMenu size={16} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <MobileMenu open={open} onClose={() => setOpen(false)} links={links} />
    </header>
  );
}

/* ---------- subcomponents ---------- */

function NavItem({ to, children, active }) {
  return (
    <Link
      to={to}
      className="relative rounded-md px-2.5 py-1 text-neutral-700 outline-none hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-black/10 dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white/20"
    >
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-underline"
            className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-neutral-900/70 dark:bg-white/70"
          />
        )}
      </AnimatePresence>
    </Link>
  );
}

function MobileMenu({ open, onClose, links }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-2 left-2 top-2 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-900/95"
          >
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-xs font-semibold tracking-wide opacity-70">
                menu
              </span>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-800"
                aria-label="Close"
              >
                <LuX size={16} />
              </button>
            </div>

            <nav className="mt-1 divide-y divide-black/5 text-sm dark:divide-white/5">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <span>{l.label}</span>
                  <span className="text-xs opacity-60">→</span>
                </Link>
              ))}
            </nav>

            <p className="px-2 pb-1 pt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
              Press Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- helper ---------- */
function normalize(p) {
  if (!p) return "/";
  return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
}

export default NavBar;
