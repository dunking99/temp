import { series, spark, chart, path, area, sign, rnd } from "./kit";

/* ============================ STRAND — luminous bento ============================ */

const CSS = `
.strand{background:#07050d;color:#eae9f3;min-height:100vh;font-family:'Inter',system-ui,sans-serif;
  --v:#8b5cf6; --c:#22d3ee; --a:#fbbf24; --g:#34d399; --r:#fb7185; --card:rgba(255,255,255,.045); --bd:rgba(255,255,255,.09)}
.strand *{box-sizing:border-box}
.strand a{color:inherit;text-decoration:none}
.strand .num{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums}
.strand .up{color:var(--g)} .strand .dn{color:var(--r)} .strand .fl{color:#9a96b5}
.strand .wrap{max-width:1320px;margin:0 auto;padding:0 26px}
.strand .hdr{position:sticky;top:0;z-index:60;backdrop-filter:blur(18px);background:rgba(7,5,13,.72);border-bottom:1px solid var(--bd)}
.strand .hdr-in{display:flex;align-items:center;gap:24px;height:66px}
.strand .logo{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-.03em;font-size:17px}
.strand .logo span{width:26px;height:26px;border-radius:9px;background:linear-gradient(135deg,var(--v),var(--c));box-shadow:0 6px 18px rgba(139,92,246,.5)}
.strand .logo em{font-style:normal;font-size:10.5px;letter-spacing:.22em;color:#8f8ab0;font-weight:600;border-left:1px solid var(--bd);padding-left:10px}
.strand nav{display:flex;gap:6px;margin-left:6px;flex-wrap:wrap}
.strand nav a{padding:9px 15px;border-radius:999px;font-size:13.5px;font-weight:550;color:#a8a3c4;transition:.18s;border:1px solid transparent}
.strand nav a:hover{color:#fff;background:rgba(255,255,255,.07)}
.strand nav a.on{color:#0a0714;background:linear-gradient(135deg,#c4b5fd,#67e8f9);font-weight:700}
.strand .hdr .rt{margin-left:auto;display:flex;gap:12px;align-items:center}
.strand .pill{font-size:11.5px;padding:7px 13px;border-radius:999px;border:1px solid var(--bd);background:rgba(255,255,255,.04);color:#b8b4d4}
.strand .pill.live{color:#6ee7b7;border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.1);display:flex;gap:7px;align-items:center}
.strand .pill.live i{width:7px;height:7px;border-radius:99px;background:var(--g);animation:sp 1.6s infinite}
@keyframes sp{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
.strand .marq{border-bottom:1px solid var(--bd);background:rgba(255,255,255,.02);overflow:hidden;white-space:nowrap}
.strand .marq .track{display:inline-block;padding:10px 0;animation:stm 50s linear infinite}
.strand .marq:hover .track{animation-play-state:paused}
@keyframes stm{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.strand .marq span{padding:0 22px;font-size:13px;border-right:1px solid var(--bd)}
.strand .marq b{font-weight:700;letter-spacing:.02em}
.strand .marq i{font-style:normal;color:#8f8ab0;font-size:12px}
.strand main{padding:24px 0 90px}
.strand .card{background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:20px;position:relative;overflow:hidden}
.strand .card.glow:before{content:"";position:absolute;width:280px;height:280px;border-radius:50%;filter:blur(70px);opacity:.4;right:-90px;top:-120px;background:var(--v);pointer-events:none}
.strand h2{font-size:17px;font-weight:700;letter-spacing:-.02em;margin:0 0 4px;display:flex;align-items:center;gap:10px}
.strand h2 .dot{width:7px;height:7px;border-radius:99px;background:var(--c);box-shadow:0 0 12px var(--c)}
.strand .sub{font-size:12.5px;color:#9a96b5;margin:0 0 14px;line-height:1.5}
.strand .kick{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#8f8ab0;font-weight:600}
.strand .hero{position:relative;border-radius:26px;overflow:hidden;border:1px solid var(--bd);margin-bottom:20px}
.strand .hero .bg{position:absolute;inset:0;background:url(images/strand-hero.jpg) center/cover;opacity:.72}
.strand .hero:after{content:"";position:absolute;inset:0;background:radial-gradient(900px 420px at 18% 20%,rgba(139,92,246,.42),transparent 60%),linear-gradient(90deg,rgba(7,5,13,.94) 40%,rgba(7,5,13,.35))}
.strand .hero-in{position:relative;z-index:2;padding:44px 40px;display:flex;gap:36px;align-items:flex-end;flex-wrap:wrap;min-height:300px}
.strand .hero h1{font-size:clamp(34px,5vw,60px);line-height:1.02;letter-spacing:-.04em;margin:14px 0 0;font-weight:800;max-width:660px}
.strand .hero h1 span{background:linear-gradient(100deg,#a78bfa,#67e8f9 60%,#fbbf24);-webkit-background-clip:text;background-clip:text;color:transparent}
.strand .hero p{max-width:560px;color:#c9c5e4;font-size:15px;line-height:1.6;margin:16px 0 0}
.strand .statrow{margin-left:auto;display:flex;gap:10px;flex-wrap:wrap}
.strand .stat{background:rgba(10,7,20,.66);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:14px 16px;min-width:132px;backdrop-filter:blur(8px)}
.strand .stat .k{font-size:10.5px;letter-spacing:.14em;color:#9a96b5;text-transform:uppercase;font-weight:600}
.strand .stat .v{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:3px;font-family:'IBM Plex Mono'}
.strand .stat .c{font-size:12px;font-family:'IBM Plex Mono'}
.strand .bento{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
.strand .b3{grid-column:span 3}.strand .b4{grid-column:span 4}.strand .b5{grid-column:span 5}
.strand .b6{grid-column:span 6}.strand .b7{grid-column:span 7}.strand .b8{grid-column:span 8}.strand .b12{grid-column:span 12}
@media (max-width:1000px){.strand .bento>*{grid-column:span 12}}
.strand .tile{display:block;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:16px;padding:13px 15px;transition:.18s}
.strand .tile:hover{transform:translateY(-3px);border-color:rgba(167,139,250,.5);background:rgba(255,255,255,.07)}
.strand .tile .k{font-size:12px;color:#a8a3c4;display:flex;justify-content:space-between;align-items:center}
.strand .tile .v{font-size:20px;font-weight:700;margin-top:5px;letter-spacing:-.02em;font-family:'IBM Plex Mono'}
.strand .tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media (max-width:760px){.strand .tiles{grid-template-columns:repeat(2,1fr)}}
.strand .seg{display:inline-flex;gap:4px;background:rgba(255,255,255,.05);padding:4px;border-radius:999px;border:1px solid var(--bd)}
.strand .seg button{background:transparent;border:0;color:#a8a3c4;font-size:12.5px;font-weight:600;padding:7px 14px;border-radius:999px;cursor:pointer;transition:.15s}
.strand .seg button:hover{color:#fff}
.strand .seg button.on{background:#fff;color:#100b1d}
.strand .row{display:flex;justify-content:space-between;align-items:center;gap:12px}
.strand .list .it{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13.5px}
.strand .list .it:last-child{border-bottom:0}
.strand .list .it:hover{background:rgba(255,255,255,.03);border-radius:10px}
.strand .rank{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;font:700 11px 'IBM Plex Mono';background:rgba(139,92,246,.24);color:#c4b5fd}
.strand .chip{font-size:11.5px;padding:5px 11px;border-radius:999px;font-weight:600;border:1px solid var(--bd)}
.strand .chip.v{color:#c4b5fd;background:rgba(139,92,246,.16);border-color:rgba(139,92,246,.4)}
.strand .chip.c{color:#67e8f9;background:rgba(34,211,238,.13);border-color:rgba(34,211,238,.35)}
.strand .chip.a{color:#fcd34d;background:rgba(251,191,36,.13);border-color:rgba(251,191,36,.35)}
.strand .chip.g{color:#6ee7b7;background:rgba(52,211,153,.13);border-color:rgba(52,211,153,.35)}
.strand table{width:100%;border-collapse:collapse}
.strand th{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8f8ab0;text-align:right;padding:10px 12px;border-bottom:1px solid var(--bd);font-weight:600}
.strand th:first-child,.strand td:first-child{text-align:left}
.strand td{padding:11px 12px;font-size:13.5px;text-align:right;border-bottom:1px solid rgba(255,255,255,.055)}
.strand tbody tr:hover td{background:rgba(255,255,255,.04)}
.strand .sym{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:10px;font:700 11px 'IBM Plex Mono';margin-right:9px;vertical-align:middle}
.strand .pagehd{margin-bottom:20px}
.strand .pagehd h1{font-size:clamp(28px,4vw,44px);letter-spacing:-.035em;margin:8px 0 6px;font-weight:800}
.strand .pagehd p{color:#a8a3c4;max-width:660px;font-size:14.5px;line-height:1.6;margin:0}
.strand .ringwrap{display:flex;align-items:center;gap:22px}
.strand .legend{display:flex;gap:8px;flex-wrap:wrap}
.strand .legend button{background:rgba(255,255,255,.05);border:1px solid var(--bd);color:#a8a3c4;font-size:12px;padding:7px 12px;border-radius:999px;cursor:pointer;display:flex;gap:7px;align-items:center}
.strand .legend button.on{color:#fff;border-color:rgba(255,255,255,.35)}
.strand .legend button i{width:9px;height:9px;border-radius:3px;display:block}
.strand .bar{height:8px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
.strand .bar i{display:block;height:100%;border-radius:99px}
.strand .kv{display:flex;justify-content:space-between;font-size:13.5px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.strand .kv:last-child{border-bottom:0}
.strand .kv span{color:#9a96b5}
.strand .note{font-size:12px;color:#8f8ab0;line-height:1.55}
.strand .ft{border-top:1px solid var(--bd);padding:24px 0 44px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font-size:12px;color:#8f8ab0}
@media (max-width:880px){.strand .card{overflow-x:auto}.strand table{min-width:600px}.strand .hero-in{padding:30px 22px}.strand .statrow{margin-left:0}}
@media (prefers-reduced-motion:reduce){.strand .marq .track,.strand .pill.live i{animation:none}}
`;

const TICK = [
  ["S&P", "4,922.41", "+0.62%"], ["NDX", "17,482.9", "+0.94%"], ["VIX", "13.92", "−4.21%"], ["10Y", "4.18%", "−4bp"],
  ["DXY", "104.31", "+0.34%"], ["BTC", "$68,412", "+2.14%"], ["ETH", "$3,542", "+3.42%"], ["GOLD", "$2,412.6", "+0.81%"],
  ["BRENT", "$82.14", "−1.24%"], ["COPPER", "$4.21", "+1.14%"],
];

const marquee = () => {
  const one = TICK.map((t) => `<span><b>${t[0]}</b> <i>${t[1]}</i> <em class="${t[2].startsWith("+") ? "up" : "dn"}" style="font-style:normal">${t[2]}</em></span>`).join("");
  return `<div class="marq"><div class="track">${one}${one}</div></div>`;
};

const NAV = [
  { id: "pulse", label: "Pulse" },
  { id: "world", label: "World" },
  { id: "crypto", label: "Digital assets" },
  { id: "vol", label: "Volatility" },
  { id: "flows", label: "Flows" },
];

/* ------------------------------- VIEWS ------------------------------- */

function pulse() {
  const movers = [["SMCI", "Super Micro", 18.4], ["NVDA", "NVIDIA", 2.41], ["TSM", "TSMC", 3.12], ["DVN", "Devon Energy", -6.12], ["XOM", "Exxon", -1.31], ["TSLA", "Tesla", -2.44]];
  const idx = [["S&P 500", 4922.41, 0.62], ["Nasdaq 100", 17482.9, 0.94], ["Dow", 38654.2, 0.21], ["FTSE", 7684.21, -0.18], ["DAX", 16992.7, 0.44], ["Nikkei", 38412.71, 1.86]];
  return `
  <section class="hero">
    <div class="bg"></div>
    <div class="hero-in">
      <div>
        <div class="kick">Monday · 09 February 2026 · 17:42 GMT</div>
        <h1>Markets are <span>risk-on</span> again.</h1>
        <p>A softer CPI put the March cut back in play. Yields fell across the curve, semiconductors carried the tape,
          and 257 of the S&P 500's 500 constituents closed higher. Energy was the lone sector in the red.</p>
      </div>
      <div class="statrow">
        ${[["S&P 500", "4,922.4", "+0.62%", "up"], ["US 10Y", "4.18%", "−4bp", "up"], ["VIX", "13.92", "−4.21%", "up"], ["DXY", "104.31", "+0.34%", "dn"]]
          .map((s) => `<div class="stat"><div class="k">${s[0]}</div><div class="v">${s[1]}</div><div class="c ${s[3]}">${s[2]}</div></div>`).join("")}
      </div>
    </div>
  </section>

  <div class="bento">
    <div class="card b8 glow">
      <div class="row" style="margin-bottom:6px">
        <h2><span class="dot"></span>Today, charted</h2>
        <div class="seg" data-seg-group="pc">
          <button data-seg="spx" class="on">S&amp;P 500</button><button data-seg="ndx">Nasdaq</button>
          <button data-seg="btc">Bitcoin</button><button data-seg="gold">Gold</button></div>
      </div>
      <p class="sub">Session tape, rebased to the open. Hover any point for the print.</p>
      <div data-seg-target="pc" data-seg-view="spx">${chart({ vals: series(90, 5, 0.016, 0.0014, 100), w: 900, h: 240, color: "#8b5cf6" })}</div>
      <div data-seg-target="pc" data-seg-view="ndx" style="display:none">${chart({ vals: series(90, 9, 0.02, 0.0019, 100), w: 900, h: 240, color: "#22d3ee" })}</div>
      <div data-seg-target="pc" data-seg-view="btc" style="display:none">${chart({ vals: series(90, 31, 0.03, 0.0028, 100), w: 900, h: 240, color: "#fbbf24" })}</div>
      <div data-seg-target="pc" data-seg-view="gold" style="display:none">${chart({ vals: series(90, 41, 0.014, 0.0007, 100), w: 900, h: 240, color: "#34d399" })}</div>
      <div class="row" style="margin-top:14px;border-top:1px solid var(--bd);padding-top:14px">
        <div style="display:flex;gap:26px;flex-wrap:wrap">
          ${[["Session", "+0.71% avg"], ["Range", "4,890 – 4,929"], ["Volume", "3.94bn"], ["Breadth", "1.04 A/D"]].map((k) => `<div><div class="note">${k[0]}</div><div class="num" style="font-size:15px">${k[1]}</div></div>`).join("")}
        </div>
        <span class="chip c">15 min delayed</span>
      </div>
    </div>

    <div class="card b4">
      <div class="row"><h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>Sentiment</h2><span class="chip g">Greed</span></div>
      <div class="ringwrap" style="margin-top:12px">
        <svg viewBox="0 0 130 130" width="130" height="130">
          <defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="#fb7185"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs>
          <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="13"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="url(#sg)" stroke-width="13" stroke-linecap="round"
            stroke-dasharray="${(63 / 100) * 327} 327" transform="rotate(-90 65 65)"/>
          <text x="65" y="68" text-anchor="middle" font-size="34" font-weight="700" fill="#eae9f3" font-family="IBM Plex Mono">63</text>
          <text x="65" y="86" text-anchor="middle" font-size="9.5" fill="#8f8ab0" letter-spacing="1.4">GREED</text></svg>
        <div style="flex:1">
          ${[["Momentum", 78], ["Price strength", 64], ["Put / call", 71], ["Volatility", 60], ["Safe haven", 48]].map((s) => `<div style="margin-bottom:10px">
            <div class="row" style="font-size:12px"><span class="note">${s[0]}</span><span class="num">${s[1]}</span></div>
            <div class="bar" style="margin-top:5px"><i style="width:${s[1]}%;background:linear-gradient(90deg,var(--v),var(--c))"></i></div></div>`).join("")}
        </div>
      </div>
      <div class="row" style="margin-top:8px"><span class="note">Prev 61 · 1w 54 · 1m 48</span><span class="chip a">▲ 3 signals</span></div>
    </div>

    <div class="card b5">
      <h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Market pulse</h2>
      <p class="sub">Written from 214 headlines and every print on the desk, refreshed every five minutes.</p>
      <div style="font-size:15.5px;line-height:1.65;color:#d6d3ec">
        <b style="color:#fff">Stocks higher for a third session.</b> The two-year yield fell eleven basis points after CPI printed 3.1%
        against 3.2% expected, and fed funds futures now price a 68% chance of a March cut. Semiconductors did the work again —
        <span class="chip c" style="margin:0 3px">NVDA +2.4%</span> — while Brent slipped under $83 and dragged energy down 1.3%.
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        ${[["Rates", "v"], ["Commodities", "a"], ["FX", "c"], ["Equities", "g"]].map((t) => `<span class="chip ${t[1]}">${t[0]}</span>`).join("")}
      </div>
      <div class="row" style="margin-top:16px;border-top:1px solid var(--bd);padding-top:14px">
        <span class="note">Next release: US CPI, 11 Feb 08:30 ET</span>
        <div class="seg"><button class="on">Headlines</button><button>Mine only</button></div>
      </div>
    </div>

    <div class="card b4">
      <h2><span class="dot"></span>Index tape</h2>
      <div class="tiles" style="grid-template-columns:repeat(2,1fr)">
        ${idx.map((i, k) => `<a class="tile" href="#/strand/world"><div class="k">${i[0]}<span class="${i[2] >= 0 ? "up" : "dn"}" style="font-size:12px">${sign(i[2])}%</span></div>
          <div class="v">${i[1].toLocaleString()}</div>
          ${spark(series(40, k + 2, 0.02, i[2] >= 0 ? 0.001 : -0.001, 100), 150, 34, i[2] >= 0 ? "#34d399" : "#fb7185", true)}</a>`).join("")}
      </div>
    </div>

    <div class="card b3">
      <h2><span class="dot" style="background:var(--r);box-shadow:0 0 12px var(--r)"></span>Movers</h2>
      <div class="list">
        ${movers.map((m, i) => `<div class="it"><span class="rank">${i + 1}</span>
          <div style="flex:1"><div>${m[0]}</div><div class="note" style="font-size:11.5px">${m[1]}</div></div>
          <span class="num ${m[2] >= 0 ? "up" : "dn"}">${sign(m[2])}%</span></div>`).join("")}
      </div>
      <div class="row" style="margin-top:12px"><span class="note">Scanning 4,180 instruments</span><span class="chip v">live</span></div>
    </div>

    <div class="card b6">
      <div class="row"><h2><span class="dot" style="background:var(--g);box-shadow:0 0 12px var(--g)"></span>Breadth</h2><span class="chip g">Confirming</span></div>
      <div class="bar" style="height:14px;margin:14px 0" data-tip="257 advancing / 246 declining">
        <i style="width:51.2%;background:linear-gradient(90deg,#047857,#34d399)"></i>
        <i style="width:48.8%;background:linear-gradient(90deg,#fb7185,#be123c);margin-left:-2px"></i></div>
      <div class="tiles" style="grid-template-columns:repeat(4,1fr)">
        ${[["Advancing", "257", "up"], ["Declining", "246", "dn"], ["New highs", "84", "up"], ["% &gt; 200DMA", "68%", "up"]].map((k) => `<div class="tile"><div class="k">${k[0]}</div><div class="v ${k[2]}">${k[1]}</div></div>`).join("")}
      </div>
      <svg viewBox="0 0 560 90" width="100%" height="90" style="margin-top:12px">
        ${[["<-3%", 62], ["-3/0", 184], ["0/+3", 296], [">+3%", 61]].map((b, i) => `<rect x="${i * 140 + 6}" y="${80 - b[1] / 4}" width="120" height="${b[1] / 4}" rx="6" fill="${i < 2 ? "#fb7185" : "#34d399"}" opacity=".8" data-tip="${b[0]}% : ${b[1]} stocks"/>`).join("")}
      </svg>
    </div>

    <div class="card b6">
      <div class="row"><h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Next up</h2><span class="chip a">3 events</span></div>
      <div class="list" style="margin-top:6px">
        ${[["US CPI y/y", "Wed 11 · 08:30 ET", "3.1% cons", "high"], ["ECB rate decision", "Thu 12 · 12:45 CET", "4.00% held", "high"],
          ["US retail sales", "Fri 13 · 08:30 ET", "+0.4% cons", "high"], ["China industrial output", "Fri 13 · 01:30 CST", "5.2% cons", "med"]]
          .map((e) => `<div class="it"><span class="rank" style="background:rgba(34,211,238,.2);color:#67e8f9">${e[3] === "high" ? "!" : "·"}</span>
          <div style="flex:1"><div>${e[0]}</div><div class="note" style="font-size:11.5px">${e[1]}</div></div>
          <span class="note num">${e[2]}</span></div>`).join("")}
      </div>
      <div class="row" style="margin-top:12px;border-top:1px solid var(--bd);padding-top:12px">
        <span class="note">Next Fed decision in 37 days · 68% priced for a 25bp cut</span><span class="chip v">calendar</span></div>
    </div>
  </div>`;
}

const LAND = "M60 120 Q90 80 140 82 L215 92 Q245 110 232 150 L205 188 L188 240 L215 300 L196 340 L168 300 L150 220 L110 180 Z M405 88 Q470 70 520 96 L560 86 L610 110 L660 96 L720 108 L780 96 L800 130 L740 168 L700 150 L650 178 L612 240 L560 230 L520 196 L470 166 L430 168 L398 140 Z M470 200 L520 196 L536 250 L506 320 L470 292 L452 236 Z M700 250 Q740 236 786 262 L774 306 L716 312 Z";

function worldView() {
  const C = [
    ["United States", "S&P 500", 4922.41, 0.62, 172, 152, 30], ["Canada", "TSX", 21344, 0.21, 176, 96, 20],
    ["Brazil", "IBOV", 128740, -0.84, 252, 288, 20], ["United Kingdom", "FTSE 100", 7684, -0.18, 430, 118, 19],
    ["Germany", "DAX", 16993, 0.44, 466, 122, 21], ["France", "CAC 40", 7624, 0.29, 447, 136, 18],
    ["South Africa", "JSE", 69240, -1.12, 487, 288, 14], ["Saudi Arabia", "TASI", 12180, 0.74, 540, 198, 15],
    ["India", "NIFTY 50", 22056, 1.31, 619, 204, 22], ["China", "CSI 300", 3299, -1.47, 686, 160, 26],
    ["Japan", "Nikkei 225", 38413, 1.86, 752, 158, 24], ["Australia", "ASX 200", 7612, -0.36, 742, 296, 18],
    ["Hong Kong", "Hang Seng", 16224, -2.05, 700, 188, 18], ["South Korea", "KOSPI", 2605, 0.92, 727, 161, 16],
  ];
  const strength = [["JPY", -1.84], ["EUR", -0.31], ["GBP", -0.42], ["CAD", 0.12], ["CHF", 0.48], ["USD", 0.72], ["CNY", 1.12]];
  const regions = [["Americas", 0.08, "+8bp"], ["EMEA", 0.21, "11h 42m left"], ["Asia-Pacific", 0.34, "closed"], ["Gulf", 0.74, "closed"]];
  return `
  <div class="pagehd">
    <div class="kick">Sub-page · World</div>
    <h1>One session, <span style="background:linear-gradient(100deg,#a78bfa,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent">everywhere</span></h1>
    <p>Where the world's markets closed, where they are still trading, and how each currency has moved against every other one today.</p>
  </div>

  <div class="bento">
    <div class="card b8 glow">
      <div class="row"><h2><span class="dot"></span>Global equity map</h2>
        <div class="seg" data-seg-group="mp"><button data-seg="d" class="on">1 day</button><button data-seg="w">1 week</button><button data-seg="y">Year</button></div></div>
      <p class="sub">Bubble size = index weight in MSCI ACWI. Colour = return, green for gains. Hover any node.</p>
      ${[["d", 1], ["w", 2.4], ["y", 5.1]].map((m, mi) => `<div data-seg-target="mp" data-seg-view="${m[0]}" style="${mi ? "display:none" : ""}">
        <svg viewBox="0 0 840 360" width="100%" height="360">
          <rect width="840" height="360" rx="16" fill="rgba(255,255,255,.03)"/>
          ${[...Array(8)].map((_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="840" y2="${(i + 1) * 40}" stroke="rgba(255,255,255,.05)"/>`).join("")}
          ${[...Array(14)].map((_, i) => `<line y1="0" x1="${(i + 1) * 56}" y2="360" x2="${(i + 1) * 56}" stroke="rgba(255,255,255,.05)"/>`).join("")}
          <path d="${LAND}" fill="rgba(139,92,246,.16)" stroke="rgba(167,139,250,.4)"/>
          ${C.map((c) => { const p = c[3] * m[1]; const col = p >= 0 ? "#34d399" : "#fb7185"; const R = c[6] * (0.75 + Math.min(1, Math.abs(p) / 2.4));
            return `<g data-tip="${c[0]} · ${c[1]}\n${c[2].toLocaleString()}  ${sign(p)}%">
              <circle cx="${c[4]}" cy="${c[5]}" r="${R}" fill="${col}" opacity=".12"/>
              <circle cx="${c[4]}" cy="${c[5]}" r="${R * 0.5}" fill="${col}" opacity=".5" stroke="${col}" stroke-width="1.4"/>
              <text x="${c[4]}" y="${c[5] + 3.5}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" font-weight="600" fill="#fff">${sign(p, 1)}</text></g>`; }).join("")}
        </svg></div>`).join("")}
      <div class="row" style="margin-top:8px">
        <span class="note">17 markets higher, 10 lower · equal-weighted composite <b class="up num">+0.21%</b></span>
        <span class="chip c">15 min delayed</span></div>
    </div>

    <div class="card b4">
      <h2><span class="dot" style="background:var(--g);box-shadow:0 0 12px var(--g)"></span>Regional clocks</h2>
      <div class="list" style="margin-top:8px">
        ${regions.map((r, i) => `<div class="it"><span class="rank" style="background:rgba(34,211,238,.18);color:#67e8f9">${i + 1}</span>
          <div style="flex:1"><div>${r[0]}</div><div class="note" style="font-size:11.5px">${r[2]}</div></div>
          <span class="num ${r[1] >= 0 ? "up" : "dn"}">${sign(r[1])}%</span></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:6px">
        <span class="note">Open now</span><span class="chip g">New York · London · Frankfurt</span></div>
      <div class="row" style="margin-top:10px"><span class="note">Closed</span><span class="chip v">Tokyo · Hong Kong · Shanghai</span></div>
      <div class="row" style="margin-top:14px"><span class="note">Local time</span><span class="num" data-clock="Europe/London">—</span></div>
    </div>

    <div class="card b5">
      <div class="row"><h2><span class="dot" style="background:var(--c);box-shadow:0 0 12px var(--c)"></span>Currency strength</h2><span class="chip c">1D</span></div>
      <p class="sub">Performance against a trade-weighted basket, today.</p>
      ${strength.slice().reverse().map((s) => `<div style="display:flex;align-items:center;gap:12px;padding:9px 0" data-tip="${s[0]} ${sign(s[1], 2)}% vs basket">
        <span class="num" style="width:38px;font-size:12.5px">${s[0]}</span>
        <span style="flex:1;position:relative;height:12px"><i style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.18);display:block"></i>
          <i style="position:absolute;top:2px;height:8px;border-radius:99px;background:${s[1] >= 0 ? "#34d399" : "#fb7185"};${s[1] >= 0 ? `left:50%;width:${Math.abs(s[1]) * 36}%` : `right:50%;width:${Math.abs(s[1]) * 36}%`};display:block"></i></span>
        <span class="num ${s[1] >= 0 ? "up" : "dn"}" style="width:56px;text-align:right;font-size:12.5px">${sign(s[1])}</span></div>`).join("")}
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:8px">
        <span class="note">Strongest: CNY +1.12%</span><span class="note">Weakest: JPY −1.84%</span></div>
    </div>

    <div class="card b7">
      <div class="row"><h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Majors today</h2>
        <div class="seg"><button class="on">Rates</button><button>Chart</button><button>Calendar</button></div></div>
      <table style="margin-top:10px">
        <thead><tr><th>Pair</th><th>Rate</th><th>1D</th><th>Day range</th><th>YTD</th></tr></thead>
        <tbody>
        ${[["EUR / USD", 1.0891, -0.28, 62, -1.4], ["USD / JPY", 151.42, 0.62, 78, 4.9], ["GBP / USD", 1.2684, 0.17, 48, 1.4],
          ["USD / CHF", 0.8842, 0.19, 55, -2.1], ["AUD / USD", 0.6518, -0.44, 32, -0.8], ["USD / CNH", 7.2416, 0.31, 71, 1.2],
          ["EUR / GBP", 0.8586, -0.42, 44, -2.6]].map((p) => `<tr data-tip="${p[0]} day range position ${p[3]}%">
          <td class="num" style="font-weight:600">${p[0]}</td><td class="num">${p[1].toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
          <td class="num ${p[2] >= 0 ? "up" : "dn"}">${sign(p[2])}%</td>
          <td><div style="position:relative;height:8px;border-radius:99px;background:rgba(255,255,255,.08)"><i style="position:absolute;left:${p[3]}%;top:-3px;width:3px;height:14px;background:#fbbf24;border-radius:2px;display:block"></i></div></td>
          <td class="num ${p[4] >= 0 ? "up" : "dn"}">${sign(p[4], 1)}%</td></tr>`).join("")}
        </tbody></table>
    </div>

    <div class="card b4">
      <h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>Regional leaders</h2>
      <div class="list">
        ${[["Japan", "Nikkei 225", 1.86], ["India", "NIFTY 50", 1.31], ["Germany", "DAX", 0.44], ["China", "CSI 300", -1.47], ["Hong Kong", "Hang Seng", -2.05]]
          .map((r) => `<div class="it"><div style="flex:1"><div>${r[0]}</div><div class="note" style="font-size:11.5px">${r[1]}</div></div>
          <span class="num ${r[2] >= 0 ? "up" : "dn"}">${sign(r[2])}%</span></div>`).join("")}
      </div>
      <div class="bar" style="margin-top:14px"><i style="width:61%;background:linear-gradient(90deg,var(--v),var(--c))"></i></div>
      <div class="row" style="margin-top:8px"><span class="note">ACWI advanced: 61%</span><span class="chip v">breadth</span></div>
    </div>
  </div>`;
}

function cryptoView() {
  const K = [
    ["BTC", "Bitcoin", 68412, 2.14, 1348, 52.1], ["ETH", "Ethereum", 3542.18, 3.42, 426, 16.4],
    ["SOL", "Solana", 184.22, 6.81, 84, 3.2], ["BNB", "BNB", 592.4, -0.94, 86, 3.3],
    ["XRP", "XRP", 0.6124, -2.31, 34, 1.3], ["DOGE", "Dogecoin", 0.1442, 8.62, 21, 0.8],
    ["ADA", "Cardano", 0.5842, 1.12, 21, 0.8], ["AVAX", "Avalanche", 38.11, 4.22, 15, 0.6],
    ["TON", "Toncoin", 6.92, 5.14, 17, 0.7], ["LINK", "Chainlink", 18.44, -1.08, 11, 0.4],
  ];
  const cols = ["#f59e0b", "#8b5cf6", "#22d3ee", "#fbbf24", "#34d399", "#fb7185"];
  let acc = 0;
  const donut = K.slice(0, 5).map((k, i) => { const frac = k[5] / 100; const d = frac * 339;
    const el = `<circle r="54" cx="70" cy="70" fill="none" stroke="${cols[i]}" stroke-width="19" stroke-dasharray="${d} 339" stroke-dashoffset="${-acc}" transform="rotate(-90 70 70)" data-tip="${k[1]} ${k[5]}%"/>`; acc += d; return el; }).join("");
  return `
  <div class="pagehd">
    <div class="kick">Sub-page · Digital assets</div>
    <h1>Crypto, 24 hours</h1>
    <p>Spot prices, dominance, derivatives tape and on-chain flows across the ten assets that carry the market.</p>
  </div>

  <div class="bento">
    <div class="card b12 glow" style="padding:0">
      <div style="padding:22px 24px 8px" class="row">
        <div><h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Board</h2>
          <p class="sub" style="margin:0">Exchange-weighted composite · sorted by 24-hour move</p></div>
        <div class="seg"><button class="on">Majors</button><button>Movers</button><button>DeFi</button><button>Memes</button></div>
      </div>
      <div style="padding:14px 24px 22px">
        <div class="tiles" style="grid-template-columns:repeat(5,1fr);gap:12px">
          ${[...K].sort((a, b) => b[3] - a[3]).map((k, i) => `<div class="tile" data-tip="${k[1]} · mcap $${k[4]}bn">
            <div class="k"><span class="sym" style="width:24px;height:24px;border-radius:8px;background:${cols[i % cols.length]}22;color:${cols[i % cols.length]}">${k[0].slice(0, 2)}</span></div>
            <div class="v" style="margin-top:8px">$${k[2].toLocaleString(undefined, { maximumFractionDigits: k[2] < 10 ? 4 : 0 })}</div>
            <div class="row" style="margin-top:6px"><span class="note">${k[0]}</span><span class="num ${k[3] >= 0 ? "up" : "dn"}">${sign(k[3], 1)}%</span></div>
            <div style="margin-top:8px">${spark(series(40, i * 7 + 3, 0.05, k[3] / 700, 100), 160, 32, k[3] >= 0 ? "#34d399" : "#fb7185", true)}</div>
          </div>`).join("")}
        </div>
      </div>
      <div class="row" style="padding:14px 24px;border-top:1px solid var(--bd);flex-wrap:wrap;gap:14px">
        <span class="note"><b style="color:#eae9f3">Alt season index</b> 64</span>
        <span class="note"><b style="color:#eae9f3">ETH/BTC</b> 0.0518 <span class="up">+1.2%</span></span>
        <span class="note"><b style="color:#eae9f3">Funding (8h)</b> <span class="up">+0.014%</span></span>
        <span class="note"><b style="color:#eae9f3">Open interest</b> $41.8bn <span class="up">+3.1%</span></span>
        <span class="note"><b style="color:#eae9f3">Liquidations 24h</b> <span class="dn">$214m</span></span>
        <span class="chip a">derivatives</span>
      </div>
    </div>

    <div class="card b4">
      <h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>Dominance</h2>
      <div class="ringwrap">
        <svg viewBox="0 0 140 140" width="140" height="140">
          ${donut}<circle r="54" cx="70" cy="70" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="19" stroke-dasharray="0 339"/>
          <text x="70" y="66" text-anchor="middle" font-size="11" fill="#8f8ab0">TOTAL</text>
          <text x="70" y="86" text-anchor="middle" font-size="17" fill="#eae9f3" font-family="IBM Plex Mono">$2.59T</text></svg>
        <div style="flex:1">
          ${K.slice(0, 5).map((k, i) => `<div class="kv"><span><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${cols[i]};margin-right:8px"></i>${k[0]}</span>
            <span class="num">${k[5]}%</span></div>`).join("")}
        </div>
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:6px">
        <span class="note">BTC dominance fell 0.4pt this week</span><span class="chip c">7d</span></div>
    </div>

    <div class="card b8">
      <div class="row"><h2><span class="dot" style="background:var(--g);box-shadow:0 0 12px var(--g)"></span>Spot table</h2>
        <div class="seg"><button class="on">24h</button><button>7d</button><button>30d</button></div></div>
      <table style="margin-top:8px">
        <thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>Market cap</th><th>Volume</th><th>7-day</th></tr></thead>
        <tbody>
        ${K.map((k, i) => `<tr data-tip="${k[1]} · $${k[4]}bn market cap">
          <td><span class="sym" style="background:${cols[i % cols.length]}22;color:${cols[i % cols.length]}">${k[0][0]}</span><b>${k[0]}</b>
            <span class="note">${k[1]}</span></td>
          <td class="num">$${k[2].toLocaleString(undefined, { maximumFractionDigits: k[2] < 10 ? 4 : 0 })}</td>
          <td class="num ${k[3] >= 0 ? "up" : "dn"}">${sign(k[3])}%</td>
          <td class="num">$${k[4]}bn</td>
          <td class="num note">$${(k[4] * 0.031).toFixed(1)}bn</td>
          <td style="width:110px">${spark(series(34, i * 5 + 11, 0.05, k[3] / 900, 100), 100, 24, k[3] >= 0 ? "#34d399" : "#fb7185", false)}</td></tr>`).join("")}
        </tbody></table>
    </div>

    <div class="card b5">
      <div class="row"><h2><span class="dot" style="background:var(--c);box-shadow:0 0 12px var(--c)"></span>ETF net flows</h2><span class="chip g">+$412m</span></div>
      <p class="sub">US spot bitcoin funds, daily, last ten sessions.</p>
      <div style="display:flex;gap:6px;align-items:flex-end;height:110px">
        ${[142, 218, -64, 302, 486, 221, -32, 388, 512, 412].map((v, i) => `<div data-tip="Day ${i + 1}: ${v >= 0 ? "+" : "−"}$${Math.abs(v)}m"
          style="flex:1;height:${Math.abs(v) / 5}px;border-radius:6px;background:${v >= 0 ? "linear-gradient(180deg,#34d399,#059669)" : "linear-gradient(180deg,#fb7185,#be123c)"};${v < 0 ? "align-self:flex-start" : ""}"></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:12px">
        <span class="note">Five-day streak of creations</span><span class="chip g">inflow</span></div>
      ${[["IBIT", "+$2.41bn"], ["FBTC", "+$0.86bn"], ["BITB", "+$0.42bn"], ["ARKB", "−$0.18bn"]].map((f) => `<div class="kv"><span>${f[0]}</span><span class="num ${f[1].startsWith("+") ? "up" : "dn"}">${f[1]}</span></div>`).join("")}
    </div>

    <div class="card b7">
      <div class="row"><h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>Correlation to equities</h2><span class="chip v">90-day rolling</span></div>
      <p class="sub">Rolling correlation of daily returns against the S&P 500.</p>
      ${[["BTC", 0.62, "#f59e0b"], ["ETH", 0.68, "#8b5cf6"], ["SOL", 0.54, "#22d3ee"], ["Gold", 0.18, "#34d399"], ["US 10Y", -0.41, "#fb7185"]]
        .map((c) => `<div style="display:flex;align-items:center;gap:12px;padding:9px 0" data-tip="${c[0]} correlation ${c[1]}">
          <span style="width:76px;font-size:13px">${c[0]}</span>
          <span style="flex:1;position:relative;height:12px;border-radius:99px;background:rgba(255,255,255,.07)">
            <i style="position:absolute;left:50%;top:-4px;bottom:-4px;width:1px;background:rgba(255,255,255,.3)"></i>
            <i style="position:absolute;top:2px;height:8px;border-radius:99px;background:${c[2]};${c[1] >= 0 ? `left:50%;width:${c[1] * 50}%` : `right:50%;width:${-c[1] * 50}%`};display:block"></i></span>
          <span class="num" style="width:52px;text-align:right">${c[1] > 0 ? "+" : ""}${c[1].toFixed(2)}</span></div>`).join("")}
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:8px">
        <span class="note">Crypto still trades as a high-beta risk asset; gold remains the cleanest diversifier.</span><span class="chip a">note</span></div>
    </div>
  </div>`;
}

function volView() {
  const terms = [["VX1", 14.1, 0], ["VX2", 15.2, 1], ["VX3", 16.4, 2], ["VX4", 17.1, 3], ["VX5", 17.6, 4], ["VX6", 18.2, 5], ["VX8", 19.0, 6], ["VX12", 19.6, 7]];
  return `
  <div class="pagehd">
    <div class="kick">Sub-page · Volatility &amp; sentiment</div>
    <h1>What fear costs</h1>
    <p>Implied volatility across the curve, how the market prices tail risk, and the seven signals behind the sentiment composite.</p>
  </div>

  <div class="bento">
    <div class="card b4 glow">
      <div class="row"><h2><span class="dot"></span>VIX</h2><span class="chip g">calm · 11th pctile</span></div>
      <div class="ringwrap" style="margin-top:12px">
        <svg viewBox="0 0 140 140" width="140" height="140">
          <defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs>
          <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="15"/>
          <circle cx="70" cy="70" r="56" fill="none" stroke="url(#vg)" stroke-width="15" stroke-linecap="round"
            stroke-dasharray="${(13.92 / 50) * 352} 352" transform="rotate(-90 70 70)"/>
          <text x="70" y="72" text-anchor="middle" font-size="36" font-weight="700" fill="#eae9f3" font-family="IBM Plex Mono">13.92</text>
          <text x="70" y="92" text-anchor="middle" font-size="9.5" fill="#8f8ab0" letter-spacing="1.2">SCALE 0 – 50</text></svg>
        <div style="flex:1">
          ${[["1 day", "−4.21%", "up"], ["1 week", "−9.80%", "up"], ["1 month", "+2.10%", "dn"], ["1 year", "−31.40%", "up"]].map((k) => `<div class="kv"><span>${k[0]}</span><span class="num ${k[2]}">${k[1]}</span></div>`).join("")}
        </div>
      </div>
      <div style="margin-top:14px">${spark(series(70, 23, 0.09, -0.001, 19).map((v) => Math.max(11, v)), 320, 70, "#a78bfa", true)}</div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:10px">
        <span class="note">Implied daily move <b class="num" style="color:#eae9f3">±0.88%</b></span><span class="chip v">30-day</span></div>
    </div>

    <div class="card b5">
      <div class="row"><h2><span class="dot" style="background:var(--c);box-shadow:0 0 12px var(--c)"></span>Volatility curve</h2>
        <div class="seg" data-seg-group="vt"><button data-seg="fut" class="on">Futures</button><button data-seg="spy">SPY options</button></div></div>
      <p class="sub">Expected volatility by delivery month — normal upward slope, no stress pricing.</p>
      <div data-seg-target="vt" data-seg-view="fut">
        <svg viewBox="0 0 560 210" width="100%" height="210">
          <line x1="30" x2="545" y1="180" y2="180" stroke="rgba(255,255,255,.15)"/>
          <path d="${terms.map((t, i) => (i ? "L" : "M") + (40 + i * 72) + " " + (170 - ((t[1] - 13) / 8) * 140)).join(" ")}" fill="none" stroke="#22d3ee" stroke-width="2.6"/>
          ${terms.map((t, i) => `<g data-tip="${t[0]} · ${t[1].toFixed(1)}"><circle cx="${40 + i * 72}" cy="${170 - ((t[1] - 13) / 8) * 140}" r="5" fill="#07050d" stroke="#22d3ee" stroke-width="2.2"/>
            <text x="${40 + i * 72}" y="${158 - ((t[1] - 13) / 8) * 140}" font-size="11" fill="#eae9f3" font-family="IBM Plex Mono" text-anchor="middle">${t[1]}</text>
            <text x="${40 + i * 72}" y="198" font-size="10" fill="#8f8ab0" font-family="IBM Plex Mono" text-anchor="middle">${t[0]}</text></g>`).join("")}
        </svg>
        <div class="row"><span class="note">Contango: M1 → M12 adds 5.7 vol points</span><span class="chip g">not stressed</span></div>
      </div>
      <div data-seg-target="vt" data-seg-view="spy" style="display:none">
        <svg viewBox="0 0 560 210" width="100%" height="210">
          <line x1="30" x2="545" y1="180" y2="180" stroke="rgba(255,255,255,.15)"/>
          <path d="${terms.map((t, i) => (i ? "L" : "M") + (40 + i * 72) + " " + (60 + Math.abs(i - 1.5) * 26)).join(" ")}" fill="none" stroke="#fb7185" stroke-width="2.6"/>
          ${terms.map((t, i) => `<g data-tip="${t[0]} strike skew"><circle cx="${40 + i * 72}" cy="${60 + Math.abs(i - 1.5) * 26}" r="5" fill="#07050d" stroke="#fb7185" stroke-width="2.2"/>
            <text x="${40 + i * 72}" y="${48 + Math.abs(i - 1.5) * 26}" font-size="11" fill="#eae9f3" font-family="IBM Plex Mono" text-anchor="middle">${(20 - i * 0.8).toFixed(1)}</text>
            <text x="${40 + i * 72}" y="198" font-size="10" fill="#8f8ab0" font-family="IBM Plex Mono" text-anchor="middle">${(5450 - i * 100).toLocaleString()}</text></g>`).join("")}
        </svg>
        <div class="row"><span class="note">25Δ put skew steep for a third week</span><span class="chip v">downside bid</span></div>
      </div>
    </div>

    <div class="card b3">
      <div class="row"><h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Put / call</h2><span class="chip a">0.82</span></div>
      <div class="num" style="font-size:44px;letter-spacing:-.03em;margin:10px 0 2px">0.82</div>
      <div class="note">5-day average · bullish lean</div>
      <div style="margin-top:14px">${spark(series(60, 77, 0.06, -0.001, 1.05), 280, 60, "#fbbf24", true)}</div>
      <div class="bar" style="margin-top:14px"><i style="width:38%;background:linear-gradient(90deg,var(--a),var(--r))"></i></div>
      <div class="row" style="margin-top:8px"><span class="note">Euphoric &lt; 0.70</span><span class="note">Panicked &gt; 1.20</span></div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:14px">
        <span class="note">CBOE equity-only</span><span class="chip c">live</span></div>
    </div>

    <div class="card b7">
      <div class="row"><h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>The sentiment composite</h2><span class="chip g">63 · greed</span></div>
      <p class="sub">Seven equally weighted signals. Bars show the current reading; the marker shows the one-year average.</p>
      ${[["Market momentum", 78, 54], ["Stock price strength", 64, 51], ["Breadth (volume)", 55, 53], ["Put / call ratio", 71, 55],
        ["Volatility (VIX)", 60, 50], ["Safe-haven demand", 48, 56], ["Junk bond demand", 69, 58]].map((s) => `
        <div style="margin-bottom:13px" data-tip="${s[0]} · now ${s[1]}, 1y avg ${s[2]}">
          <div class="row" style="font-size:13px"><span>${s[0]}</span><span class="num">${s[1]}</span></div>
          <div class="bar" style="margin-top:6px;position:relative">
            <i style="width:${s[1]}%;background:linear-gradient(90deg,${s[1] > s[2] ? "rgba(139,92,246,.6),#34d399" : "rgba(251,113,133,.6),#fbbf24"})"></i>
            <i style="position:absolute;left:${s[2]}%;top:-4px;height:16px;width:2px;background:#fff;border-radius:2px;box-shadow:0 0 8px rgba(255,255,255,.6)"></i></div>
        </div>`).join("")}
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:6px">
        <span class="note">Whites bars mark the one-year average</span><span class="chip v">7 signals</span></div>
    </div>

    <div class="card b5">
      <div class="row"><h2><span class="dot" style="background:var(--r);box-shadow:0 0 12px var(--r)"></span>Tail risk pricing</h2><span class="chip v">options</span></div>
      <div class="list" style="margin-top:8px">
        ${[["1-month 5% OTM put", "5.4 vol", "−0.6"], ["1-month 5% OTM call", "4.1 vol", "+0.2"], ["3-month 10% OTM put", "6.8 vol", "+0.4"], ["VIX9D", "13.1", "−5.2"], ["VVIX", "82.1", "−1.4"]]
          .map((r) => `<div class="it"><div style="flex:1">${r[0]}</div><span class="num">${r[1]}</span>
          <span class="num ${r[2].startsWith("−") ? "up" : "dn"}" style="width:52px;text-align:right">${r[2]}</span></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:8px">
        <span class="note">Downside protection is cheap by historical standards</span><span class="chip c">skew</span></div>
    </div>
  </div>`;
}

function flowsView() {
  const F = [["US Large Cap", 8.42, "#8b5cf6"], ["Treasuries", 4.31, "#22d3ee"], ["Crypto Spot", 5.89, "#fbbf24"],
    ["Gold & Metals", 2.18, "#f59e0b"], ["Intl Developed", 3.11, "#34d399"], ["High Yield", -0.98, "#fb7185"],
    ["Emerging Mkts", -1.24, "#f472b6"], ["Sector: Energy", -1.52, "#f87171"], ["Small Cap", -0.64, "#94a3b8"], ["Cash / Ultrashort", -2.21, "#64748b"]];
  const mx = Math.max(...F.map((f) => Math.abs(f[1])));
  return `
  <div class="pagehd">
    <div class="kick">Sub-page · Flows</div>
    <h1>Where the money went</h1>
    <p>Fund creations and redemptions by category, leverage in the system, and how much cash is sitting on the sidelines.</p>
  </div>

  <div class="bento">
    <div class="card b7 glow">
      <div class="row"><h2><span class="dot"></span>Weekly net flows by category</h2>
        <div class="seg" data-seg-group="fl"><button data-seg="w" class="on">Week</button><button data-seg="m">Month</button><button data-seg="y">YTD</button></div></div>
      <p class="sub">Net creations minus redemptions, US-listed funds, $bn.</p>
      ${[["w", 1], ["m", 4.2], ["y", 17.6]].map((f, fi) => `<div data-seg-target="fl" data-seg-view="${f[0]}" style="${fi ? "display:none" : ""}">
        ${F.map((x) => `<div style="display:flex;align-items:center;gap:14px;padding:7px 0" data-tip="${x[0]} ${sign(x[1] * f[1], 2)}bn">
          <span style="width:150px;font-size:13px">${x[0]}</span>
          <span style="flex:1;position:relative;height:20px"><i style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.16);display:block"></i>
            <i style="position:absolute;top:4px;height:12px;border-radius:99px;background:${x[1] >= 0 ? x[2] : "#fb7185"};${x[1] >= 0 ? `left:50%;width:${(Math.abs(x[1]) / mx) * 46}%` : `right:50%;width:${(Math.abs(x[1]) / mx) * 46}%`};display:block"></i></span>
          <span class="num ${x[1] >= 0 ? "up" : "dn"}" style="width:84px;text-align:right;font-size:12.5px">${x[1] >= 0 ? "+" : "−"}$${Math.abs(x[1] * f[1]).toFixed(2)}bn</span></div>`).join("")}
      </div>`).join("")}
      <div class="row" style="border-top:1px solid var(--bd);padding-top:13px;margin-top:8px">
        <span class="note">Total across 3,140 funds <b class="up num">+$18.4bn</b></span><span class="chip g">net inflow</span></div>
    </div>

    <div class="card b5">
      <div class="row"><h2><span class="dot" style="background:var(--c);box-shadow:0 0 12px var(--c)"></span>Liquidity pulse</h2><span class="chip c">global</span></div>
      <p class="sub">Central bank balance sheets and global M2, indexed to January 2024.</p>
      ${chart({ vals: series(120, 61, 0.01, 0.0016, 100), w: 520, h: 160, color: "#22d3ee" })}
      <div class="tiles" style="grid-template-columns:repeat(2,1fr);margin-top:14px">
        ${[["G4 balance sheets", "$18.9tn", "+$412bn 3m"], ["Global M2", "$108.4tn", "+1.8% 3m"], ["USD reserves", "$12.3tn", "flat"], ["Fed RRP", "$218bn", "−$46bn w/w"]]
          .map((k) => `<div class="tile"><div class="k">${k[0]}</div><div class="v" style="font-size:17px">${k[1]}</div><div class="note" style="font-size:11.5px">${k[2]}</div></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:14px">
        <span class="note">Liquidity has been additive for eleven straight weeks</span><span class="chip v">expansion</span></div>
    </div>

    <div class="card b4">
      <div class="row"><h2><span class="dot" style="background:var(--a);box-shadow:0 0 12px var(--a)"></span>Top funds</h2><span class="chip a">week</span></div>
      <div class="list" style="margin-top:6px">
        ${[["IBIT", "iShares Bitcoin Trust", "+$2.41bn", 1], ["VOO", "Vanguard S&P 500", "+$1.98bn", 1], ["SGOV", "iShares 0-3M T-bill", "+$1.22bn", 1], ["XLE", "Energy Select", "−$0.87bn", 0], ["EEM", "iShares MSCI EM", "−$0.64bn", 0]]
          .map((f) => `<div class="it"><div style="flex:1"><div><b>${f[0]}</b></div><div class="note" style="font-size:11.5px">${f[1]}</div></div>
          <span class="num ${f[3] ? "up" : "dn"}">${f[2]}</span></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:10px">
        <span class="note">Ranked by absolute flow</span><span class="chip c">3,140 funds</span></div>
    </div>

    <div class="card b4">
      <div class="row"><h2><span class="dot" style="background:var(--v);box-shadow:0 0 12px var(--v)"></span>Leverage</h2><span class="chip v">78th pctile</span></div>
      <div class="num" style="font-size:38px;letter-spacing:-.03em;margin-top:8px">$742bn</div>
      <div class="note">FINRA margin debt · +18.4% year on year</div>
      <div style="margin-top:14px">${spark(series(90, 85, 0.02, 0.0022, 380), 300, 70, "#fbbf24", true)}</div>
      <div class="bar" style="margin-top:14px"><i style="width:78%;background:linear-gradient(90deg,#34d399,#fb7185)"></i></div>
      <div class="row" style="margin-top:8px"><span class="note">Low</span><span class="note">Percentile since 1997</span><span class="note">High</span></div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:12px">
        <span class="note">Growth above 25% y/y preceded four of the last five drawdowns</span></div>
    </div>

    <div class="card b4">
      <div class="row"><h2><span class="dot" style="background:var(--g);box-shadow:0 0 12px var(--g)"></span>Who is positioned</h2><span class="chip g">survey</span></div>
      <div class="list" style="margin-top:6px">
        ${[["Real money", "overweight duration", "g"], ["Asset managers", "net long equities", "g"], ["Leverage funds", "net short SPX", "c"], ["Households", "cash 13.8%", "a"], ["Foreigners", "net buyers of US", "v"]]
          .map((p) => `<div class="it"><div style="flex:1"><div>${p[0]}</div><div class="note" style="font-size:11.5px">${p[1]}</div></div>
          <span class="chip ${p[2]}">${p[0] === "Leverage funds" ? "−84k" : p[0] === "Households" ? "−0.4pt" : "+12k"}</span></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:10px">
        <span class="note">CFTC COT, latest week</span><span class="chip c">positioning</span></div>
    </div>

    <div class="card b4">
      <div class="row"><h2><span class="dot" style="background:var(--r);box-shadow:0 0 12px var(--r)"></span>Sector rotation</h2><span class="chip v">4w relative</span></div>
      <div class="list" style="margin-top:6px">
        ${[["Technology", 2.4, 1], ["Comm. Services", 1.6, 1], ["Industrials", 0.5, 1], ["Real Estate", -1.4, 0], ["Energy", -3.4, 0]]
          .map((s) => `<div class="it"><div style="flex:1">${s[0]}</div>
            <span style="width:96px"><span class="bar"><i style="width:${Math.abs(s[1]) * 24}%;background:${s[2] ? "#34d399" : "#fb7185"}"></i></span></span>
            <span class="num ${s[2] ? "up" : "dn"}" style="width:56px;text-align:right">${sign(s[1], 1)}%</span></div>`).join("")}
      </div>
      <div class="row" style="border-top:1px solid var(--bd);padding-top:12px;margin-top:10px">
        <span class="note">Leadership still concentrated in secular growth</span><span class="chip a">rotation</span></div>
    </div>
  </div>`;
}

const VIEWS = {
  pulse: { title: "Pulse", html: pulse },
  world: { title: "World", html: worldView },
  crypto: { title: "Digital Assets", html: cryptoView },
  vol: { title: "Volatility", html: volView },
  flows: { title: "Flows", html: flowsView },
};

function shell(page, ctx) {
  return `
  <div class="strand">
    <style>${CSS}</style>
    <header class="hdr"><div class="wrap hdr-in">
      <div class="logo"><span></span>Meridian<em>STRAND</em></div>
      <nav>${NAV.map((n) => `<a href="#/strand/${n.id}" class="${n.id === ctx.pKey ? "on" : ""}">${n.label}</a>`).join("")}</nav>
      <div class="rt"><span class="pill live"><i></i>Live</span><span class="pill num" data-clock="Europe/London">—</span></div>
    </div></header>
    ${marquee()}
    <main class="wrap">${page.html()}
      <div class="ft"><span>Meridian Strand · a markets experience</span>
        <span>Simulated data · not investment advice</span>
        <span class="num" data-clock="UTC">—</span></div>
    </main>
  </div>`;
}

export const strand = { id: "strand", name: "Design C · Strand", short: "STRAND · APP", shell, views: VIEWS, nav: NAV };
