// src/pages/Links.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaTwitter,
  FaPatreon,
  FaDiscord,
} from "react-icons/fa";

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
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Links() {
  const [copied, setCopied] = useState(false);

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
    <main className="pt-14 min-h-[calc(100dvh-56px)] px-4 sm:px-6">
      <section className="mx-auto w-full max-w-xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            suji °
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            official links · minimal &amp; clean
          </p>

          <div className="mt-5 flex justify-center">
            <button
              onClick={copyDiscord}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 
                         px-3 py-1.5 text-xs hover:bg-black hover:text-white
                         dark:hover:bg-white dark:hover:text-neutral-900 transition-colors"
              aria-label="Copy Discord handle"
            >
              <FaDiscord className="text-[12px]" aria-hidden />
              {copied ? "copied ✓" : "discord: @suji_lament"}
            </button>
          </div>
        </div>

        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 space-y-3"
        >
          {LINKS.map(({ href, label, Icon }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              variants={item}
              className="group flex items-center justify-between gap-3 rounded-xl
                         border border-black/10 dark:border-white/10
                         bg-white/70 dark:bg-neutral-900/60
                         px-4 sm:px-5 py-4 transition-colors
                         hover:bg-white dark:hover:bg-neutral-800/70"
              aria-label={`${label} (opens in new tab)`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid place-items-center size-8 rounded-full border border-black/10 dark:border-white/15"
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

        <div className="h-12" />
      </section>
    </main>
  );
}
