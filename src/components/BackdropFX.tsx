export default function BackdropFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* warm bokeh lights */}
      <div
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, #f5c96b, transparent 65%)" }}
      />
      <div
        className="absolute right-[-8rem] top-[55%] h-[30rem] w-[30rem] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #7aa5ff, transparent 65%)" }}
      />
      <div
        className="absolute left-1/3 top-[80%] h-80 w-80 rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #ff8a8a, transparent 65%)" }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 20%, transparent 55%, rgba(3,6,18,0.6) 100%)",
        }}
      />
    </div>
  );
}
