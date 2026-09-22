export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col bg-[#EDE9E0]">
      <header className="flex items-center justify-between gap-4 border-b-2 border-[#1A1916] px-5 py-2 shrink-0">
        <div className="flex items-baseline gap-3">
          <span
            className="text-[22px] leading-none text-[#8E2C22]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Meridian
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[#8C877A]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Component design catalogue · 120 plates · 40 components × 3 directions
          </span>
        </div>
        <a
          href="/meridian.html"
          target="_blank"
          className="border border-[#1A1916] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1916] no-underline transition-colors hover:bg-[#1A1916] hover:text-[#F7F5EF]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Open catalogue ↗
        </a>
      </header>
      <iframe
        src="/meridian.html"
        title="Meridian component design catalogue"
        className="w-full flex-1 border-0"
      />
    </main>
  );
}
