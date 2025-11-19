// src/pages/About.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** ====== CONFIG ====== **/
const ACCENT = "#6C7AA8"; // brand color

// Featured image
const FEATURED = {
  src: "/aboutpage/image_sketch_by_lunaminiss.png",
  cap: "OC sketch: stray lines, wind in the hair, and a half-smile that knows.",
};

// Gallery
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

/** ====== COMPONENTS ====== **/

function BlurImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ 
          opacity: loaded ? 1 : 0, 
          filter: loaded ? "blur(0px)" : "blur(10px)" 
        }}
        transition={{ duration: 0.7 }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function FogBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <motion.div
        initial={{ x: "-10%" }}
        animate={{ x: "10%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 20,
          ease: "easeInOut",
        }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 dark:opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0), rgba(108, 122, 168, 0.1) 40%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.6 }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 5,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-100/20 to-neutral-100/80 dark:via-neutral-900/20 dark:to-neutral-900/80"
      />
    </div>
  );
}

const containerVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  /** Lightbox Logic **/
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
      className="relative min-h-screen px-4 pt-24 pb-32 sm:px-6 font-libre text-neutral-800 dark:text-neutral-200 overflow-hidden"
      style={{ "--accent": ACCENT }}
    >
      <FogBackground />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-thin tracking-[0.2em] uppercase text-neutral-900 dark:text-white drop-shadow-sm">
            About
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-[1px] bg-current mx-auto mt-4 opacity-50"
          />
        </motion.div>

        {/* Intro Section */}
        <motion.section
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div variants={itemVar} className="order-2 md:order-1">
             <p className="text-lg leading-loose text-justify font-light">
              <span className="text-4xl float-left mr-2 mt-[-6px] font-serif text-[var(--accent)]">I</span>
              ’m <strong>Suji</strong>, a producer who builds quiet worlds out of
              sound. Every track begins in stillness and grows from a feeling of
              distance, like light reflecting on water. I like slow textures, fading
              chords, and melodies that almost disappear. It’s music for moments
              that don’t need to be loud.
            </p>
            <motion.blockquote
              variants={itemVar}
              className="mt-8 pl-6 border-l-2 border-[var(--accent)] italic text-neutral-500 dark:text-neutral-400"
            >
              “Somewhere between the real and the imagined — that’s where my sound lives.”
            </motion.blockquote>
          </motion.div>

          <motion.div variants={itemVar} className="order-1 md:order-2 flex justify-center">
             <div 
                className="relative group cursor-pointer"
                onClick={() => openLightbox(FEATURED.src)}
             >
                <div className="absolute -inset-2 bg-[var(--accent)]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <BlurImage
                  src={FEATURED.src}
                  alt="OC Sketch"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain invert-0 dark:invert drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
             </div>
          </motion.div>
        </motion.section>

        {/* Lore Section - Clean Style */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          <div className="sm:px-4">
            <motion.h3 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.1em" }}
              transition={{ duration: 1.5 }}
              className="text-center text-2xl font-light uppercase mb-12 text-[var(--accent)]"
            >
              Character Archive
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stats */}
              <div className="space-y-6 font-mono text-sm">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-xs text-neutral-400 uppercase mb-1">Designation</div>
                  <div className="text-lg">LYUNE</div>
                </motion.div>
                <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.3 }}
                >
                  <div className="text-xs text-neutral-400 uppercase mb-1">Affinity</div>
                  <div>Snow / Void / Echoes</div>
                </motion.div>
                <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.4 }}
                >
                  <div className="text-xs text-neutral-400 uppercase mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Wandering
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div 
                className="md:col-span-2 leading-relaxed text-neutral-600 dark:text-neutral-300 font-light"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p className="mb-4">
                  A witch bound by a divine curse to wander through countless lives. 
                  Each world she wakes in feels colder, emptier — her memories blur like 
                  snow falling on glass.
                </p>
                <p>
                  She no longer fights the cycle; she simply walks through it, collecting 
                  fragments of warmth that disappear by morning. In the silence between 
                  worlds, she hums a song no one remembers — a promise left unfinished 
                  at the edge of time.
                </p>
                
                <div className="mt-8 pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                   <a
                    href="https://soundcloud.com/suji_lament/sets/project-lyune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm hover:text-[var(--accent)] transition-colors"
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-full border border-current group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                      ▶
                    </span>
                    <span>Listen to Project Lyune audio logs</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Gallery Grid */}
        <motion.section
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-24"
        >
          <motion.h3 variants={itemVar} className="text-center text-sm uppercase tracking-widest text-neutral-400 mb-8">
            Visual Records
          </motion.h3>
          
          <div className="columns-1 sm:columns-2 gap-6 space-y-6">
            {GALLERY.map((img, i) => (
              <motion.div
                key={img.src}
                variants={itemVar}
                className="break-inside-avoid"
              >
                <div 
                  className="group relative overflow-hidden cursor-zoom-in bg-neutral-100 dark:bg-neutral-800"
                  onClick={() => openLightbox(img.src)}
                >
                  <BlurImage 
                    src={img.src} 
                    alt={img.cap} 
                    className="w-full transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs tracking-wide text-center">{img.cap}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center text-neutral-400 text-sm italic"
        >
          “Maybe the silence between notes is where the truth hides.”
        </motion.div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-4 text-white/50 hover:text-white transition-colors text-4xl"
            >
              ‹
            </button>
            
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={ALL_IMAGES[lightboxIdx]}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-4 text-white/50 hover:text-white transition-colors text-4xl"
            >
              ›
            </button>
            
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm">
              {lightboxIdx === 0 ? FEATURED.cap : GALLERY[lightboxIdx - 1].cap}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
