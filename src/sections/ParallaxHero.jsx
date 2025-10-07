import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ParallaxHero v3 (public/art/1.png..5.png)
 * - 1.png (bottom) = completely static
 * - Higher layers move/tilt more, max at the top layer
 * - Mouse-only parallax with spring smoothing + rAF throttling
 */
export default function ParallaxHero({
  children,
  height = "h-[calc(100vh-var(--header-h,64px))]",
  forceMotion = true, // set false to respect OS "Reduce Motion"
  baseScale = 1.075, // small safety scale to hide edges while moving
  tiltMax = { x: 6, y: 10 }, // degrees (x = pitch, y = yaw)
  depthPx = { min: 24, max: 90 }, // translate range from far→near (px)
}) {
  // your files live in /public/art/, served at /art/
  const BASE = "/art/";
  const COUNT = 5; // you currently have 1..5.png

  const prefersReduced = useReducedMotion();
  const DISABLE_MOTION = !forceMotion && prefersReduced;

  // layer order: 1 bottom (static) → COUNT top (max)
  const layers = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const index = i + 1;
        const depthNorm = COUNT > 1 ? (index - 1) / (COUNT - 1) : 0; // 0..1
        return { src: `${BASE}${index}.png`, z: index, depthNorm, index };
      }),
    []
  );

  // preloader for a clean fade-in
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true,
      loaded = 0;
    layers.forEach(({ src }) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        if (alive && loaded === layers.length) setReady(true);
      };
      img.src = src;
    });
    return () => {
      alive = false;
    };
  }, [layers]);

  // pointer tracking (rAF-throttled) → spring MV (-0.5..0.5)
  const wrapRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.25 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let af = 0;
    let pending = null;

    const handle = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      const nx = (clientX - (r.left + r.width / 2)) / r.width; // -0.5..0.5
      const ny = (clientY - (r.top + r.height / 2)) / r.height; // -0.5..0.5
      rawX.set(nx);
      rawY.set(ny);
    };

    const onMove = (e) => {
      if (DISABLE_MOTION) return;
      pending = { x: e.clientX, y: e.clientY };
      if (!af) {
        af = requestAnimationFrame(() => {
          if (pending) handle(pending.x, pending.y);
          af = 0;
          pending = null;
        });
      }
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (af) cancelAnimationFrame(af);
    };
  }, [DISABLE_MOTION, rawX, rawY]);

  // per-layer movement strength (px)
  const strengthFor = (depthNorm) => {
    if (depthNorm === 0) return 0; // absolutely static bottom layer
    const { min, max } = depthPx;
    return min + Math.pow(depthNorm, 1.15) * (max - min);
  };

  return (
    <section
      className={`relative w-screen left-1/2 -translate-x-1/2 ${height}`}
    >
      <div
        ref={wrapRef}
        className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-[#0B0B0C]"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {/* Each layer has its own parallax + tilt */}
        <div className="absolute inset-0">
          {layers.map((layer) => {
            const s = strengthFor(layer.depthNorm);
            const tx = useTransform(x, (v) => (DISABLE_MOTION ? 0 : v * s));
            const ty = useTransform(y, (v) => (DISABLE_MOTION ? 0 : v * s));
            const rX = useTransform(y, (v) =>
              DISABLE_MOTION ? 0 : v * -(tiltMax.x * layer.depthNorm)
            );
            const rY = useTransform(x, (v) =>
              DISABLE_MOTION ? 0 : v * (tiltMax.y * layer.depthNorm)
            );
            const rZ = useTransform(x, (v) =>
              DISABLE_MOTION ? 0 : v * (0.5 + layer.depthNorm * 1.25)
            );

            return (
              <motion.img
                key={layer.src}
                src={layer.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none will-change-transform"
                style={{
                  translateX: tx,
                  translateY: ty,
                  rotateX: rX,
                  rotateY: rY,
                  rotateZ: rZ,
                  zIndex: layer.z, // 1..COUNT
                  scale: baseScale,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 0.4, delay: layer.depthNorm * 0.045 }}
                aria-hidden="true"
              />
            );
          })}
        </div>

        {/* Vignette + soft grain */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,.7) 1px, transparent 0)",
              backgroundSize: "3px 3px",
            }}
          />
        </div>

        {/* Overlay slot */}
        <div className="absolute inset-0 z-30 grid place-items-center px-6">
          <div className="text-center pointer-events-auto">{children}</div>
        </div>

        {/* Loading veil */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-neutral-200/40 dark:bg-black/30 pointer-events-none"
        />
      </div>
    </section>
  );
}
