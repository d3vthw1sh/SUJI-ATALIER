// src/pages/Works.jsx
import { useEffect, useRef, useState } from "react";

export default function Works() {
  const ACCENT = "#6C7AA8"; // same as About/Contact
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      {
        threshold: 0.2,
      }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

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

      <section
        ref={sectionRef}
        className={`relative mx-auto max-w-5xl text-center transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Title */}
        <h2 className="mb-2 text-3xl sm:text-4xl font-normal tracking-wide">
          Works
        </h2>
        <div
          className="mx-auto mb-8 h-px w-24"
          style={{ backgroundColor: "var(--accent)", opacity: 0.65 }}
        />

        {/* Intro text */}
        <p className="mx-auto max-w-lg text-[15.5px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          A collection of sounds and stories that I’ve released into the world.
          You can explore more of my music on{" "}
          <a
            href="https://soundcloud.com/suji_lament"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--accent)] underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
          >
            SoundCloud
          </a>
          .
        </p>

        {/* SoundCloud player */}
        <div className="mt-10 w-full overflow-hidden rounded-2xl shadow-md">
          <iframe
            width="100%"
            height="600"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/suji_lament&color=%23000000&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"
          ></iframe>
        </div>

        {/* Outro quote */}
        <p className="mt-12 text-sm italic text-neutral-500 dark:text-neutral-400">
          “Every note I release carries a piece of where I’ve been.”
        </p>
      </section>
    </main>
  );
}
