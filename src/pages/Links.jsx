// src/pages/Links.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaTwitter,
  FaPatreon,
  FaDiscord,
} from "react-icons/fa";

/** ====== CONFIG ====== **/
const ACCENT = "#6C7AA8"; // match About/Contact/Works

const LINKS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/4Vsj7kMT96ERwjEwonlGAn",
    Icon: FaSpotify,
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/suji_lament",
    Icon: FaSoundcloud,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@suji_lament",
    Icon: FaYoutube,
  },
  { label: "X / Twitter", href: "https://x.com/suji_lament", Icon: FaTwitter },
  {
    label: "Patreon",
    href: "https://www.patreon.com/c/suji_lament",
    Icon: FaPatreon,
  },
  { label: "Discord", href: "https://discord.gg/s9wF3YkwBW", Icon: FaDiscord },
];

/** ====== MOTION VARIANTS ====== **/
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Links() {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setReveal(true),
      {
        threshold: 0.2,
      }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText("@suji_lament");
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {
      /* no-op */
    }
  };

  return (
    <main
      className="relative px-4 pt-20 pb-24 sm:px-6 font-libre text-neutral-800 dark:text-neutral-200"
      style={{ ["--accent"]: ACCENT }}
    >
      {/* subtle fog (same as other pages) */}
      <div
        className="pointer-events-none absolute inset-0 top-0 h-[40vh] bg-gradient-to-b from-neutral-100/70 to-transparent dark:from-neutral-900/70"
        aria-hidden="true"
      />

      <section
        ref={sectionRef}
        className={`relative mx-auto w-full max-w-xl text-center transition-all duration-700 ${
          reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Title */}
        <h2 className="mb-2 text-3xl sm:text-4xl font-normal tracking-wide">
          Links
        </h2>
        <div
          className="mx-auto mb-6 h-px w-24"
          style={{ backgroundColor: "var(--accent)", opacity: 0.65 }}
        />

        {/* Subtitle + Discord copy */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          official links · minimal &amp; clean
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={copyDiscord}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800
                       bg-white/60 dark:bg-neutral-900/40 backdrop-blur px-3 py-1.5 text-xs
                       hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            aria-label="Copy Discord handle"
          >
            <FaDiscord className="text-[12px]" aria-hidden />
            {copied ? "copied ✓" : "discord: @suji_lament"}
          </button>
        </div>

        {/* Link list */}
        <motion.nav
          variants={container}
          initial="hidden"
          animate={reveal ? "show" : "hidden"}
          className="mt-8 space-y-3 text-left"
        >
          {LINKS.map(({ href, label, Icon }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              variants={item}
              className="group flex items-center justify-between gap-3 rounded-xl
                         border border-neutral-200 dark:border-neutral-800
                         bg-white/60 dark:bg-neutral-900/40 backdrop-blur
                         px-4 sm:px-5 py-4 transition-colors
                         hover:bg-white dark:hover:bg-neutral-800"
              aria-label={`${label} (opens in new tab)`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid place-items-center size-8 rounded-full border border-neutral-200 dark:border-neutral-800"
                >
                  <Icon className="text-[14px]" />
                </span>
                <span className="text-sm sm:text-base">{label}</span>
              </span>

              <span className="relative text-xs opacity-60">
                <span className="inline-block">↗</span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 mx-auto h-px w-0 bg-current transition-all duration-200 group-hover:w-4"
                />
              </span>
            </motion.a>
          ))}
        </motion.nav>

        {/* Tiny outro (optional, matches tone) */}
        <p className="mt-10 text-sm italic text-neutral-500 dark:text-neutral-400">
          “Find me where the echoes live.”
        </p>
      </section>
    </main>
  );
}
