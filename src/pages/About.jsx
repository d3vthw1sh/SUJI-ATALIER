// src/pages/About.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/** ====== CONFIG ====== **/
const ACCENT = "#6C7AA8"; // change to your OC/brand color

// Featured image (NOT in gallery). Inverts on dark mode.
const FEATURED = {
  src: "/aboutpage/image_sketch_by_lunaminiss.png",
  cap: "OC sketch: stray lines, wind in the hair, and a half-smile that knows.",
};

// Gallery (image_sketch2 removed)
const GALLERY = [
  { src: "/aboutpage/OC_by_Jtlr4hj_.jpg", cap: "OC illustration by Jtlr4hj" },
  {
    src: "/aboutpage/Oc_Reference_Sheet_by_hehehahaartowo.png",
    cap: "Reference sheet by hehehahaartowo",
  },
  {
    src: "/aboutpage/OC1_Front_by_UrsprungNull_0.png",
    cap: "Front view by UrsprungNull",
  },
  {
    src: "/aboutpage/OC1_sideprofile_by_UrsprungNull_0.PNG",
    cap: "Side profile by UrsprungNull",
  },
];

/** ====== BLUR-IMAGE HELPER ====== **/
function BlurImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-[filter,opacity,transform] duration-700
        ${
          loaded
            ? "opacity-100 blur-0 translate-y-0"
            : "opacity-80 blur-[2px] translate-y-[2px]"
        }`}
    />
  );
}

export default function About() {
  /** reveal animations **/
  const introRef = useRef(null);
  const quoteRef = useRef(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const io1 = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShowIntro(true),
      { threshold: 0.15 }
    );
    const io2 = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShowQuote(true),
      { threshold: 0.2 }
    );
    if (introRef.current) io1.observe(introRef.current);
    if (quoteRef.current) io2.observe(quoteRef.current);
    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, []);

  /** Lightbox **/
  const ALL_IMAGES = useMemo(
    () => [FEATURED.src, ...GALLERY.map((g) => g.src)],
    []
  );
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const openLightbox = (src) => setLightboxIdx(ALL_IMAGES.indexOf(src));
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () =>
    setLightboxIdx((i) => (i - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
  const next = () => setLightboxIdx((i) => (i + 1) % ALL_IMAGES.length);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx]);

  return (
    <main
      className="relative px-4 pt-20 pb-24 sm:px-6 font-libre text-neutral-800 dark:text-neutral-200"
      style={{ ["--accent"]: ACCENT }}
    >
      {/* subtle fog */}
      <div
        className="pointer-events-none absolute inset-0 top-0 h-[40vh] bg-gradient-to-b from-neutral-100/70 to-transparent dark:from-neutral-900/70"
        aria-hidden="true"
      />

      <section className="relative mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-3xl sm:text-4xl font-normal tracking-wide">
          About
        </h2>
        <div
          className="mx-auto mb-8 h-px w-24"
          style={{ backgroundColor: "var(--accent)", opacity: 0.65 }}
        />

        {/* Intro */}
        <p
          ref={introRef}
          className={`text-[17px] leading-relaxed text-justify transition-all duration-1000
            ${
              showIntro
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }
            first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-normal first-letter:leading-none first-letter:pt-1`}
        >
          I’m <strong>Suji</strong>, a producer who builds quiet worlds out of
          sound. Every track begins in stillness and grows from a feeling of
          distance, like light reflecting on water. I like slow textures, fading
          chords, and melodies that almost disappear. It’s music for moments
          that don’t need to be loud.
        </p>

        {/* Quote */}
        <blockquote
          ref={quoteRef}
          className={`mt-6 border-l pl-4 italic text-[17px] text-neutral-600 dark:text-neutral-400 transition-all duration-700 ${
            showQuote ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ borderColor: "var(--accent)" }}
        >
          “Somewhere between the real and the imagined — that’s where my sound
          lives.”
        </blockquote>

        {/* Small scroll cue */}
        <div className="mt-10 flex justify-center">
          <div className="flex flex-col items-center text-neutral-400 text-xs select-none">
            <span className="tracking-wide">scroll</span>
            <span className="mt-1 inline-block animate-bounce">▾</span>
          </div>
        </div>

        {/* Featured Sketch (inverts in dark mode) */}
        <div className="mt-12">
          <figure className="relative group mb-2 flex flex-col items-center">
            <button
              onClick={() => openLightbox(FEATURED.src)}
              className="group w-full max-w-2xl focus:outline-none"
              aria-label="Open artwork"
            >
              <BlurImage
                src={FEATURED.src}
                alt="OC sketch"
                className="w-full object-contain invert-0 dark:invert"
              />
              <span
                className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300 text-center text-xs bg-black/40 backdrop-blur-sm text-white py-1"
              >
                {FEATURED.cap}
              </span>
            </button>
          </figure>
          <figcaption className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
            Visual art by <span className="font-medium">lunaminiss</span>
          </figcaption>
        </div>

        {/* Character Lore (Lyune) */}
        <div className="mt-12 grid gap-3">
          <h3 className="text-center text-xl font-normal">Character Lore</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px]">
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Name
              </div>
              <div className="mt-1">
                <strong>Lyune</strong>{" "}
                <span className="text-neutral-500 text-sm">
                  (pronounced Ly-yu-ne)
                </span>
                <br />— “lyric + lune,” a quiet song beneath a dying sky
              </div>
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Motif
              </div>
              <div className="mt-1">
                snow • stillness • mirage • fading world • ghost light
              </div>
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Mood
              </div>
              <div className="mt-1">melancholy / solitude / faint hope</div>
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 sm:col-span-2">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Lore
              </div>
              <div className="mt-1 leading-relaxed">
                A witch bound by a divine curse to wander through countless
                lives. Each world she wakes in feels colder, emptier — her
                memories blur like snow falling on glass. She no longer fights
                the cycle; she simply walks through it, collecting fragments of
                warmth that disappear by morning. In the silence between worlds,
                she hums a song no one remembers — a promise left unfinished at
                the edge of time.
              </div>
            </div>
          </div>

          {/* Black/White SoundCloud button (auto-inverts in dark mode) */}
          <div className="mt-8 flex flex-col items-center text-center text-sm text-neutral-500 dark:text-neutral-400">
            <a
              href="https://soundcloud.com/suji_lament/sets/project-lyune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 text-[15px] tracking-wide transition-all duration-200 rounded-full
                border bg-black text-white border-black
                hover:bg-white hover:text-black hover:border-black
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                dark:bg-white dark:text-black dark:border-white
                dark:hover:bg-black dark:hover:text-white dark:hover:border-white
                dark:focus:ring-white dark:focus:ring-offset-neutral-900"
            >
              Project Lyune — a drifting world in sound
            </a>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-12">
          <div className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
            Gallery
          </div>
          <div className="columns-1 sm:columns-2 gap-4 [column-fill:_balance]">
            {GALLERY.map(({ src, cap }, i) => (
              <figure
                key={src}
                className="relative group mb-4 break-inside-avoid opacity-0 animate-fadeInUp"
                style={{ animationDelay: `${120 * i}ms` }}
              >
                <button
                  onClick={() => openLightbox(src)}
                  className="block w-full focus:outline-none"
                  aria-label="Open image"
                >
                  <BlurImage
                    src={src}
                    alt={cap}
                    className="w-full object-contain"
                  />
                  <span
                    className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                      transition-all duration-300 text-center text-xs bg-black/40 backdrop-blur-sm text-white py-1"
                  >
                    {cap}
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </div>

        {/* Outro */}
        <p className="mt-12 text-center italic text-neutral-600 dark:text-neutral-400">
          “Maybe the silence between notes is where the truth hides.”
        </p>

        {/* Credits */}
        <p className="mt-6 text-sm text-center text-neutral-500 dark:text-neutral-400">
          Visual art by <span className="font-medium">lunaminiss</span>,
          Jtlr4hj, hehehahaartowo, and UrsprungNull
        </p>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 text-3xl select-none"
            aria-label="Previous"
          >
            ‹
          </button>
          <img
            src={ALL_IMAGES[lightboxIdx]}
            alt="Artwork"
            className="max-h-[92vh] max-w-[92vw] object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 text-3xl select-none"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}

      {/* fade-in animation */}
      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
      `}</style>
    </main>
  );
}
