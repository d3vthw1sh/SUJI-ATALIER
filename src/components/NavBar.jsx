// components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuSun, LuMoon, LuPlay, LuPause } from "react-icons/lu";

export function NavBar({
  dark,
  setDark,
  audioSrc = "/music/you again.mp3", // set null to hide play/pause
  targetVolume = 0.12,
}) {
  const [open, setOpen] = useState(false); // <-- mobile full-screen state
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);
  const fadeRaf = useRef(null);
  const triedAutoplay = useRef(false);
  const location = useLocation();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    if (open) root.style.overflow = "hidden";
    else root.style.overflow = prev || "";
    return () => {
      root.style.overflow = prev || "";
    };
  }, [open]);

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;

  // fade helper
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
      if (!isMobile()) doPlay(); // desktop only
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        "fixed inset-x-0 top-0 z-40 border-b transition-[height,background-color,border-color] duration-200",
        // default (desktop look)
        "bg-white dark:bg-black transition-colors",
        // full screen (mobile)
        open
          ? "h-[100dvh] md:h-14 border-transparent bg-white dark:bg-black !bg-opacity-100"
          : "h-14 border-black/5",
      ].join(" ")}
    >
      {/* Hidden audio element */}
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      {/* Top bar */}
      <div className="flex h-14 w-full items-center px-4 sm:px-5 md:px-6">
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
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobile-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden absolute inset-x-0 top-14 bottom-0 flex items-center justify-center"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <ul className="flex flex-col items-center gap-7 text-lg font-medium">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="hover:opacity-80 active:scale-[0.99] transition"
                  >
                    {l.label}
                  </Link>
                </li>
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

/* ---------- helper ---------- */
function normalize(p) {
  if (!p) return "/";
  return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
}

export default NavBar;
