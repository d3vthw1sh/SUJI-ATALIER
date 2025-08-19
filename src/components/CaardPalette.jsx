// components/link/linkPalette.jsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  { label: "Patreon", href: "https://patreon.com/suji", Icon: FaPatreon },
  { label: "Discord", href: "https://discord.gg/s9wF3YkwBW", Icon: FaDiscord },
];

export default function linkPalette({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function onDown(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-28 w-[min(92vw,520px)] rounded-2xl border border-black/10 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <h2 className="text-sm font-semibold">link</h2>
              <button
                onClick={onClose}
                className="rounded-full border border-black/10 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-800"
              >
                Esc
              </button>
            </div>

            <nav className="mt-1 divide-y divide-black/5 dark:divide-white/5">
              {LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <div className="flex items-center gap-3">
                    <Icon aria-hidden className="text-base" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span
                    aria-hidden
                    className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </nav>

            <p className="px-3 pb-2 pt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
              official links · no spam · Press Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
