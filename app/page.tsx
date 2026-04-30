"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const asset = (path: string) => `.${path}`;
const LazySpotifyFrame = dynamic(
  () =>
    Promise.resolve(function SpotifyFrame() {
      return (
        <iframe
          title="Spotify Soy Matt"
          src="https://open.spotify.com/embed/artist/70fHdUStdmfMbQmPF7IuHO?utm_source=generator&theme=0"
          width="100%"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-2xl"
        />
      );
    }),
  { ssr: false }
);

const tracks = [
  {
    title: "Preguntas Anonimas",
    cover: asset("/miniaturas/miniatura-1.png"),
    url: "https://open.spotify.com/search/Preguntas%20Anonimas%20SoyMattMusic"
  },
  {
    title: "No Me Mires",
    cover: asset("/miniaturas/miniatura-2.png"),
    url: "https://open.spotify.com/search/No%20Me%20Mires%20SoyMattMusic"
  },
  {
    title: "BREVE",
    cover: asset("/miniaturas/miniatura-3.png"),
    url: "https://open.spotify.com/search/BREVE%20SoyMattMusic"
  }
];

const gallery = [
  asset("/fotos/_MG_1248.jpg"),
  asset("/fotos/_MG_1265.jpg"),
  asset("/fotos/_MG_1352.jpg"),
  asset("/fotos/_MG_1417.jpg"),
  asset("/fotos/_MG_1475.jpg"),
  asset("/fotos/_MG_1553.jpg"),
  asset("/fotos/_MG_1569.jpg"),
  asset("/fotos/_MG_1724.jpg")
];

const clips = [
  asset("/reels/reel-1.mp4"),
  asset("/reels/reel-2.mp4"),
  asset("/reels/reel-3.mp4")
];
const featuredClip = asset("/reels/reel-4.mp4");

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [soundOn, setSoundOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [featuredMuted, setFeaturedMuted] = useState(true);
  const [reelMuted, setReelMuted] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true
  });
  const reelRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const featuredRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const particles = useMemo(() => Array.from({ length: isMobile ? 0 : 6 }, (_, i) => i), [isMobile]);
  const backgroundDots = useMemo(
    () =>
      Array.from({ length: isMobile ? 24 : 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 4.5
      })),
    [isMobile]
  );

  useEffect(() => {
    const targets = [...reelRefs.current, featuredRef.current].filter(
      (el): el is HTMLVideoElement => Boolean(el)
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    targets.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);
  const toggleReelSound = (idx: number) => {
    setReelMuted((prev) => {
      const nextMuted = !prev[idx];
      const next = { ...prev, [idx]: nextMuted };
      const video = reelRefs.current[idx];
      if (video) {
        video.muted = nextMuted;
        void video.play();
      }
      return next;
    });
  };
  const toggleFeaturedSound = () => {
    setFeaturedMuted((prev) => {
      const nextMuted = !prev;
      if (featuredRef.current) {
        featuredRef.current.muted = nextMuted;
        void featuredRef.current.play();
      }
      return nextMuted;
    });
  };

  return (
    <main className="relative overflow-hidden bg-night text-white font-body">
      <div className="pointer-events-none absolute inset-0 z-0">
        {backgroundDots.map((dot) => (
          <motion.span
            key={dot.id}
            className="absolute rounded-full bg-[#00ffd0]"
            style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size }}
            animate={reduceMotion || isMobile ? { opacity: 0.14, scale: 1 } : { opacity: [0.08, 0.18, 0.08], scale: [0.98, 1.03, 0.98] }}
            transition={
              reduceMotion || isMobile
                ? { duration: 0 }
                : { duration: dot.duration + 2, repeat: Infinity, delay: dot.delay }
            }
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none fixed z-[999] hidden h-8 w-8 rounded-full border border-white/70 mix-blend-difference md:block"
        animate={{ x: cursor.x - 16, y: cursor.y - 16 }}
        transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.3 }}
      />

      {loading && (
        <motion.section
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.6, times: [0, 0.88, 1], ease: "easeInOut" }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute h-72 w-72 rounded-full bg-neonViolet/35 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.8, 0.35] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
          />
          <motion.h1
            className="relative z-10 flex w-full items-center justify-center gap-1 px-6 text-center font-display text-4xl font-extrabold tracking-[0.1em] sm:gap-3 sm:text-5xl md:text-8xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.1, times: [0, 0.18, 0.62, 0.78], ease: "easeInOut" }}
          >
            <span>SOY</span>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.16, 1.55, 6.8, 10.5] }}
              transition={{ duration: 2.35, times: [0, 0.24, 0.52, 0.8, 1], ease: ["easeOut", "easeOut", "easeInOut", "easeIn"] }}
              className="ml-1 -mr-2 sm:ml-4 sm:-mr-6"
            >
              <Image
                src={asset("/intro-1.png")}
                alt="M de Soy Matt"
                width={280}
                height={280}
                className="h-36 w-36 object-contain mix-blend-screen brightness-125 saturate-150 drop-shadow-[0_0_28px_rgba(255,190,120,0.98)] md:h-52 md:w-52"
              />
            </motion.div>
            <span>ATT</span>
          </motion.h1>
          <motion.p
            className="relative z-10 mt-5 max-w-[92vw] px-6 text-center text-[11px] uppercase tracking-[0.22em] text-white/75 sm:mt-6 sm:max-w-xl sm:text-sm sm:tracking-[0.3em] md:text-base md:tracking-[0.35em]"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.1, times: [0, 0.2, 0.62, 0.78], ease: "easeInOut" }}
          >
            Esto no es solo musica, es una historia
          </motion.p>

          <motion.div
            className="pointer-events-none absolute inset-0 z-20 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 2.6, times: [0, 0.58, 0.72, 0.9, 1], ease: "easeInOut" }}
          />
        </motion.section>
      )}

      <section className="relative flex min-h-screen items-center justify-center px-4 py-14 md:px-6 md:py-16">
        <motion.div style={{ y: isMobile || reduceMotion ? 0 : glowY }} className="absolute -top-24 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-neonPink/12 blur-[145px]" />
        <motion.div style={{ y: isMobile || reduceMotion ? 0 : heroY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1600&auto=format&fit=crop"
            alt="SoyMatt en escenario"
            fill
            priority
            className="object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,107,255,0.3),transparent_40%),radial-gradient(circle_at_80%_25%,rgba(255,46,188,0.2),transparent_35%),linear-gradient(180deg,rgba(5,5,7,0.3)_0%,#050507_92%)]" />
        </motion.div>

        {particles.map((p) => (
          <motion.span
            key={p}
            className="absolute hidden h-1.5 w-1.5 rounded-full bg-neonGreen/45 md:block"
            initial={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, opacity: 0.2 }}
            animate={reduceMotion ? { opacity: 0.2 } : { y: [null, `${Math.random() * 100}vh`], opacity: [0.2, 0.9, 0.2] }}
            transition={reduceMotion ? { duration: 0 } : { repeat: Infinity, duration: 5 + Math.random() * 8, ease: "linear" }}
          />
        ))}

        <div className="relative z-20 mx-auto max-w-6xl text-center">
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} className="mb-5 text-xs uppercase tracking-[0.5em] text-[#eec889]/80 md:text-sm">Universo SoyMattMusic</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-5xl font-black leading-none text-[#f2ede4] drop-shadow-[0_0_10px_rgba(238,200,137,0.2)] sm:text-6xl md:text-8xl">
            SoyMatt
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mx-auto mt-5 max-w-xl text-lg text-white/90 sm:text-xl md:mt-6 md:text-2xl">
            Vive lo que escuchas
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#musica" className="rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:scale-105 sm:px-8 sm:text-sm sm:tracking-[0.2em]">Escuchar ahora</a>
            <a href="#videos" className="rounded-full border border-white/50 bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:scale-105 hover:border-neonBlue/80 hover:shadow-cyan sm:px-8 sm:text-sm sm:tracking-[0.2em]">Ver videos</a>
          </motion.div>
          <button onClick={() => setSoundOn((v) => !v)} className="mt-8 rounded-full border border-neonGreen/60 bg-neonGreen/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-neonGreen">
            {soundOn ? "Sonido activo" : "Activar sonido"}
          </button>
        </div>
      </section>

      <section id="musica" className="relative px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Musica en movimiento</h3>
          <p className="mt-3 text-white/70">Stream directo y tracks destacados.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-3 shadow-glow backdrop-blur-xl">
              <LazySpotifyFrame />
            </div>
            <div className="space-y-4">
              {tracks.map((track, idx) => (
                <motion.a
                  key={track.title}
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition hover:border-neonPink/60 hover:shadow-pink"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                    <Image src={track.cover} alt={track.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg font-bold">{track.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">SOY MATT</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neonBlue/50 bg-neonBlue/10 text-neonBlue transition group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M8 6v12l10-6-10-6Z" />
                    </svg>
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Galeria Visual</h3>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((img, idx) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <div className="relative aspect-[3/4]">
                  <Image src={img} alt={`Momento ${idx + 1}`} fill className="object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition group-hover:opacity-95" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {["Cada cancion es un momento", "No es musica, es lo que sientes", "Tu historia tambien suena aqui"].map((line, idx) => (
            <motion.p key={line} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2 }} className="mb-5 font-display text-3xl font-extrabold text-transparent [text-shadow:0_0_24px_rgba(47,107,255,0.42)] bg-gradient-to-r from-neonBlue via-neonPink to-neonGreen bg-clip-text md:text-5xl">
              {line}
            </motion.p>
          ))}
        </div>
      </section>

      <section id="videos" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Visualizers / Reels</h3>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {clips.map((clip, idx) => (
              <motion.div key={clip} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.12 }} className="group relative overflow-visible rounded-2xl border border-white/10 bg-white/5">
                <motion.div
                  className="pointer-events-none absolute -inset-1 rounded-[1.15rem] border border-neonPink/35"
                  animate={{ opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                />
                <video
                  ref={(el) => {
                    reelRefs.current[idx] = el;
                  }}
                  src={clip}
                  autoPlay={!isMobile}
                  muted={reelMuted[idx] ?? true}
                  loop
                  playsInline
                  preload="none"
                  className="h-[360px] w-full rounded-2xl object-cover sm:h-[420px]"
                />
                <button
                  onClick={() => toggleReelSound(idx)}
                  aria-label={reelMuted[idx] ? "Activar sonido" : "Silenciar"}
                  className="absolute bottom-3 left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/65 text-white backdrop-blur transition hover:border-neonGreen hover:text-neonGreen"
                >
                  {reelMuted[idx] ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                    </svg>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <motion.div
          className="about-vibe relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-6 py-7 backdrop-blur-xl md:px-9 md:py-9"
          animate={{ y: [0, -3, 0], scale: [1, 1.008, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute -left-20 top-4 h-32 w-32 rounded-full bg-neonPink/9 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-neonBlue/9 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neonPink/40 to-transparent" />
          <motion.div className="relative z-10" animate={{ opacity: [0.92, 1, 0.92] }} transition={{ duration: 2.8, repeat: Infinity }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-neonGreen/90">Identidad Sonora</p>
            <h3 className="mt-2 font-display text-3xl font-black leading-tight md:text-4xl">Soy Matt</h3>
            <p className="mt-1 text-sm italic text-neonPink/70 md:text-base">"No suena para gustar, suena para quedarse."</p>
            <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
              Soy Matt transforma emociones crudas en paisajes sonoros donde chocan la calle, la fe y la madrugada.
              <span className="font-semibold text-white"> Cada track nace de historias reales: caos, amor, caidas y renacer.</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-6 rounded-3xl border border-white/16 bg-[radial-gradient(circle_at_12%_18%,rgba(238,200,137,0.11),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(141,188,215,0.11),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 backdrop-blur-xl sm:p-6 md:grid-cols-[0.95fr_1.05fr] md:p-8">
          <div className="flex h-full flex-col justify-center">
            <h3 className="bg-gradient-to-r from-[#eec889] via-[#f7f3ea] to-[#8dbcd7] bg-clip-text font-display text-3xl font-extrabold text-transparent sm:text-4xl">Conectemos</h3>
            <p className="mt-4 text-white/80">Video destacado, Spotify, YouTube y mas.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {[
                ["Spotify", "https://open.spotify.com"],
                ["YouTube", "https://youtube.com"],
                ["Instagram", "https://instagram.com"],
                ["TikTok", "https://tiktok.com"]
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" className="flex items-center justify-center gap-2 rounded-full border border-white/28 bg-black/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/90 transition hover:border-white/50 hover:bg-white/5 hover:text-white sm:px-4 sm:text-sm sm:tracking-[0.1em]">
                  {label === "Spotify" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-[#eec889] drop-shadow-[0_0_8px_rgba(238,200,137,0.5)]" aria-hidden="true">
                      <path d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4Zm4.9 14.7a.8.8 0 0 1-1.1.3c-3-1.8-6.8-2.2-11.2-1.2a.8.8 0 0 1-.3-1.6c4.8-1.1 9-0.6 12.3 1.4.4.2.6.7.3 1.1Zm1.5-2.8a1 1 0 0 1-1.3.4c-3.4-2.1-8.6-2.8-12.6-1.5a1 1 0 1 1-.6-1.8c4.5-1.4 10.1-.7 14.2 1.8.5.3.6.9.3 1.3Zm.1-3a1.1 1.1 0 0 1-1.4.4c-3.9-2.3-10.4-2.6-14.1-1.5a1.1 1.1 0 1 1-.7-2.1c4.3-1.3 11.5-1 15.9 1.7.5.3.7 1 .3 1.5Z" />
                    </svg>
                  )}
                  {label === "YouTube" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-[#8dbcd7] drop-shadow-[0_0_8px_rgba(141,188,215,0.5)]" aria-hidden="true">
                      <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-4.8ZM9.6 15.1V8.9l6 3.1-6 3.1Z" />
                    </svg>
                  )}
                  {label === "Instagram" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-[#eec889] drop-shadow-[0_0_8px_rgba(238,200,137,0.5)]" aria-hidden="true">
                      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm9.1 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
                    </svg>
                  )}
                  {label === "TikTok" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-[#8dbcd7] drop-shadow-[0_0_8px_rgba(141,188,215,0.5)]" aria-hidden="true">
                      <path d="M14.8 3c.6 1.8 1.8 3 3.6 3.5v2.8a8.5 8.5 0 0 1-3.6-1.1v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.9a2.5 2.5 0 1 0 1.7 2.4V3h2.8Z" />
                    </svg>
                  )}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-black/30 p-3">
            <video
              ref={featuredRef}
              src={featuredClip}
              autoPlay
              muted={featuredMuted}
              loop
              playsInline
              preload="none"
              className="h-[340px] w-full rounded-xl object-cover sm:h-[420px]"
            />
            <button
              onClick={toggleFeaturedSound}
              aria-label={featuredMuted ? "Activar sonido" : "Silenciar"}
              className="absolute bottom-6 left-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/65 text-white backdrop-blur transition hover:border-neonGreen hover:text-neonGreen"
            >
              {featuredMuted ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-6 text-center md:px-6 md:pb-24 md:pt-8">
        <motion.h4 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="font-display text-4xl font-black sm:text-5xl md:text-7xl">
          Sigue el pulso
        </motion.h4>
        <p className="mx-auto mt-4 max-w-2xl text-white/75">Si llegaste hasta aqui, ya eres parte de esta historia.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="https://instagram.com" target="_blank" className="rounded-full bg-gradient-to-r from-neonPink to-neonViolet px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-glow transition hover:scale-105">
            Sigueme
          </a>
          <a href="https://open.spotify.com" target="_blank" className="rounded-full border border-white/40 px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-neonBlue hover:text-neonBlue">
            Escucha mi musica
          </a>
        </div>
      </section>

      <footer className="px-6 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
          Crafted by{" "}
          <a
            href="https://sebastian0777.github.io/WeWeb/"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white/70 transition hover:text-white"
          >
            WeWeb
          </a>
        </p>
      </footer>
    </main>
  );
}
