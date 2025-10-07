// src/pages/Works.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/** ====== THEME ====== **/
const ACCENT = "#6C7AA8"; // same as About

/** ====== LINKS ====== **/
const LINKS = {
  soundcloudProfile: "https://soundcloud.com/suji_lament",
  spotifyArtist:
    "https://open.spotify.com/artist/4Vsj7kMT96ERwjEwonlGAn?si=vZ8qsW2eTJqHTr21y2dvxw",
  collabTracks: [
    "https://open.spotify.com/track/0xtK0T3aFtdn3rznYLPV3x?si=3e82be16962d4328",
    "https://open.spotify.com/track/62mTbNTMTGwrLv5zRqqCIY?si=d1a3bf1832624e18",
    "https://open.spotify.com/track/2TpoynnKEI2HU0gGZJWLJL?si=e5b0b1d7462e43b5",
  ],
  youtubeFilm: "https://www.youtube.com/watch?v=44kk_Hfv00Y",
  youtubeMixing:
    "https://www.youtube.com/watch?v=jxWMFXi4LSo&list=PLh22YfAPcJpQFMMY537fpNEl71DxvGSLC",
  youtubeChannel: "https://www.youtube.com/@suji_lament",
};

/** ====== UTILS ====== **/
function cls(...xs) {
  return xs.filter(Boolean).join(" ");
}
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, show };
}
function getSpotifyId(url, kind /* "track" | "artist" */) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const i = parts.findIndex((p) => p === kind);
    return i !== -1 && parts[i + 1] ? parts[i + 1] : null;
  } catch {
    return null;
  }
}
function spotifyTrackEmbed(url) {
  const id = getSpotifyId(url, "track");
  return id ? `https://open.spotify.com/embed/track/${id}` : null;
}
function spotifyArtistEmbed(url) {
  const id = getSpotifyId(url, "artist");
  return id ? `https://open.spotify.com/embed/artist/${id}` : null;
}

/** ====== MICRO ICONS ====== **/
function ExternalIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 3h7v7M21 3l-9 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 14v5a2 2 0 0 1-2 2h-5M3 10V5a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
function YouTubeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.13C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.38.57A3.02 3.02 0 0 0 .5 6.2C0 7.98 0 12 0 12s0 4.02.5 5.8a3.02 3.02 0 0 0 2.12 2.13C4.4 20.5 12 20.5 12 20.5s7.6 0 9.38-.57a3.02 3.02 0 0 0 2.12-2.13C24 16.02 24 12 24 12s0-4.02-.5-5.8ZM9.75 15.5v-7L15.5 12l-5.75 3.5Z"
      />
    </svg>
  );
}
function SpotifyIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5Zm4.9 14.33a.82.82 0 0 1-1.13.27c-3.1-1.9-7-2.33-11.59-1.28a.82.82 0 1 1-.36-1.6c5-1.14 9.3-.66 12.72 1.4.38.23.5.73.27 1.2Zm1.49-3.15a1 1 0 0 1-1.37.33c-3.55-2.16-8.95-2.8-13.15-1.54a1 1 0 1 1-.57-1.92c4.7-1.39 10.66-.66 14.67 1.77a1 1 0 0 1 .42 1.36Zm.15-3.23a1.2 1.2 0 0 1-1.65.41c-3.97-2.38-10.01-2.59-13.6-1.44a1.2 1.2 0 1 1-.72-2.29c4.2-1.31 10.86-1.06 15.41 1.67a1.2 1.2 0 0 1 .56 1.65Z"
      />
    </svg>
  );
}

/** ====== SHARED UI (minimal, About-like) ====== **/
function SectionHeader({ title, note }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h3 className="text-xl font-normal tracking-wide">
        <span className="relative inline-block">
          {title}
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, ${ACCENT} 0%, transparent 65%)`,
            }}
          />
        </span>
      </h3>
      {note ? (
        <span className="text-[12.5px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          {note}
        </span>
      ) : null}
    </div>
  );
}
function Panel({ children, className = "" }) {
  return (
    <div
      className={cls(
        "relative rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 shadow-sm",
        "before:absolute before:inset-0 before:pointer-events-none",
        "before:[background:radial-gradient(12px_12px_at_12px_12px_var(--accent)/22%,transparent_12px),_radial-gradient(12px_12px_at_calc(100%-12px)_12px_var(--accent)/22%,transparent_12px),_radial-gradient(12px_12px_at_12px_calc(100%-12px)_var(--accent)/22%,transparent_12px),_radial-gradient(12px_12px_at_calc(100%-12px)_calc(100%-12px)_var(--accent)/22%,transparent_12px)]",
        className
      )}
      style={{ ["--accent"]: ACCENT }}
    >
      {children}
    </div>
  );
}

/** ====== EMBEDS ====== **/
function SoundCloudProfile({ url }) {
  return (
    <Panel>
      <iframe
        title="SoundCloud — suji_lament"
        width="100%"
        height="560"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={
          "https://w.soundcloud.com/player/?url=" +
          encodeURIComponent(url) +
          "&color=%23111111&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false"
        }
        loading="lazy"
        className="rounded-2xl"
      />
    </Panel>
  );
}
function SpotifyArtist({ url }) {
  const src = useMemo(() => spotifyArtistEmbed(url), [url]);
  if (!src) return null;
  return (
    <Panel>
      <iframe
        title="Spotify — Artist"
        src={src}
        width="100%"
        height="360"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-2xl"
      />
    </Panel>
  );
}
function SpotifyTrack({ url }) {
  const src = useMemo(() => spotifyTrackEmbed(url), [url]);
  if (!src) return null;
  return (
    <Panel>
      <iframe
        title="Spotify — Track"
        src={`${src}?utm_source=generator`}
        width="100%"
        height="180"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-2xl"
      />
      <div className="flex items-center justify-end px-3 py-2 text-[13px]">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-[var(--accent)] underline-offset-4 hover:opacity-90"
          title="Open on Spotify"
        >
          Open on Spotify <ExternalIcon />
        </a>
      </div>
    </Panel>
  );
}
function YouTubeEmbed({ url, title = "YouTube" }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    try {
      const u = new URL(url);
      const list = u.searchParams.get("list");
      const v = u.searchParams.get("v");
      if (list && v) setSrc(`https://www.youtube.com/embed/${v}?list=${list}`);
      else if (list)
        setSrc(`https://www.youtube.com/embed/videoseries?list=${list}`);
      else if (v) setSrc(`https://www.youtube.com/embed/${v}`);
    } catch {
      setSrc(null);
    }
  }, [url]);

  if (!src) return null;

  return (
    <Panel>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full rounded-2xl"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-[13px]">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-[var(--accent)] underline-offset-4 hover:opacity-90"
        >
          Open on YouTube <ExternalIcon />
        </a>
        <span className="text-neutral-500 dark:text-neutral-400">YouTube</span>
      </div>
    </Panel>
  );
}

/** ====== MAIN ====== **/
export default function Works() {
  const mainReveal = useReveal(0.15);
  const scReveal = useReveal(0.2);
  const spReveal = useReveal(0.2);
  const colReveal = useReveal(0.2);
  const filmReveal = useReveal(0.2);
  const mixReveal = useReveal(0.2);
  const gameReveal = useReveal(0.2);
  const profReveal = useReveal(0.2);

  return (
    <main
      className="relative px-4 pt-20 pb-24 sm:px-6 font-libre text-neutral-800 dark:text-neutral-200"
      style={{ ["--accent"]: ACCENT }}
    >
      {/* subtle fog (same as About) */}
      <div
        className="pointer-events-none absolute inset-0 top-0 h-[40vh] bg-gradient-to-b from-neutral-100/70 to-transparent dark:from-neutral-900/70"
        aria-hidden="true"
      />

      <section
        ref={mainReveal.ref}
        className={cls(
          "relative mx-auto max-w-5xl transition-all duration-700",
          mainReveal.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3"
        )}
      >
        {/* Title */}
        <h2 className="mb-2 text-center text-3xl sm:text-4xl font-normal tracking-wide">
          Works
        </h2>
        <div
          className="mx-auto mb-8 h-px w-24"
          style={{ backgroundColor: "var(--accent)", opacity: 0.65 }}
        />

        {/* Description (less corny) */}
        <p className="mx-auto max-w-xl text-[15.5px] leading-relaxed text-neutral-600 dark:text-neutral-400 text-justify animate-fadeInUp"></p>

        {/* 1) SoundCloud */}
        <div
          ref={scReveal.ref}
          className={cls(
            "mt-10 transition-all duration-700",
            scReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="SoundCloud" note="STREAM / WAVEFORM" />
          <SoundCloudProfile url={LINKS.soundcloudProfile} />
        </div>

        {/* 2) Spotify Artist */}
        <div
          ref={spReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            spReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Spotify" note="ARTIST • RELEASES" />
          <SpotifyArtist url={LINKS.spotifyArtist} />
        </div>

        {/* 3) Collaborations */}
        <div
          ref={colReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            colReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Collaborations" note="SPOTIFY TRACK EMBEDS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LINKS.collabTracks.map((u, i) => (
              <SpotifyTrack key={`collab-${i}`} url={u} />
            ))}
          </div>
        </div>

        {/* 4) Film / Shorts */}
        <div
          ref={filmReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            filmReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Film / Shorts" note="YOUTUBE" />
          <YouTubeEmbed
            url={LINKS.youtubeFilm}
            title="Short film — music (contrib.)"
          />
        </div>

        {/* 5) Mixing / Services */}
        <div
          ref={mixReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            mixReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Mixing / Services" note="YOUTUBE PLAYLIST" />
          <YouTubeEmbed
            url={LINKS.youtubeMixing}
            title="Mixing playlist — YouTube"
          />
        </div>

        {/* 6) Game / OST — NDA (no direct contact links here) */}
        <div
          ref={gameReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            gameReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Game / OST" note="NDA — IN PROGRESS" />
          <Panel>
            <div className="px-5 py-5">
              <p className="text-[14.5px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                I’m currently scoring and sound-designing for a few game studios
                (under NDA). I’ll share titles and cues here once they’re
                public. If you’re building a world and want me on it, reach out
                via my Discord or email — details are on the Contact page.
              </p>
            </div>
          </Panel>
        </div>

        {/* 7) Profile (YouTube) */}
        <div
          ref={profReveal.ref}
          className={cls(
            "mt-12 transition-all duration-700",
            profReveal.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <SectionHeader title="Profile" note="YOUTUBE CHANNEL" />
          <a
            href={LINKS.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 px-5 py-4 shadow-sm hover:shadow transition"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[15px]">
                <YouTubeIcon className="h-4 w-4" />
                @suji_lament
              </span>
              <ExternalIcon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
            </div>
            <div className="mt-2 h-px w-full bg-gradient-to-r from-[var(--accent)]/70 to-transparent" />
            <p className="mt-2 text-[13.5px] text-neutral-600 dark:text-neutral-400">
              Videos, previews, and mixing reels.
            </p>
          </a>
        </div>

        {/* Outro (less corny) */}
        <p className="mt-12 text-center italic text-neutral-600 dark:text-neutral-400">
          “The sound fades, but the feeling stays.”
        </p>
      </section>

      {/* tiny fade-in animation to match About */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.9s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </main>
  );
}
