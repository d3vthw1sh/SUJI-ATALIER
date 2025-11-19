import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import FloatingParticles from "../components/FloatingParticles";

/**
 * ParallaxHero v4 (Restored)
 * - Cinematic entrance (zoom out)
 * - Floating particles (Subtle)
 * - Mouse parallax
 */
export default function ParallaxHero({
  children,
  height = "h-[calc(100vh-var(--header-h,64px))]",
  forceMotion = true,
  baseScale = 1.15, // slightly larger for zoom effect
  tiltMax = { x: 5, y: 8 },
  depthPx = { min: 20, max: 80 },
}) {
  const BASE = "/art/";
  const COUNT = 5;

  const prefersReduced = useReducedMotion();
  const DISABLE_MOTION = !forceMotion && prefersReduced;

  const layers = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const index = i + 1;
        const depthNorm = COUNT > 1 ? (index - 1) / (COUNT - 1) : 0;
        return { src: `${BASE}${index}.png`, z: index, depthNorm };
      }),
    []
  );

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

  // Mouse Parallax Logic
  const wrapRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 20 });
  const y = useSpring(rawY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    
    const onMove = (e) => {
      if (DISABLE_MOTION) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      rawX.set(nx);
      rawY.set(ny);
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
    };
  }, [DISABLE_MOTION, rawX, rawY]);

  const strengthFor = (depthNorm) => {
    if (depthNorm === 0) return 0;
    const { min, max } = depthPx;
    return min + Math.pow(depthNorm, 1.2) * (max - min);
  };

  return (
    <section
      className={`parallax-hero relative w-screen left-1/2 -translate-x-1/2 ${height} overflow-hidden bg-[#0B0B0C]`}
    >
      <div
        ref={wrapRef}
        className="relative w-full h-full"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {/* Layers */}
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
                  zIndex: layer.z,
                }}
                initial={{ opacity: 0, scale: baseScale * 1.1 }}
                animate={{ 
                  opacity: ready ? 1 : 0,
                  scale: ready ? baseScale : baseScale * 1.1
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: layer.depthNorm * 0.1 },
                  scale: { duration: 2.5, ease: "easeOut" }
                }}
              />
            );
          })}
        </div>

        {/* Atmosphere */}
        <FloatingParticles count={25} className="bg-white/60" />
        
        {/* Vignette & Grain */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
          <div className="relative text-center pointer-events-auto">
            {children}
          </div>
        </div>

        {/* Loading Veil */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 bg-black z-50 pointer-events-none"
        />
      </div>
    </section>
  );
}
