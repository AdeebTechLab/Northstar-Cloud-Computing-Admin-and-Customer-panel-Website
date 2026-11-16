/**
 * Line-art illustrations in the style of digitalocean.com (thin cyan strokes on the
 * dark card colour). All are deterministic inline SVGs so nothing external is loaded.
 */

const stroke = "#6fe0ed";
const dim = "#325553";
const panel = "#000f0f";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label={label} className="h-auto w-full rounded-2xl border border-line-soft bg-surface">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#13302e" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="240" fill={panel} />
      <rect width="320" height="240" fill="url(#grid)" opacity="0.7" />
      {children}
    </svg>
  );
}

function ComputeArt() {
  return (
    <Frame label="Cloud compute illustration">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${70 + i * 10} ${60 + i * 28})`}>
          <rect x="0" y="0" width="180" height="60" rx="10" fill={panel} stroke={i === 2 ? stroke : dim} strokeWidth="2" />
          <rect x="16" y="16" width="28" height="28" rx="4" fill="none" stroke={i === 2 ? stroke : dim} strokeWidth="2" />
          <path d="M60 22h80M60 34h56" stroke={i === 2 ? stroke : dim} strokeWidth="2" strokeLinecap="round" />
          <circle cx="156" cy="30" r="5" fill={i === 2 ? "#a6b559" : dim} />
        </g>
      ))}
    </Frame>
  );
}

function StorageArt() {
  return (
    <Frame label="Storage illustration">
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${90 + i * 90} 70)`}>
          <ellipse cx="40" cy="14" rx="40" ry="14" fill={panel} stroke={i ? dim : stroke} strokeWidth="2" />
          <path d="M0 14v80c0 8 18 14 40 14s40-6 40-14V14" fill={panel} stroke={i ? dim : stroke} strokeWidth="2" />
          <path d="M0 48c0 8 18 14 40 14s40-6 40-14M0 76c0 8 18 14 40 14s40-6 40-14" fill="none" stroke={i ? dim : stroke} strokeWidth="2" />
        </g>
      ))}
      <path d="M130 170h60" stroke={stroke} strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
    </Frame>
  );
}

function NetworkArt() {
  const nodes = [
    [160, 60],
    [70, 130],
    [250, 130],
    [110, 200],
    [210, 200],
  ] as const;
  return (
    <Frame label="Networking illustration">
      {nodes.slice(1).map(([x, y], i) => (
        <path key={i} d={`M160 60L${x} ${y}`} stroke={dim} strokeWidth="2" />
      ))}
      <path d="M70 130L110 200M250 130L210 200M110 200h100" stroke={dim} strokeWidth="2" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 18 : 12} fill={panel} stroke={i === 0 ? stroke : dim} strokeWidth="2" />
      ))}
      <circle cx="160" cy="60" r="6" fill={stroke} />
    </Frame>
  );
}

function SecurityArt() {
  return (
    <Frame label="Security illustration">
      <path d="M160 40l70 24v50c0 44-30 76-70 92-40-16-70-48-70-92V64z" fill={panel} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <rect x="136" y="110" width="48" height="40" rx="6" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M146 110V96a14 14 0 0 1 28 0v14" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="160" cy="130" r="4" fill={stroke} />
    </Frame>
  );
}

function ManagementArt() {
  const bars = [40, 64, 52, 80, 70, 96, 86];
  return (
    <Frame label="Management illustration">
      <rect x="40" y="40" width="240" height="160" rx="12" fill={panel} stroke={dim} strokeWidth="2" />
      <path d="M40 72h240" stroke={dim} strokeWidth="2" />
      <circle cx="58" cy="56" r="4" fill={dim} />
      <circle cx="72" cy="56" r="4" fill={dim} />
      <circle cx="86" cy="56" r="4" fill={dim} />
      {bars.map((h, i) => (
        <rect key={i} x={64 + i * 28} y={184 - h} width="14" height={h} rx="3" fill={i === bars.length - 1 ? stroke : dim} />
      ))}
    </Frame>
  );
}

function InfrastructureArt() {
  return (
    <Frame label="Infrastructure illustration">
      <rect x="92" y="36" width="136" height="168" rx="10" fill={panel} stroke={dim} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(104 ${48 + i * 30})`}>
          <rect width="112" height="22" rx="4" fill="none" stroke={i === 1 ? stroke : dim} strokeWidth="2" />
          <circle cx="14" cy="11" r="3" fill={i === 1 ? "#a6b559" : dim} />
          <path d="M30 11h60" stroke={i === 1 ? stroke : dim} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

const arts = [ComputeArt, StorageArt, NetworkArt, SecurityArt, ManagementArt, InfrastructureArt];

export function LayerArt({ index }: { index: number }) {
  const Art = arts[index % arts.length];
  return <Art />;
}

/** Overlapping circles over a grid of vertical lines (the "performance" image). */
export function PerformanceArt() {
  return (
    <svg viewBox="0 0 600 400" role="img" aria-label="Overlapping performance curves" className="h-auto w-full rounded-xl border border-line-soft bg-surface">
      <rect width="600" height="400" fill={panel} />
      {Array.from({ length: 25 }, (_, i) => (
        <path key={i} d={`M${12 + i * 24} 0V400`} stroke="#13302e" strokeWidth="1" />
      ))}
      <circle cx="230" cy="200" r="130" fill="rgba(111,224,237,0.08)" stroke={stroke} strokeWidth="2" />
      <circle cx="330" cy="200" r="130" fill="rgba(26,175,191,0.08)" stroke="#1aafbf" strokeWidth="2" />
      <circle cx="280" cy="120" r="90" fill="rgba(226,182,88,0.06)" stroke="#e2b658" strokeWidth="2" />
      <circle cx="280" cy="170" r="6" fill={stroke} />
    </svg>
  );
}

/** Dark skyline silhouette used behind the hero stat cards (cityscape backdrop). */
export function Cityscape() {
  const bars = Array.from({ length: 64 }, (_, i) => {
    const h = 40 + ((i * 37) % 23) * 5 + (i % 5) * 9;
    const w = 12 + ((i * 13) % 4) * 5;
    return { h, w, x: i * 23 };
  });
  return (
    <svg viewBox="0 0 1472 320" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#041a1f" stopOpacity="0" />
          <stop offset="1" stopColor="#08333a" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="1472" height="320" fill="url(#sky)" />
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={320 - b.h} width={b.w} height={b.h} fill="#0b2423" />
          {Array.from({ length: Math.floor(b.h / 14) }, (_, r) => (
            <rect key={r} x={b.x + 3} y={320 - b.h + 6 + r * 14} width="3" height="3" fill="#6fe0ed" opacity={((i * 7 + r * 3) % 5) === 0 ? 0.55 : 0.12} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------
   CTA banner edge art: concentric dashed arcs with survey-style
   coordinate labels, mirrored for the right edge. Decorative only.
------------------------------------------------------------------- */
const ARC_W = 280;
const ARC_H = 480;

export function CtaArcs({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const fx = (x: number) => (left ? x : ARC_W - x);
  const ink = "rgba(201, 238, 242, 0.38)";
  const outer = [320, 370, 430].map((r) => ({ cx: fx(-190), r }));
  const inner = [400, 450].map((r) => ({ cx: fx(480), r }));
  const labels = left
    ? [
        { x: 160, y: 100, text: "X229.36 Y4" },
        { x: 36, y: 318, text: "X229.36 Y441.16" },
        { x: 118, y: 470, text: "X229.36 Y441.16" },
      ]
    : [
        { x: 160, y: 14, text: "X229.3" },
        { x: 36, y: 250, text: "Y441.16" },
        { x: 118, y: 372, text: "X229.36 Y441.16" },
      ];
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ARC_W} ${ARC_H}`}
      preserveAspectRatio={left ? "xMinYMid meet" : "xMaxYMid meet"}
      className={`pointer-events-none absolute inset-y-0 z-0 hidden h-full w-auto aspect-[7/12] sm:block ${left ? "left-0" : "right-0"}`}
    >
      <g fill="none" stroke={ink} strokeWidth="1" strokeDasharray="5 5">
        {[...outer, ...inner].map((c, i) => (
          <circle key={i} cx={c.cx} cy={ARC_H / 2} r={c.r} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill={ink} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.6">
        {labels.map((l) => (
          <text key={`${l.text}-${l.y}`} transform={`translate(${fx(l.x)} ${l.y}) rotate(${left ? -90 : 90})`}>
            {l.text}
          </text>
        ))}
      </g>
    </svg>
  );
}
