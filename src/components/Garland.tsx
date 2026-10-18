const COLORS = ["#f5c96b", "#ff8a8a", "#9fd8ff", "#b8f5c9", "#e3b0ff"];

function buildBulbs(count: number) {
  // quadratic bezier: P0(0,18) C(720,120) P2(1440,18)
  const bulbs: Array<{ x: number; y: number; color: string; delay: number; drop: number }> = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * 720 + t * t * 1440;
    const y = (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * 120 + t * t * 18;
    bulbs.push({
      x,
      y,
      color: COLORS[i % COLORS.length],
      delay: (i % 5) * 0.42,
      drop: 8 + ((i * 7) % 10),
    });
  }
  return bulbs;
}

const BULBS = buildBulbs(22);

export default function Garland() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-full z-30 hidden select-none sm:block"
      style={{ animation: "sway 7s ease-in-out infinite", transformOrigin: "50% 0" }}
    >
      <svg viewBox="0 0 1440 120" className="h-[76px] w-full" fill="none">
        <path
          d="M0 18 Q720 120 1440 18"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
        />
        {BULBS.map((b, i) => (
          <g key={i}>
            <line
              x1={b.x}
              y1={b.y}
              x2={b.x}
              y2={b.y + b.drop}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.6"
            />
            <circle
              cx={b.x}
              cy={b.y + b.drop + 5}
              r={4.6}
              fill={b.color}
              opacity={0.35}
              style={{
                animation: `twinkle 2.6s ease-in-out ${b.delay}s infinite`,
                filter: `drop-shadow(0 0 7px ${b.color})`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
