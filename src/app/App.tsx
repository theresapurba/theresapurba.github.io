import { useState, useEffect, useRef, type FormEvent } from "react";
import PROJECTS_DATA from "../data/projects.json";
import {
  Github, Mail, Instagram, Linkedin,
  ExternalLink, ArrowLeft, Menu, X,
  ChevronDown, ArrowUpRight, Download,
  ChevronLeft, ChevronRight, Loader2, CheckCircle2,
} from "lucide-react";

const CONTACT_EMAIL = "theresa.a.purba@gmail.com";

type Page = "home" | "about" | "resume" | "project" | "contact";

interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
  certificateUrl?: string;
}

interface Project {
  id: number; title: string; tagline: string; description: string;
  tags: string[]; image: string; images: string[]; video?: string; challenge: string; solution: string;
  outcome: string; github?: string; demo?: string; year: string; role: string;
}

const PROJECTS: Project[] = PROJECTS_DATA as Project[];

const EXPERIENCES: Experience[] = [
  { role: "Guard & Medic", company: "INTERACT — President University", period: "2025", desc: "Provided first aid to participants when needed and assisted in coordinating event activities to help ensure the event ran safely and smoothly." },
  { role: "Secretary", company: "IQnnect Social Project", period: "2025", desc: "Prepared project proposals, organized project timelines, recorded meeting minutes, and managed administrative documentation throughout the project." },
  {
    role: "Junior Web Developer Trainee",
    company: "BPPTIK Komdigi",
    period: "2025",
    desc: "Completed a Junior Web Developer training program covering web development fundamentals, database integration, and collaborative software development practices.",
    certificateUrl: "/uploads/certificates/SERTIFIKAT KOMPETENSI.pdf",
  },
];

// ─── Global Styles ────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes reveal-up {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes reveal-left {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes reveal-right {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes reveal-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .reveal        { opacity: 0; }
  .reveal.in     { animation: reveal-up   0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
  .reveal-l.in   { animation: reveal-left  0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
  .reveal-r.in   { animation: reveal-right 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
  .reveal-f.in   { animation: reveal-fade  0.7s ease forwards; }
  .reveal-l      { opacity: 0; }
  .reveal-r      { opacity: 0; }
  .reveal-f      { opacity: 0; }

  @keyframes swim-right {
    0%   { transform: translateX(-160px) translateY(0px) rotate(0deg); }
    20%  { transform: translateX(20vw) translateY(-22px) rotate(-3deg); }
    40%  { transform: translateX(40vw) translateY(10px) rotate(2deg); }
    60%  { transform: translateX(60vw) translateY(-16px) rotate(-2deg); }
    80%  { transform: translateX(80vw) translateY(8px) rotate(1deg); }
    100% { transform: translateX(calc(100vw + 160px)) translateY(0px) rotate(0deg); }
  }
  @keyframes swim-left {
    0%   { transform: translateX(calc(100vw + 160px)) translateY(0px) scaleX(-1) rotate(0deg); }
    20%  { transform: translateX(80vw) translateY(18px) scaleX(-1) rotate(2deg); }
    40%  { transform: translateX(60vw) translateY(-12px) scaleX(-1) rotate(-1deg); }
    60%  { transform: translateX(40vw) translateY(14px) scaleX(-1) rotate(2deg); }
    80%  { transform: translateX(20vw) translateY(-8px) scaleX(-1) rotate(-1deg); }
    100% { transform: translateX(-160px) translateY(0px) scaleX(-1) rotate(0deg); }
  }
  @keyframes jelly-pulse {
    0%   { transform: translateY(0) scale(1,1) rotate(-1deg); }
    25%  { transform: translateY(-28px) scale(1.06,0.94) rotate(1.5deg); }
    50%  { transform: translateY(-14px) scale(0.97,1.03) rotate(-0.5deg); }
    75%  { transform: translateY(-22px) scale(1.03,0.97) rotate(1deg); }
    100% { transform: translateY(0) scale(1,1) rotate(-1deg); }
  }
  @keyframes tentacle-wave {
    0%,100% { transform: rotate(-14deg); transform-origin: top center; }
    50%      { transform: rotate(14deg); transform-origin: top center; }
  }
  @keyframes seaweed-sway {
    0%,100% { transform: rotate(-10deg) skewX(-3deg); transform-origin: bottom center; }
    50%     { transform: rotate(10deg) skewX(3deg); transform-origin: bottom center; }
  }
  @keyframes bubble-rise {
    0%   { transform: translateY(0) translateX(0); opacity: 0.55; }
    33%  { transform: translateY(-25vh) translateX(8px); opacity: 0.4; }
    66%  { transform: translateY(-55vh) translateX(-6px); opacity: 0.25; }
    100% { transform: translateY(-85vh) translateX(4px); opacity: 0; }
  }
  @keyframes ray-flicker {
    0%,100% { opacity: 0.05; }
    50%     { opacity: 0.13; }
  }
  @keyframes starfish-tumble {
    0%,100% { transform: rotate(0deg) translateY(0); }
    33%     { transform: rotate(12deg) translateY(-5px); }
    66%     { transform: rotate(-8deg) translateY(-2px); }
  }
  @keyframes coral-nod {
    0%,100% { transform: rotate(-6deg); transform-origin: bottom center; }
    50%     { transform: rotate(6deg); transform-origin: bottom center; }
  }
  @keyframes float-idle {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-10px) rotate(2deg); }
  }

  .fish-r    { animation: swim-right linear infinite; }
  .fish-l    { animation: swim-left linear infinite; }
  .jelly     { animation: jelly-pulse ease-in-out infinite; }
  .sway      { animation: seaweed-sway ease-in-out infinite; }
  .bubble    { animation: bubble-rise ease-in infinite; }
  .ray       { animation: ray-flicker ease-in-out infinite; }
  .s-tumble  { animation: starfish-tumble ease-in-out infinite; }
  .coral-nod { animation: coral-nod ease-in-out infinite; }
  .float     { animation: float-idle ease-in-out infinite; }

  /* Pencil texture filter */
  .sketchy { filter: url(#sketch); }
  .sketchy-mild { filter: url(#sketch-mild); }

  /* Hide scrollbar, show on hover */
  * { scrollbar-width: thin; scrollbar-color: rgba(0,119,182,0.3) transparent; }
`;

// ─── Seaweed Picture Frame ────────────────────────────────────────────────────

function SeaweedFrame() {
  return (
    <svg
      viewBox="0 0 300 375"
      width="100%" height="100%"
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      className="sketchy"
    >
      {/* ── Bottom-left seaweed cluster ── */}
      {/* tall main stalk */}
      <path d="M22 375 C18 340 28 310 20 280 C12 250 26 220 18 190 C10 162 22 138 20 110"
        fill="none" stroke="#1b4332" strokeWidth="7" strokeLinecap="round" />
      <path d="M20 290 C4 278 -4 258 4 244 C12 232 22 244 20 264Z" fill="#2d6a4f" opacity="0.9" />
      <path d="M20 240 C36 228 44 208 36 196 C28 184 20 196 20 216Z" fill="#40916c" opacity="0.85" />
      <path d="M19 190 C6 176 2 156 10 146 C18 136 24 150 20 168Z" fill="#2d6a4f" opacity="0.8" />
      <path d="M18 280 Q8 262 10 248" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M20 236 Q34 218 32 202" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      {/* shorter second stalk */}
      <path d="M46 375 C42 352 52 330 44 308 C36 286 48 264 42 242 C36 220 46 202 44 182"
        fill="none" stroke="#2d6a4f" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M44 318 C30 308 24 290 32 278 C40 268 46 280 44 298Z" fill="#40916c" opacity="0.82" />
      <path d="M44 270 C58 258 62 240 54 228 C46 218 40 228 44 248Z" fill="#1b4332" opacity="0.78" />
      {/* tiny third stalk */}
      <path d="M8 375 C6 358 14 342 8 326 C2 310 12 294 8 278"
        fill="none" stroke="#1b4332" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 330 C-4 320 -8 306 -2 296 C4 288 10 298 8 314Z" fill="#2d6a4f" opacity="0.75" />

      {/* ── Bottom-right seaweed cluster ── */}
      {/* tall main stalk */}
      <path d="M278 375 C282 342 272 312 280 282 C288 252 274 222 282 192 C290 164 278 140 280 112"
        fill="none" stroke="#1b4332" strokeWidth="7" strokeLinecap="round" />
      <path d="M280 292 C296 280 304 260 296 246 C288 234 278 246 280 266Z" fill="#2d6a4f" opacity="0.9" />
      <path d="M280 244 C264 232 258 212 266 200 C274 188 282 200 280 220Z" fill="#40916c" opacity="0.85" />
      <path d="M281 192 C294 178 298 158 290 148 C282 138 276 152 280 170Z" fill="#2d6a4f" opacity="0.8" />
      <path d="M282 282 Q292 264 290 250" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      {/* shorter second stalk */}
      <path d="M254 375 C258 354 248 332 256 310 C264 288 252 266 258 244 C264 222 254 204 256 184"
        fill="none" stroke="#2d6a4f" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M256 320 C270 310 276 292 268 280 C260 270 254 282 256 302Z" fill="#40916c" opacity="0.82" />
      <path d="M256 272 C242 260 238 242 246 230 C254 220 260 232 256 252Z" fill="#1b4332" opacity="0.78" />
      {/* tiny third stalk */}
      <path d="M292 375 C294 360 286 344 292 328 C298 312 288 296 292 280"
        fill="none" stroke="#1b4332" strokeWidth="4" strokeLinecap="round" />
      <path d="M292 332 C304 322 308 308 302 298 C296 290 288 300 292 316Z" fill="#2d6a4f" opacity="0.75" />

      {/* ── Single starfish — bottom-left, nestled between the seaweed ── */}
      <g transform="translate(50, 342) rotate(-15) scale(0.72)" className="s-tumble" style={{ animationDuration: "5s" }}>
        <polygon points="50,8 61,38 92,38 68,56 76,86 50,68 24,86 32,56 8,38 39,38"
          fill="#ff6b6b" stroke="#e84040" strokeWidth="2" strokeLinejoin="round" opacity="0.92" />
        <circle cx="50" cy="50" r="10" fill="#ff6b6b" />
        <circle cx="50" cy="50" r="5" fill="white" opacity="0.28" />
        {[0,1,2,3,4].map(i => {
          const a = (i * 72 - 90) * Math.PI / 180;
          return <circle key={i} cx={50 + 28 * Math.cos(a)} cy={50 + 28 * Math.sin(a)} r="2.5" fill="white" opacity="0.2" />;
        })}
      </g>
    </svg>
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.animationDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

// ─── SVG Defs (filters for hand-drawn look) ──────────────────────────────────

function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* Strong sketch distortion */}
        <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.06" numOctaves="4" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" />
        </filter>
        {/* Mild sketch for larger elements */}
        <filter id="sketch-mild" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="12" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.3" />
        </filter>
        {/* Watercolor bleed */}
        <filter id="watercolor" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.04" numOctaves="3" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Hand-drawn Fish ──────────────────────────────────────────────────────────

function DrawnFish({ size = 80, color = "#7ecbdc", stroke = "#3a8fa3", accent = "#ffe066", flipped = false, seed = 1 }: {
  size?: number; color?: string; stroke?: string; accent?: string; flipped?: boolean; seed?: number;
}) {
  // Slightly randomised wobble offsets per fish instance
  const w = seed % 3;
  return (
    <svg
      width={size} height={size * 0.65}
      viewBox="0 0 120 78"
      style={{ transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }}
      className="sketchy"
    >
      {/* Shadow / depth */}
      <ellipse cx="62" cy="62" rx="35" ry="6" fill="rgba(0,50,80,0.18)" />

      {/* Tail fin — wobbly quad */}
      <path
        d={`M${18 + w} 39 C4 ${20 + w} -2 ${10 - w} 2 ${6 + w} C6 ${2 + w} 12 8 ${18 - w} ${22 + w} C${20 + w} ${36 - w} 18 ${42 + w} ${14 + w} ${56 + w} C10 ${68 - w} 4 70 2 ${66 + w} C0 ${62 + w} 6 ${58 - w} ${18 + w} 39Z`}
        fill={accent} stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" opacity="0.9"
      />

      {/* Body */}
      <path
        d={`M${22 - w} 39 C${28 + w} ${12 - w} ${55} ${6 + w} ${80 + w} ${16 - w} C${98 - w} ${22 + w} ${106 + w} ${32 - w} ${104} 39 C${106 + w} ${46 + w} ${98 - w} ${56 + w} ${80 - w} ${62 + w} C${55 + w} ${72 - w} ${28 - w} ${66 + w} ${22 + w} 39Z`}
        fill={color} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round"
      />
      {/* Watercolour inner layer */}
      <path
        d={`M${30} 39 C${36} ${18} ${58} ${14} ${78} ${22} C${92} ${28} ${98} ${36} ${96} 39 C${98} ${42} ${90} ${50} ${76} ${56} C${56} ${64} ${34} ${60} ${30} 39Z`}
        fill="white" opacity="0.22"
      />

      {/* Dorsal fin */}
      <path
        d={`M${46 - w} ${18 + w} C${54} ${4 - w} ${70 + w} ${2 + w} ${84 - w} ${14 + w} C${80 + w} ${22 - w} ${68} ${24 + w} ${52 + w} ${24 - w}Z`}
        fill={accent} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" opacity="0.85"
      />

      {/* Pectoral fin */}
      <path
        d={`M${60 + w} ${44 - w} C${68} ${52 + w} ${72 - w} ${62 + w} ${60 - w} ${60 + w} C${52} ${58 + w} ${50 + w} ${50 - w} ${56 - w} ${44 + w}Z`}
        fill={accent} stroke={stroke} strokeWidth="1.4" opacity="0.75"
      />

      {/* Scales — a few rough arcs */}
      <path d={`M${52} 30 Q${58} 26 ${64} 30`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.35" />
      <path d={`M${40} 34 Q${46} 29 ${52} 33`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.3" />
      <path d={`M${64} 34 Q${70} 29 ${76} 33`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.3" />

      {/* Eye */}
      <circle cx="94" cy="33" r="7" fill="white" stroke={stroke} strokeWidth="1.8" />
      <circle cx="95" cy="33" r="4.5" fill="#1a2e3b" />
      <circle cx="96" cy="31" r="1.8" fill="white" opacity="0.85" />
      <circle cx="94" cy="35" r="0.9" fill="white" opacity="0.5" />

      {/* Mouth — tiny curved line */}
      <path d="M105 40 Q108 43 106 45" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// ─── Tropical / Clownfish ─────────────────────────────────────────────────────

function DrawnClownfish({ size = 70, flipped = false }: { size?: number; flipped?: boolean }) {
  return (
    <svg
      width={size} height={size * 0.75}
      viewBox="0 0 110 82"
      style={{ transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }}
      className="sketchy"
    >
      {/* Tail */}
      <path d="M14 41 C2 22 -4 10 2 5 C8 1 16 10 18 24 C20 36 18 44 14 57 C10 68 2 74 4 68 C8 62 14 52 14 41Z"
        fill="#ff6b1a" stroke="#c94a00" strokeWidth="2" />

      {/* Body */}
      <path d="M18 41 C24 15 52 8 76 18 C94 25 102 36 100 41 C102 48 94 59 76 64 C52 74 24 67 18 41Z"
        fill="#ff6b1a" stroke="#c94a00" strokeWidth="2.2" />

      {/* White stripes */}
      <path d="M34 13 C38 10 44 10 46 14 C48 24 48 58 46 68 C44 72 38 72 34 69 C32 58 32 22 34 13Z"
        fill="white" stroke="#e0e0e0" strokeWidth="1.4" opacity="0.9" />
      <path d="M62 12 C66 10 72 10 74 14 C76 24 76 58 74 68 C72 72 66 72 62 69 C60 58 60 22 62 12Z"
        fill="white" stroke="#e0e0e0" strokeWidth="1.4" opacity="0.9" />

      {/* Dorsal fin */}
      <path d="M38 14 C46 2 62 0 74 12 C68 20 54 22 40 20Z" fill="#ff6b1a" stroke="#c94a00" strokeWidth="1.6" />

      {/* Eye */}
      <circle cx="90" cy="34" r="7" fill="white" stroke="#c94a00" strokeWidth="1.8" />
      <circle cx="91" cy="34" r="4.5" fill="#1a0a00" />
      <circle cx="92" cy="32" r="1.8" fill="white" opacity="0.9" />

      {/* Gills */}
      <path d="M78 26 Q82 34 80 44" fill="none" stroke="#c94a00" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ─── Hand-drawn Jellyfish ─────────────────────────────────────────────────────

function DrawnJellyfish({ size = 90, color = "#c77dff", glowColor = "#e0aaff", className = "" }: {
  size?: number; color?: string; glowColor?: string; className?: string;
}) {
  const tentacleCount = 7;
  return (
    <svg
      width={size} height={size * 1.8}
      viewBox="0 0 100 180"
      className={`${className} sketchy`}
      style={{ overflow: "visible" }}
    >
      {/* Glow halo */}
      <ellipse cx="50" cy="48" rx="52" ry="52" fill={glowColor} opacity="0.12" />

      {/* Bell — outer (rough) */}
      <path
        d="M6 52 C4 28 12 8 50 5 C88 2 96 26 94 52 C92 68 82 74 66 78 C58 80 42 80 34 78 C18 74 8 68 6 52Z"
        fill={color} stroke={color} strokeWidth="2" opacity="0.82"
      />
      {/* Bell — inner watercolour layer */}
      <path
        d="M16 50 C14 32 22 16 50 14 C78 12 86 30 84 50 C82 62 72 68 58 70 C50 72 42 72 36 70 C22 68 18 62 16 50Z"
        fill={glowColor} opacity="0.55"
      />
      {/* Highlight dome */}
      <path
        d="M26 38 C28 24 36 14 50 12 C64 10 74 20 76 34 C68 30 56 26 50 26 C42 26 30 30 26 38Z"
        fill="white" opacity="0.28"
      />

      {/* Mouth frill */}
      <path d="M30 76 Q38 82 50 78 Q62 82 70 76" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* Spots */}
      <circle cx="36" cy="36" r="4.5" fill="white" opacity="0.3" />
      <circle cx="56" cy="28" r="3" fill="white" opacity="0.25" />
      <circle cx="66" cy="44" r="3.5" fill="white" opacity="0.22" />
      <circle cx="44" cy="52" r="2.5" fill="white" opacity="0.2" />

      {/* Tentacles — irregular wavy lines */}
      {Array.from({ length: tentacleCount }).map((_, i) => {
        const x = 20 + i * 10;
        const amp = 5 + (i % 3) * 3;
        const len = 80 + (i % 4) * 18;
        const mid = 78 + len / 2;
        return (
          <path
            key={i}
            d={`M${x} 78 C${x + amp} ${100 + i * 2} ${x - amp} ${110 + i} ${x + amp * 0.6} ${128 + i * 3} C${x - amp * 0.4} ${145 + i * 2} ${x + amp * 0.8} ${155 + i} ${x} ${78 + len}`}
            fill="none" stroke={color} strokeWidth={1.8 - i * 0.08} strokeLinecap="round" opacity={0.55 - i * 0.02}
            style={{ animation: `seaweed-sway ${2.2 + i * 0.28}s ease-in-out ${(i * 0.18).toFixed(2)}s infinite`, transformOrigin: `${x}px 78px` }}
          />
        );
      })}
    </svg>
  );
}

// ─── Hand-drawn Starfish ──────────────────────────────────────────────────────

function DrawnStarfish({ size = 60, color = "#ff6b6b", className = "" }: {
  size?: number; color?: string; className?: string;
}) {
  // Hand-drawn star with irregular points
  const pts = Array.from({ length: 5 }, (_, i) => {
    const oa = (i * 72 - 90) * (Math.PI / 180);
    const ia = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const jitter = (i % 2 === 0 ? 2 : -2);
    const ox = 50 + (42 + jitter) * Math.cos(oa);
    const oy = 50 + (42 + jitter) * Math.sin(oa);
    const ix = 50 + 17 * Math.cos(ia);
    const iy = 50 + 17 * Math.sin(ia);
    return `${ox.toFixed(1)},${oy.toFixed(1)} ${ix.toFixed(1)},${iy.toFixed(1)}`;
  }).join(" ");

  const lighter = color.replace("#ff", "#ff").replace("6b", "9a");

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${className} sketchy`} style={{ overflow: "visible" }}>
      {/* Shadow */}
      <ellipse cx="52" cy="96" rx="28" ry="5" fill="rgba(0,40,80,0.15)" />
      {/* Main body */}
      <polygon points={pts} fill={color} stroke={color} strokeWidth="2.5" strokeLinejoin="round" opacity="0.9" />
      {/* Inner lighter */}
      <polygon points={pts} fill={lighter} stroke="none" opacity="0.35" transform="scale(0.55) translate(45,45)" />
      {/* Texture dots */}
      {[
        [50, 30], [36, 58], [64, 58], [28, 40], [72, 40],
        [50, 50], [42, 44], [58, 44],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.8} fill="white" opacity={0.25 + (i % 3) * 0.08} />
      ))}
      {/* Centre disc */}
      <circle cx="50" cy="50" r="10" fill={color} stroke="white" strokeWidth="1.5" opacity="0.9" />
      <circle cx="50" cy="50" r="5" fill="white" opacity="0.3" />
    </svg>
  );
}

// ─── Hand-drawn Seaweed ───────────────────────────────────────────────────────

function DrawnSeaweed({ height = 120, color = "#2d6a4f", delay = "0s", seed = 0 }: {
  height?: number; color?: string; delay?: string; seed?: number;
}) {
  const w = seed % 4;
  return (
    <svg
      width={height * 0.38} height={height}
      viewBox="0 0 40 120"
      className="sway sketchy"
      style={{ animationDelay: delay, animationDuration: `${2.8 + (seed % 3) * 0.6}s`, overflow: "visible" }}
    >
      {/* Main stem — wobbly */}
      <path
        d={`M${20 + w} 120 C${14 - w} 98 ${26 + w} 84 ${18 - w} 68 C${10 + w} 52 ${28 - w} 38 ${20 + w} 22 C${14 - w} 8 ${22 + w} 2 ${20} 0`}
        fill="none" stroke={color} strokeWidth={5 + (seed % 2)} strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d={`M${18 - w} 85 C${4 + w} 78 2 62 ${8 - w} 56 C${14 + w} 50 ${20 - w} 60 ${18 + w} 72Z`}
        fill={color} opacity="0.85"
      />
      {/* Right leaf */}
      <path
        d={`M${20 + w} 52 C${34 - w} 44 ${38 + w} 30 ${32 - w} 22 C${26 + w} 14 ${20 - w} 26 ${20 + w} 38Z`}
        fill={color} opacity="0.78"
      />
      {/* Top leaf */}
      <path
        d={`M${19 + w} 22 C${8 - w} 12 ${6 + w} 2 ${12 - w} -2 C${18 + w} -6 ${22 - w} 6 ${20 + w} 16Z`}
        fill={color} opacity="0.7"
      />
      {/* Leaf vein highlights */}
      <path d={`M${18} 80 Q${10} 68 ${12} 58`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M${20} 48 Q${30} 36 ${28} 26`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Hand-drawn Coral ─────────────────────────────────────────────────────────

function DrawnCoral({ color = "#e63946", size = 80 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" className="coral-nod sketchy" style={{ overflow: "visible" }}>
      {/* Base */}
      <ellipse cx="40" cy="102" rx="22" ry="5" fill="rgba(0,40,80,0.2)" />
      {/* Stem */}
      <path d="M38 102 C36 84 40 72 38 58 C36 44 40 32 38 20 C36 8 40 2 40 0" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      {/* Left branch */}
      <path d="M38 68 C26 58 18 44 22 34 C26 24 34 28 38 40" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Right branch */}
      <path d="M38 46 C50 36 58 22 54 12 C50 4 42 8 40 20" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Small left branch */}
      <path d="M28 52 C18 46 14 36 18 30" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* Tips */}
      <circle cx="40" cy="0" r="6" fill={color} />
      <circle cx="22" cy="33" r="5.5" fill={color} />
      <circle cx="54" cy="11" r="5" fill={color} />
      <circle cx="17" cy="29" r="4" fill={color} />
      {/* Highlight */}
      <circle cx="40" cy="0" r="3" fill="white" opacity="0.3" />
      <circle cx="22" cy="33" r="2.5" fill="white" opacity="0.28" />
    </svg>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

function Bubble({ size = 10, style, className }: { size?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className} style={style}>
      <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      <ellipse cx="7" cy="7" rx="2.5" ry="1.5" fill="white" opacity="0.4" />
    </svg>
  );
}

// ─── Full Ocean Scene ─────────────────────────────────────────────────────────

function OceanScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Light rays — 3, soft */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="ray absolute top-0"
          style={{
            left: `${15 + i * 32}%`, width: "80px", height: "100%",
            background: "linear-gradient(to bottom, rgba(144,224,239,0.14) 0%, transparent 60%)",
            transform: `rotate(${-5 + i * 5}deg)`, transformOrigin: "top center",
            animationDuration: `${5 + i}s`, animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      {/* 1 jellyfish — top-left corner */}
      <div className="jelly absolute" style={{ left: "7%", top: "6%", animationDuration: "6.5s" }}>
        <DrawnJellyfish size={78} color="#c77dff" glowColor="#e0aaff" />
      </div>

      {/* 2 fish — one each direction, different depths */}
      <div className="fish-r absolute" style={{ top: "30%", animationDuration: "22s" }}>
        <DrawnFish size={74} color="#7ecbdc" stroke="#3a8fa3" accent="#ffe066" seed={1} />
      </div>
      <div className="fish-l absolute" style={{ top: "60%", animationDuration: "27s", animationDelay: "10s" }}>
        <DrawnFish size={52} color="#caf0f8" stroke="#64b8d4" accent="#ffd6a5" flipped seed={5} />
      </div>

      {/* 3 bubbles */}
      <Bubble size={8}  className="bubble absolute" style={{ left: "10%", bottom: "8%",  animationDuration: "10s" }} />
      <Bubble size={5}  className="bubble absolute" style={{ left: "52%", bottom: "5%",  animationDuration: "13s", animationDelay: "2s" }} />
      <Bubble size={10} className="bubble absolute" style={{ left: "83%", bottom: "7%",  animationDuration: "9s",  animationDelay: "4s" }} />

      {/* Seaweed — 3 left, 2 right */}
      <div className="absolute bottom-0 left-0 flex items-end gap-4 pl-6">
        {[
          { h: 145, c: "#1b4332", d: "0s",   s: 0 },
          { h: 100, c: "#2d6a4f", d: "0.5s", s: 1 },
          { h: 168, c: "#1b4332", d: "1.0s", s: 2 },
        ].map((s, i) => <DrawnSeaweed key={i} height={s.h} color={s.c} delay={s.d} seed={s.s} />)}
      </div>
      <div className="absolute bottom-0 right-0 flex items-end gap-4 pr-10">
        {[
          { h: 130, c: "#2d6a4f", d: "0.3s", s: 6 },
          { h: 155, c: "#1b4332", d: "0.8s", s: 7 },
        ].map((s, i) => <DrawnSeaweed key={i} height={s.h} color={s.c} delay={s.d} seed={s.s} />)}
      </div>

      {/* 1 starfish — bottom, off-centre */}
      <div className="s-tumble absolute" style={{ bottom: "90px", left: "30%", animationDuration: "5s" }}>
        <DrawnStarfish size={44} color="#ff6b6b" />
      </div>

      {/* Sandy shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: "linear-gradient(to top, rgba(210,180,140,0.18) 0%, transparent 100%)" }} />
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Resume", page: "resume" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-gradient-to-r from-[#03045e]/92 via-[#0077b6]/88 to-[#00b4d8]/80 backdrop-blur-md shadow-xl shadow-[#03045e]/30" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate("home")}
          className="font-[Fraunces] text-xl font-semibold text-white tracking-tight hover:text-[#90e0ef] transition-colors drop-shadow">
          Theresa<span className="text-[#7df9ff]">.</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button key={l.page} onClick={() => onNavigate(l.page)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentPage === l.page
                  ? "bg-white/25 text-white border border-white/40 shadow-inner"
                  : "text-white/70 hover:text-white hover:bg-white/12"
              }`}>
              {l.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate("contact")}
            className={`ml-3 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
              currentPage === "contact" ? "opacity-80" : ""
            }`}
            style={{ background: "linear-gradient(135deg, #90e0ef 0%, #00b4d8 50%, #0096c7 100%)", color: "#03045e" }}>
            Contact
          </button>
        </div>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col gap-2"
          style={{ background: "linear-gradient(to bottom, rgba(3,4,94,0.95), rgba(0,119,182,0.92))" }}>
          {links.map((l) => (
            <button key={l.page} onClick={() => { onNavigate(l.page); setMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                currentPage === l.page ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Multi-layer gradient — deep ocean to surface */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0,180,216,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 15%, rgba(144,224,239,0.14) 0%, transparent 55%),
          radial-gradient(ellipse 50% 60% at 50% 80%, rgba(0,60,120,0.25) 0%, transparent 70%),
          linear-gradient(180deg, #010a2e 0%, #03045e 18%, #023e8a 36%, #0077b6 55%, #0096c7 70%, #00b4d8 82%, #48cae4 94%, #90e0ef 100%)
        `
      }} />

      <OceanScene />

      {/* Hero text */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#90e0ef] text-xs font-semibold tracking-[0.28em] uppercase mb-5 drop-shadow">
          Software Engineer &amp; Designer
        </p>
        <h1 className="font-[Fraunces] text-6xl md:text-8xl font-semibold text-white leading-[1.05] mb-6"
          style={{ textShadow: "0 2px 48px rgba(3,4,94,0.7), 0 0 80px rgba(0,180,216,0.3)" }}>
          Hello, I&apos;m
          <br />
          <span style={{
            background: "linear-gradient(135deg, #90e0ef 0%, #48cae4 40%, #caf0f8 80%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 12px rgba(144,224,239,0.5))"
          }}>Theresa</span>{" "}
          <span className="italic text-white">Purba</span>
        </h1>
        <p className="text-white/65 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
          style={{ textShadow: "0 1px 20px rgba(3,4,94,0.6)" }}>
         Building digital solutions through data, design, and web development.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onScrollDown}
            className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-2xl text-[#03045e] shadow-lg"
            style={{ background: "linear-gradient(135deg, #caf0f8 0%, #90e0ef 50%, #48cae4 100%)" }}>
            View My Work
          </button>
        </div>
      </div>

      <button onClick={onScrollDown}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white/80 transition-colors flex flex-col items-center gap-1">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="group text-left w-full rounded-2xl overflow-hidden border border-white/60 hover:border-[#00b4d8]/60 hover:shadow-2xl hover:shadow-[#0077b6]/18 transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: "linear-gradient(145deg, #ffffff 0%, #f0faff 60%, #e1f4fc 100%)" }}>
      <div className="relative overflow-hidden bg-[#e1f3fc] h-52">
        <img src={project.image} alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03045e]/65 via-[#0077b6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(202,240,248,0.9))", color: "#0077b6" }}>
          {project.year}
        </div>
        <ArrowUpRight size={20} className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ background: "linear-gradient(90deg, #00b4d8, #0077b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {project.role}
        </p>
        <h3 className="font-[Fraunces] text-xl font-semibold text-[#03045e] mb-2 group-hover:text-[#0077b6] transition-colors">
          {project.title}
        </h3>
        <p className="text-[#4a6d8a] text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "linear-gradient(135deg, #e1f3fc, #caf0f8)", color: "#0077b6" }}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-[#e1f3fc] text-[#4a6d8a] text-xs">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectsSection({ onProjectClick }: { onProjectClick: (p: Project) => void }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #90e0ef 0%, #caf0f8 25%, #e8f7fd 55%, #f0faff 100%)" }}>

      {/* Decorative sketchy creatures */}
      <div className="absolute top-10 right-14 opacity-18 float" style={{ animationDuration: "5s" }}>
        <DrawnFish size={58} color="#0077b6" stroke="#023e8a" accent="#00b4d8" />
      </div>
      <div className="absolute top-36 left-6 opacity-15 float" style={{ animationDuration: "6s", animationDelay: "2s" }}>
        <DrawnStarfish size={42} color="#ff6b6b" />
      </div>
      <div className="absolute bottom-24 right-10 opacity-18 float" style={{ animationDuration: "4.5s", animationDelay: "1s" }}>
        <DrawnStarfish size={32} color="#ffd166" />
      </div>
      <div className="absolute bottom-12 left-1/4 opacity-12">
        <DrawnJellyfish size={55} color="#c77dff" glowColor="#e0aaff" />
      </div>

      {/* Wave divider top */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-30">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 30 Q180 0 360 30 T720 30 T1080 30 T1440 30 V0 H0Z" fill="#48cae4" opacity="0.5" />
          <path d="M0 40 Q200 10 400 40 T800 40 T1200 40 T1440 40 V0 H0Z" fill="#90e0ef" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ background: "linear-gradient(90deg, #0077b6, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Selected Work
            </p>
            <h2 className="font-[Fraunces] text-5xl md:text-6xl font-semibold leading-tight"
              style={{ background: "linear-gradient(135deg, #03045e 0%, #0077b6 60%, #00b4d8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Projects
            </h2>
          </div>
          <p className="text-[#3a6a85] max-w-sm leading-relaxed text-[15px]">
            A handful of things I&apos;ve shipped — click any card to read the full story.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => onProjectClick(p)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Section ───────────────────────────────────────────────────────────

function SocialSection() {
  const socials = [
    { name: "GitHub",    icon: Github,    href: "https://github.com/theresapurba",            label: "@theresapurba-dev",       iconColor: "#24292e", bg: "linear-gradient(135deg,#f6f8fa,#e1e8f0)" },
    { name: "LinkedIn",  icon: Linkedin,  href: "http://www.linkedin.com/in/theresapurba190107",          label: "Theresa A Purba",       iconColor: "#0077b5", bg: "linear-gradient(135deg,#e8f4fd,#cce4f6)" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/theresa.a.p?igsh=MW81azNrMzhoOXk3cQ==",         label: "@theresa.a.p",     iconColor: "#e1306c", bg: "linear-gradient(135deg,#fdf0f4,#fce4ee)" },
    { name: "Gmail",     icon: Mail,      href: "mailto:theresa.a.purba@gmail.com",       label: "theresa.a.purba@gmail.com",iconColor: "#ea4335", bg: "linear-gradient(135deg,#fdf1f0,#fce3e1)" },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #010a2e 0%, #03045e 20%, #023e8a 45%, #0077b6 70%, #0096c7 88%, #00b4d8 100%)" }}>

      {/* Radial glow overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-12 blur-3xl" style={{ background: "#48cae4" }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#c77dff" }} />
      </div>

      {/* Ocean life — kept minimal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1 jellyfish, top-left */}
        <div className="jelly absolute top-6 left-14" style={{ animationDuration: "6s" }}>
          <DrawnJellyfish size={55} color="#c77dff" glowColor="#e0aaff" />
        </div>
        {/* 1 fish crossing */}
        <div className="fish-r absolute" style={{ top: "42%", animationDuration: "26s", animationDelay: "5s" }}>
          <DrawnFish size={55} color="#90e0ef" stroke="#48cae4" accent="#ffe066" seed={1} />
        </div>
        {/* Seaweed — 3 left, 2 right */}
        <div className="absolute bottom-0 left-0 flex items-end gap-3 pl-6">
          {[
            { h: 85,  c: "#1b4332", d: "0s",   s: 10 },
            { h: 55,  c: "#2d6a4f", d: "0.4s", s: 11 },
            { h: 100, c: "#1b4332", d: "0.8s", s: 12 },
          ].map((s, i) => <DrawnSeaweed key={i} height={s.h} color={s.c} delay={s.d} seed={s.s} />)}
        </div>
        <div className="absolute bottom-0 right-0 flex items-end gap-3 pr-10">
          {[
            { h: 90, c: "#2d6a4f", d: "0.3s", s: 13 },
            { h: 65, c: "#1b4332", d: "0.7s", s: 14 },
          ].map((s, i) => <DrawnSeaweed key={i} height={s.h} color={s.c} delay={s.d} seed={s.s} />)}
        </div>
        {/* 2 bubbles */}
        <Bubble size={7}  className="bubble absolute" style={{ left: "20%", bottom: "6%", animationDuration: "10s" }} />
        <Bubble size={9}  className="bubble absolute" style={{ left: "78%", bottom: "4%", animationDuration: "12s", animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ background: "linear-gradient(90deg,#90e0ef,#caf0f8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Let&apos;s Connect
        </p>
        <h2 className="font-[Fraunces] text-5xl md:text-6xl font-semibold text-white mb-5 leading-tight"
          style={{ textShadow: "0 2px 30px rgba(0,180,216,0.4)" }}>
          Find me online
        </h2>
        <p className="text-white/50 text-lg mb-14 max-w-md mx-auto leading-relaxed">
          I&apos;m always open to new projects, collaborations, or just a good conversation.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/12 hover:border-white/35 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#0077b6]/40"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md"
                  style={{ background: s.bg }}>
                  <Icon size={26} style={{ color: s.iconColor }} />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">{s.name}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate max-w-[100px]">{s.label}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 text-center border-t border-white/6"
      style={{ background: "linear-gradient(90deg, #010a2e, #03045e, #010a2e)" }}>
      <p className="text-white/22 text-sm">© 2026 Theresa Purba — Built with React &amp; Tailwind</p>
    </footer>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────

function AboutPage() {
  const headingRef  = useReveal<HTMLDivElement>();
  const photoRef    = useReveal<HTMLDivElement>(100);
  const factsRef    = useReveal<HTMLDivElement>(200);
  const bioRef      = useReveal<HTMLDivElement>(150);


  return (
    /* Gradient stays in readable-blue territory throughout — no near-white at bottom */
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #061a3a 0%, #0a3060 18%, #0d5490 38%, #1472a8 58%, #1a8abe 75%, #1e95c8 90%, #2298cc 100%)"
    }}>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">

        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3 text-[#7dd8f0]">
            About Me
          </p>
          <h1 className="font-[Fraunces] text-6xl md:text-7xl font-semibold leading-tight text-white"
            style={{ textShadow: "0 2px 28px rgba(3,4,94,0.5)" }}>
            A little<br />
            <span className="italic" style={{ color: "#90e0ef" }}>about me</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-5 gap-14 items-start">

          {/* Left column — photo + quick facts */}
          <div className="md:col-span-2 space-y-6">
            {/* Photo with seaweed frame — overflow-visible so frame elements spill outside */}
            <div ref={photoRef} className="reveal-l relative aspect-[4/5]" style={{ overflow: "visible" }}>
              {/* The actual photo sits clipped inside a rounded box */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "2px solid rgba(255,255,255,0.22)", boxShadow: "0 20px 60px rgba(3,4,94,0.45)" }}>
                <img src="/uploads/WhatsApp Image 2026-07-11 at 11.38.10.png"
                  alt="Theresa Purba" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,26,58,0.55), transparent 60%)" }} />
              </div>
              {/* Seaweed frame overlays and overflows the photo edges */}
              <SeaweedFrame />
            </div>
            <div ref={factsRef} className="reveal space-y-1">
              {[
                ["Based in",       "Cikarang Utara, Indonesia"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-white/15">
                  <span className="text-[#90d8f0] text-sm">{label}</span>
                  <span className="text-white text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — bio + skills */}
          <div className="md:col-span-3 space-y-10">
            <div ref={bioRef} className="reveal-r space-y-4">
              <p className="text-[18px] text-white font-medium leading-relaxed">
                I&apos;m Theresa Purba — I enjoy exploring how data and technology can be used to help solve various problems. This interest has led me to study data analytics, dashboard development, and web development through various academic and personal projects.
              </p>
              <p className="text-[#b8e8f8] leading-relaxed">
                For me, every project is an opportunity to continue learning, improve my skills, and create solutions that are simple, functional, and easy for users to understand. Every experience is part of the process of growing, both technically and in terms of how I approach problem-solving.
              </p>
              <p className="text-[#b8e8f8] leading-relaxed">
                That’s why I enjoy learning new technologies, refining the details of a project, and finding ways to make the solutions I develop simpler, more effective, and more user-friendly.
              </p>
            </div>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Resume Page ──────────────────────────────────────────────────────────────

function ResumePage() {
  const headingRef   = useReveal<HTMLDivElement>();
  const expRef       = useReveal<HTMLElement>(80);
  const eduRef       = useReveal<HTMLElement>(100);

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #061828 0%, #092c50 16%, #0d4a7a 34%, #126096 52%, #167aaa 68%, #1882b4 82%, #1a86b8 100%)"
    }}>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Heading */}
        <div ref={headingRef} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#7dd8f0" }}>Resume</p>
            <h1 className="font-[Fraunces] text-6xl font-semibold text-white leading-tight"
              style={{ textShadow: "0 2px 28px rgba(3,4,94,0.5)" }}>
              Experience &amp;<br />
              <span className="italic" style={{ color: "#90e0ef" }}>Education</span>
            </h1>
          </div>
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 self-start shadow-xl text-[#061828]"
            style={{ background: "rgba(255,255,255,0.95)" }}>
            <Download size={16} />Download PDF
          </a>
        </div>

        {/* Experience */}
        <section ref={expRef} className="reveal mb-16">
          <h2 className="font-[Fraunces] text-3xl font-semibold text-white mb-8">Experience</h2>
          <div className="space-y-5">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="relative flex gap-5">
                {/* Timeline */}
                <div className="flex flex-col items-center pt-5">
                  <div className="w-3 h-3 rounded-full shrink-0 bg-white"
                    style={{ boxShadow: "0 0 10px rgba(255,255,255,0.8)" }} />
                  {i < EXPERIENCES.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: "rgba(255,255,255,0.18)" }} />
                  )}
                </div>
                {/* Card */}
                <div className="flex-1 rounded-2xl p-5 mb-2"
                  style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.16)" }}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-[17px]">{exp.role}</h3>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "#7dd8f0" }}>{exp.company}</p>
                    </div>
                    <span className="text-[#b8e8f8] text-xs px-3 py-1 rounded-full shrink-0 font-medium"
                      style={{ background: "rgba(255,255,255,0.12)" }}>
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[#c5ecf8] text-sm leading-relaxed">{exp.desc}</p>
                  {exp.certificateUrl && (
                    <a
                      href={exp.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View certificate for ${exp.role} at ${exp.company}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#7dd8f0] hover:text-white transition-colors group cursor-pointer"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section ref={eduRef} className="reveal mb-16">
          <h2 className="font-[Fraunces] text-3xl font-semibold text-white mb-8">Education</h2>
          <div className="rounded-2xl p-7"
            style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.16)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-[17px]">Bachelor of Information Systems</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: "#7dd8f0" }}>President University</p>
                <p className="text-[#c5ecf8] text-sm mt-2 leading-relaxed max-w-md">
                  Currently pursuing a Bachelor's degree in Information Systems with a concentration in Data Science, focusing on software development, data analysis, and information systems.
                </p>
              </div>
              <span className="text-[#b8e8f8] text-xs px-3 py-1 rounded-full shrink-0 font-medium"
                style={{ background: "rgba(255,255,255,0.12)" }}>
                2024 – Present
              </span>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

// ─── Project Detail ───────────────────────────────────────────────────────────

function ProjectDetailPage({ project, onBack }: { project: Project; onBack: () => void }) {
  const tagsRef    = useReveal<HTMLDivElement>();
  const taglineRef = useReveal<HTMLDivElement>(80);
  const cardsRef   = useReveal<HTMLDivElement>(120);
  const overviewRef= useReveal<HTMLDivElement>(160);
  const videoRef   = useReveal<HTMLDivElement>(200);

  const imagesScrollRef = useRef<HTMLDivElement>(null);

  const scrollImages = (direction: "left" | "right") => {
    if (imagesScrollRef.current) {
      const scrollAmount = imagesScrollRef.current.clientWidth * 0.75;
      imagesScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };
  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #061828 0%, #092c50 16%, #0d4a7a 34%, #126096 52%, #157aaa 68%, #1680b0 84%, #1882b2 100%)"
    }}>
      {/* Hero image banner — blends into the page gradient below it */}
      <div className="relative h-[52vh] overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        {/* Overlay fades image into the page gradient colour at the bottom */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(8,34,79,0.45) 0%, rgba(8,34,79,0.55) 55%, #08224f 100%)" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="fish-r absolute opacity-35" style={{ top:"30%", animationDuration:"24s" }}>
            <DrawnFish size={52} color="#90e0ef" stroke="#48cae4" accent="#ffe066" />
          </div>
          {[{sz:7,l:"14%",b:"9%",dur:"9s"},{sz:5,l:"72%",b:"6%",dur:"11s"}].map((b,i)=>(
            <Bubble key={i} size={b.sz} className="bubble absolute opacity-45" style={{left:b.l,bottom:b.b,animationDuration:b.dur}} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 py-10 max-w-5xl mx-auto">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/65 hover:text-white transition-colors text-sm mb-5">
            <ArrowLeft size={16} />Back to projects
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#7dd8f0" }}>
            {project.role} · {project.year}
          </p>
          <h1 className="font-[Fraunces] text-4xl md:text-6xl font-semibold text-white leading-tight"
            style={{ textShadow:"0 2px 30px rgba(3,4,94,0.6)" }}>
            {project.title}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Tags & links */}
        <div ref={tagsRef} className="reveal flex flex-wrap items-center justify-between gap-4 mb-12 pb-8 border-b border-white/15">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                style={{ background:"rgba(255,255,255,0.15)" }}>
                {tag}
              </span>
            ))}
          </div>
          {(project.github || project.demo) && (
            <div className="flex gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:bg-white/20"
                  style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)" }}>
                  <Github size={15} />GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#03045e] transition-all hover:scale-105 shadow-md"
                  style={{ background:"rgba(255,255,255,0.9)" }}>
                  <ExternalLink size={15} />Demo
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tagline */}
        <div ref={taglineRef} className="reveal mb-12">
          <p className="font-[Fraunces] italic text-2xl text-white leading-relaxed max-w-2xl">
            &ldquo;{project.tagline}&rdquo;
          </p>
        </div>

        {/* Challenge / Solution / Outcome */}
        <div ref={cardsRef} className="reveal grid md:grid-cols-3 gap-5 mb-12">
          {[
            { label:"The Challenge", text:project.challenge },
            { label:"The Solution",  text:project.solution },
            { label:"The Outcome",   text:project.outcome },
          ].map((block) => (
            <div key={block.label} className="rounded-2xl p-6"
              style={{ background:"rgba(255,255,255,0.11)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.20)" }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#7dd8f0" }}>{block.label}</p>
              <p className="text-white text-sm leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>

        {/* Overview */}
        <div ref={overviewRef} className="reveal rounded-2xl p-8 mb-10"
          style={{ background:"rgba(255,255,255,0.10)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.20)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[Fraunces] text-2xl font-semibold text-white">Project Overview</h2>
            {/* Slide Navigation Buttons */}
            {project.images && project.images.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scrollImages("left")}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollImages("right")}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="text-white leading-relaxed mb-6">{project.description}</p>
          
          {/* Project Images (Horizontal Scrollable) */}
          {project.images && project.images.length > 0 && (
            <div
              ref={imagesScrollRef}
              className="w-full overflow-x-auto flex gap-4 pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent scroll-smooth"
            >
              {project.images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="h-64 md:h-80 w-auto object-cover rounded-xl shadow-lg flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        {/* Video Documentation */}
        {project.video && (
          <div ref={videoRef} className="reveal rounded-2xl p-8 mb-10"
            style={{ background:"rgba(255,255,255,0.10)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.20)" }}>
            <h2 className="font-[Fraunces] text-2xl font-semibold text-white mb-4">Video Documentation</h2>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
              <video
                src={project.video}
                controls
                playsInline
                className="w-full h-full object-contain"
                poster={project.image}
              />
            </div>
          </div>
        )}

        <button onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:bg-white/20"
          style={{ background:"rgba(255,255,255,0.14)", border:"1px solid rgba(255,255,255,0.28)" }}>
          <ArrowLeft size={15} />Back to all projects
        </button>
      </div>
      <Footer />
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

function ContactPage() {
  const headingRef = useReveal<HTMLDivElement>();
  const cardsRef   = useReveal<HTMLDivElement>(120);
  const formRef    = useReveal<HTMLDivElement>(200);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          _subject: `Portfolio message from ${form.name.trim()}`,
          _replyto: form.email.trim(),
          _template: "table",
        }),
      });

      const data = await response.json();
      if (!response.ok || data.success !== "true") {
        throw new Error(data.message ?? "Failed to send message");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Could not send your message. Please try again or email directly.");
    }
  };

  const socials = [
    { name: "GitHub",    icon: Github,    href: "https://github.com/theresapurba",       label: "@theresapurba-dev",        iconColor: "#24292e", bg: "linear-gradient(135deg,#f6f8fa,#e1e8f0)" },
    { name: "LinkedIn",  icon: Linkedin,  href: "http://www.linkedin.com/in/theresapurba190107",     label: "Theresa A Purba",        iconColor: "#0077b5", bg: "linear-gradient(135deg,#e8f4fd,#cce4f6)" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/theresa.a.p?igsh=MW81azNrMzhoOXk3cQ==",    label: "@theresa.a.p",      iconColor: "#e1306c", bg: "linear-gradient(135deg,#fdf0f4,#fce4ee)" },
    { name: "Gmail",     icon: Mail,      href: "mailto:theresa.a.purba@gmail.com",  label: "theresa.a.purba@gmail.com", iconColor: "#ea4335", bg: "linear-gradient(135deg,#fdf1f0,#fce3e1)" },
  ];

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #061a3a 0%, #0a3060 18%, #0d5490 38%, #1472a8 58%, #1a8abe 75%, #1e95c8 90%, #2298cc 100%)"
    }}>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Heading */}
        <div ref={headingRef} className="reveal mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#7dd8f0" }}>
            Get in Touch
          </p>
          <h1 className="font-[Fraunces] text-6xl md:text-7xl font-semibold text-white leading-tight"
            style={{ textShadow: "0 2px 28px rgba(3,4,94,0.5)" }}>
            Let&apos;s
            <br />
            <span className="italic" style={{ color: "#90e0ef" }}>connect</span>
          </h1>
          <p className="mt-5 text-[#b8e8f8] text-lg max-w-md leading-relaxed">
            Open to freelance projects, and collaborations. Drop a message or find me on any of the platforms below.
          </p>
        </div>

        {/* Social link cards */}
        <div ref={cardsRef} className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">{s.name}</p>
                  <p className="text-[#90d8f0] text-xs mt-0.5 truncate max-w-[90px]">{s.label}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Simple contact form */}
        <div ref={formRef} className="reveal rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.16)" }}>
          <h2 className="font-[Fraunces] text-2xl font-semibold text-white mb-6">Send a message</h2>

          {status === "success" && (
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl text-sm"
              style={{ background: "rgba(72, 202, 228, 0.15)", border: "1px solid rgba(144, 224, 239, 0.35)" }}>
              <CheckCircle2 size={18} className="text-[#90e0ef] shrink-0 mt-0.5" />
              <p className="text-[#caf0f8]">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "rgba(255, 100, 100, 0.12)", border: "1px solid rgba(255, 150, 150, 0.3)" }}>
              <p className="text-[#ffc9c9]">{errorMessage}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-2 text-[#90e0ef] font-semibold hover:text-white transition-colors">
                Email {CONTACT_EMAIL}
              </a>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#7dd8f0" }}>Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/35 text-sm outline-none transition-all focus:ring-2 focus:ring-white/30 disabled:opacity-60"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#7dd8f0" }}>Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/35 text-sm outline-none transition-all focus:ring-2 focus:ring-white/30 disabled:opacity-60"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#7dd8f0" }}>Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                minLength={10}
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="What's on your mind?"
                disabled={status === "loading"}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/35 text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-white/30 disabled:opacity-60"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-[#061a3a] transition-all hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #90e0ef, #48cae4)" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>

      </div>
      <Footer />
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onProjectClick }: { onProjectClick: (p: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <HeroSection onScrollDown={() => ref.current?.scrollIntoView({ behavior: "smooth" })} />
      <div ref={ref}><ProjectsSection onProjectClick={onProjectClick} /></div>
      <SocialSection />
      <Footer />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigateTo = (page: Page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openProject = (project: Project) => { setSelectedProject(project); setCurrentPage("project"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBack = () => { setCurrentPage("home"); setSelectedProject(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{STYLES}</style>
      <SvgDefs />
      <Nav currentPage={currentPage} onNavigate={navigateTo} />
      {currentPage === "home"    && <HomePage onProjectClick={openProject} />}
      {currentPage === "about"   && <AboutPage />}
      {currentPage === "resume"  && <ResumePage />}
      {currentPage === "project" && selectedProject && <ProjectDetailPage project={selectedProject} onBack={goBack} />}
      {currentPage === "contact" && <ContactPage />}
    </div>
  );
}
