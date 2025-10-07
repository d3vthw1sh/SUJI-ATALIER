// src/pages/Contact.jsx
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const ACCENT = "#6C7AA8";
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold: 0.2 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <main
      className="relative px-4 pt-20 pb-24 sm:px-6 font-libre text-neutral-800 dark:text-neutral-200"
      style={{ ["--accent"]: ACCENT }}
    >
      <section
        ref={sectionRef}
        className={`relative mx-auto max-w-5xl transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Image container */}
        <div className="relative flex items-center justify-center overflow-hidden">
          <img
            src="/contactpage/image_sketch2_by_lunaminiss.png"
            alt="Contact artwork"
            className="w-full max-h-[70vh] object-contain dark:invert rounded-lg md:translate-x-16 transition-transform duration-700"
          />

          {/* Text overlay — desktop only (unchanged layout) */}
          <div className="hidden md:block absolute left-20 top-1/2 -translate-y-1/2 text-left max-w-sm">
            <h2 className="mb-3 text-4xl font-normal tracking-wide">Contact</h2>
            <p className="text-[15.5px] leading-relaxed text-neutral-700 dark:text-neutral-200">
              You can reach me through Discord:{" "}
              <span className="font-medium">@suji_lament</span>
              <br />
              or email:{" "}
              <a
                href="mailto:sujilament@gmail.com"
                className="underline decoration-[var(--accent)] underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
              >
                sujilament@gmail.com
              </a>
            </p>
            <p className="mt-6 text-sm italic text-neutral-500 dark:text-neutral-400">
              “Leave a message.”
            </p>
          </div>
        </div>

        {/* Mobile stack — only shows on small screens */}
        <div className="md:hidden mt-4 text-left">
          <h2 className="mb-2 text-3xl font-normal tracking-wide">Contact</h2>
          <p className="text-[15.5px] leading-relaxed text-neutral-700 dark:text-neutral-200">
            You can reach me through Discord:{" "}
            <span className="font-medium">@suji_lament</span>
            <br />
            or email:{" "}
            <a
              href="mailto:sujilament@gmail.com"
              className="underline decoration-[var(--accent)] underline-offset-4 hover:text-neutral-900 dark:hover:text-white break-all"
            >
              sujilament@gmail.com
            </a>
          </p>
          <p className="mt-4 text-sm italic text-neutral-500 dark:text-neutral-400">
            “Leave a message.”
          </p>
        </div>
      </section>
    </main>
  );
}
