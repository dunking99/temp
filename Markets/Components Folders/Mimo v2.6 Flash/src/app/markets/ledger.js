import { series, spark, chart, path, sign, rnd } from "./kit";

/* ============================ LEDGER — editorial broadsheet ============================ */

const CSS = `
.ledger{background:#f4f1ea;color:#14161a;min-height:100vh;font-family:'Inter',system-ui,sans-serif;--ink:#14161a;--rule:#c9c3b4;--mut:#6f6b62;--blue:#1b3a6b;--oxb:#a8321f;--grn:#1c6b45;--paper:#f4f1ea}
.ledger *{box-sizing:border-box}
.ledger a{color:inherit;text-decoration:none}
.ledger .num{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums}
.ledger .up{color:var(--grn)} .ledger .dn{color:var(--oxb)} .ledger .fl{color:var(--mut)}
.ledger .wrap{max-width:1240px;margin:0 auto;padding:0 30px}
.ledger .mast{border-bottom:3px double var(--ink);padding-top:22px}
.ledger .mast-top{display:flex;justify-content:space-between;font:600 10px 'Archivo';letter-spacing:.2em;text-transform:uppercase;color:var(--mut);padding-bottom:10px}
.ledger .wordmark{font-family:'Fraunces',serif;font-weight:700;font-size:clamp(42px,7vw,86px);line-height:.92;letter-spacing:-.03em;text-align:center;margin:6px 0 8px}
.ledger .wordmark i{font-style:italic;font-weight:400}
.ledger .strap{display:flex;justify-content:center;gap:26px;font:500 11px 'IBM Plex Mono';letter-spacing:.1em;color:var(--mut);padding-bottom:12px;flex-wrap:wrap}
.ledger .nav{display:flex;justify-content:center;gap:0;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);flex-wrap:wrap}
.ledger .nav a{font:600 11px 'Archivo';letter-spacing:.16em;text-transform:uppercase;padding:12px 20px;border-right:1px solid var(--rule);transition:.15s}
.ledger .nav a:first-child{border-left:1px solid var(--rule)}
.ledger .nav a:hover{background:#eae5d8}
.ledger .nav a.on{background:var(--ink);color:var(--paper)}
.ledger .nav a b{color:var(--oxb);margin-right:8px;font-weight:700}
.ledger .nav a.on b{color:#e8b06a}
.ledger .alert{background:#1b1a16;color:#efe9da;padding:8px 0;font:500 11.5px 'IBM Plex Mono';letter-spacing:.06em}
.ledger .alert .wrap{display:flex;gap:22px;align-items:center;justify-content:center;flex-wrap:wrap}
.ledger .alert b{color:#ffce7a;font-weight:600}
.ledger .pagehd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;border-bottom:1px solid var(--ink);padding:26px 0 12px;flex-wrap:wrap}
.ledger .pagehd h2{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(30px,4vw,46px);margin:0;letter-spacing:-.02em}
.ledger .pagehd p{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:#42403a}
.ledger .sect{font:700 10.5px 'Archivo';letter-spacing:.2em;text-transform:uppercase;display:flex;align-items:center;gap:12px;margin:0 0 14px;padding-bottom:7px;border-bottom:1px solid var(--ink)}
.ledger .sect b{color:var(--oxb)}
.ledger .sect span{margin-left:auto;font:500 10px 'IBM Plex Mono';color:var(--mut);letter-spacing:.08em}
.ledger .cols{display:grid;grid-template-columns:minmax(0,1fr) 312px;gap:0;padding:22px 0 60px}
.ledger .main{padding-right:30px}
.ledger .rail{border-left:1px solid var(--rule);padding-left:26px}
@media (max-width:940px){.ledger .cols{grid-template-columns:1fr}.ledger .main{padding-right:0}.ledger .rail{border-left:0;border-top:1px solid var(--ink);padding-left:0;margin-top:28px;padding-top:18px}}
.ledger .block{margin-bottom:34px}
.ledger table{width:100%;border-collapse:collapse}
.ledger th{font:700 9.5px 'Archivo';letter-spacing:.15em;text-transform:uppercase;color:var(--mut);text-align:right;padding:8px 8px;border-bottom:1px solid var(--ink)}
.ledger th:first-child,.ledger td:first-child{text-align:left;padding-left:0}
.ledger td{padding:9px 8px;font-size:13.5px;text-align:right;border-bottom:1px solid var(--rule)}
.ledger tr:hover td{background:#ece7da}
.ledger .figcap{font:500 10.5px 'IBM Plex Mono';color:var(--mut);letter-spacing:.03em;margin-top:6px;line-height:1.5}
.ledger .dropcap::first-letter{font-family:'Fraunces',serif;font-weight:600;font-size:58px;line-height:.78;float:left;padding:6px 10px 0 0;color:var(--ink)}
.ledger .lead{font-family:'Instrument Serif',serif;font-size:19px;line-height:1.62;color:#26241f}
.ledger .body{font-size:14.5px;line-height:1.72;color:#33312b}
.ledger .body p{margin:0 0 14px}
.ledger .kicker{font:700 10.5px 'Archivo';letter-spacing:.2em;text-transform:uppercase;color:var(--oxb);margin-bottom:10px}
.ledger h3.title{font-family:'Fraunces',serif;font-weight:600;font-size:26px;letter-spacing:-.01em;margin:0 0 8px;line-height:1.16}
.ledger .rail .item{border-bottom:1px solid var(--rule);padding:12px 0}
.ledger .rail .item:last-child{border-bottom:0}
.ledger .rail .item h4{font-family:'Fraunces',serif;font-size:16px;margin:5px 0 4px;line-height:1.28;font-weight:600}
.ledger .rail .item p{margin:0;font-size:12.5px;line-height:1.55;color:var(--mut)}
.ledger .idx{font:700 11px 'IBM Plex Mono';color:var(--oxb)}
.ledger .fig{border:1px solid var(--ink);position:relative;overflow:hidden}
.ledger .fig img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.78) contrast(1.03)}
.ledger .stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.ledger .stats div{padding:12px 14px;border-right:1px solid var(--rule)}
.ledger .stats div:last-child{border-right:0}
.ledger .stats .k{font:700 9.5px 'Archivo';letter-spacing:.15em;text-transform:uppercase;color:var(--mut)}
.ledger .stats .v{font-family:'IBM Plex Mono';font-size:21px;margin-top:4px;font-variant-numeric:tabular-nums}
.ledger .stats .c{font-family:'IBM Plex Mono';font-size:11.5px}
.ledger .bar{height:7px;background:#e3ddd0;position:relative}
.ledger .bar i{position:absolute;left:0;top:0;bottom:0;display:block}
.ledger .tagline{display:inline-block;font:700 9.5px 'Archivo';letter-spacing:.14em;padding:3px 7px;border:1px solid var(--ink);text-transform:uppercase}
.ledger .tagline.g{background:var(--grn);color:#f4f1ea;border-color:var(--grn)}
.ledger .tagline.o{background:var(--oxb);color:#f4f1ea;border-color:var(--oxb)}
.ledger .quote{font-family:'Instrument Serif',serif;font-size:20px;line-height:1.5;border-left:3px solid var(--oxb);padding-left:16px;margin:18px 0;color:#26241f}
.ledger .folio{border-top:3px double var(--ink);margin-top:34px;padding-top:14px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font:500 11px 'IBM Plex Mono';color:var(--mut);letter-spacing:.06em}
.ledger .week{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--ink)}
.ledger .week>div{border-right:1px solid var(--rule);padding:12px}
.ledger .week>div:last-child{border-right:0}
.ledger .day{font:700 10px 'Archivo';letter-spacing:.16em;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid var(--ink);margin-bottom:10px;display:flex;justify-content:space-between}
.ledger .ev{padding:8px 0;border-bottom:1px dotted var(--rule);font-size:12.5px;line-height:1.4}
.ledger .ev:last-child{border-bottom:0}
.ledger .ev b{display:block;font-weight:600}
.ledger .ev .m{font-family:'IBM Plex Mono';font-size:10.5px;color:var(--mut);letter-spacing:.04em}
.ledger .ev .imp{color:var(--oxb);font-weight:700}
@media (max-width:820px){.ledger .week{grid-template-columns:1fr}.ledger .stats{grid-template-columns:1fr 1fr}}
@media (max-width:880px){.ledger .block{overflow-x:auto}.ledger table{min-width:580px}.ledger .nav a{padding:11px 13px;font-size:10.5px}}
@media (prefers-reduced-motion:reduce){.ledger *{transition:none!important}}
`;

const grn = "#1c6b45", oxb = "#a8321f", blue = "#1b3a6b";

function hatch(id, color) {
  return `<pattern id="${id}" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="6" stroke="${color}" stroke-width="3" opacity=".55"/></pattern>`;
}

const IND = [
  ["S&P 500", 4922.41, 0.62, 4.1], ["Nasdaq 100", 17482.9, 0.94, 6.8], ["Dow Jones", 38654.2, 0.21, 2.4],
  ["Russell 2000", 1984.3, -0.44, 1.9], ["FTSE 100", 7684.21, -0.18, 2.1], ["DAX", 16992.7, 0.44, 7.8],
  ["Nikkei 225", 38412.71, 1.86, 16.9], ["Hang Seng", 16224.11, -2.05, -6.3],
];

function front() {
  const r = rnd(5);
  const adline = series(120, 9, 0.03, 0.0016, 1200);
  return `
  <div class="wrap">
    <div class="cols">
      <div class="main">
        <div class="block">
          <div class="fig" style="height:330px">
            <img src="images/ledger-hero.jpg" alt="Engraved banknotes from several countries on paper"/>
          </div>
          <div class="figcap">A cooler US print, a firmer dollar and a curve still upside-down — the week's story in three charts.</div>
          <div class="kicker" style="margin-top:18px">Lead · Global markets</div>
          <h3 class="title" style="font-size:clamp(28px,3.6vw,42px)">A softer inflation number puts the cut back on the table</h3>
          <p class="lead">Consumer prices rose 3.1% in January against expectations of 3.2%, the fourth consecutive month of disinflation. Two-year yields fell eleven basis points, the dollar firmed against the yen, and equity breadth turned positive for the third session running.</p>
          <p class="body dropcap">The move was not large, but it was broad. Technology carried the index again — semiconductors added 2.4% after Super Micro lifted its revenue outlook — while energy was the only sector to finish the session more than a percent lower as Brent slipped back under $83. Beneath the surface, 257 of the S&P 500's 500 constituents advanced, the widest positive reading since January, and the cumulative advance-decline line closed at a record.</p>
          <p class="body">In the rates market the implication was immediate: fed funds futures now price a 68% probability of a 25 basis point cut in March, up from 54% a week ago. Ten-year Treasuries yielded 4.18%, four basis points cheaper on the day, while the 2s10s spread sat at minus 24 basis points — inverted for a forty-third consecutive month.</p>
        </div>

        <div class="block">
          <div class="sect"><b>I.</b> The session in numbers <span>Close · 09 February 2026</span></div>
          <table>
            <thead><tr><th>Index</th><th>Close</th><th>Change</th><th>%</th><th>Year</th></tr></thead>
            <tbody>
            ${IND.map((i) => `<tr><td>${i[0]}</td><td class="num">${i[1].toLocaleString()}</td>
              <td class="num ${i[2] >= 0 ? "up" : "dn"}">${sign(i[2] * i[1] / 100, 2)}</td>
              <td class="num ${i[2] >= 0 ? "up" : "dn"}">${sign(i[2])}%</td>
              <td class="num ${i[3] >= 0 ? "up" : "dn"}">${sign(i[3], 1)}%</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="sect"><b>II.</b> Breadth, cumulative <span>NYSE composite · six months</span></div>
          <svg viewBox="0 0 760 210" width="100%" height="210" style="display:block">
            <defs>${hatch("h1", grn)}</defs>
            <line x1="0" y1="190" x2="760" y2="190" stroke="${ink()}"/>
            <path d="${areaPath(adline, 740, 175, 6)}" fill="url(#h1)" transform="translate(0,0)" opacity=".5"/>
            <path d="${path(adline, 740, 175, 6)}" fill="none" stroke="${ink()}" stroke-width="1.4"/>
            ${["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map((m, i) => `<text x="${i * 146 + 8}" y="206" font-size="10.5" fill="${"#6f6b62"}" font-family="IBM Plex Mono">${m}</text>`).join("")}
            <text x="744" y="${20}" font-size="10.5" fill="${ink()}" font-family="IBM Plex Mono" text-anchor="end">+14,204</text>
          </svg>
          <div class="figcap">Fig. 1 — Cumulative net advances. Hatching indicates the gap between advancing and declining issues, computed daily.</div>
        </div>

        <div class="block">
          <div class="sect"><b>III.</b> Valuation <span>S&amp;P 500 · trailing twelve month</span></div>
          <div class="stats">
            ${[["P/E", "21.4×", "10y avg 18.9×", "fl"], ["CAPE", "34.6", "91st percentile", "dn"], ["ERP", "−0.4%", "below average", "dn"], ["Div. yield", "1.32%", "5y avg 1.58%", "fl"]]
              .map((s) => `<div><div class="k">${s[0]}</div><div class="v">${s[1]}</div><div class="c ${s[3]}">${s[2]}</div></div>`).join("")}
          </div>
          <div class="figcap">Fig. 2 — Equity risk premium has been negative for seven consecutive quarters, an unusually long stretch in a sample reaching back to 1962.</div>
        </div>
      </div>

      <aside class="rail">
        <div class="sect"><b>·</b> In brief</div>
        <div class="item"><span class="idx">01</span><h4>Cooling prices revive the March cut</h4><p>Fed funds futures now assign 68% to a 25bp reduction, from 54% a week ago.</p></div>
        <div class="item"><span class="idx">02</span><h4>Chip lift puts Nvidia within reach of $3.5trn</h4><p>Morgan Stanley moved to Overweight with a $1,600 target; the stock added 2.4%.</p></div>
        <div class="item"><span class="idx">03</span><h4>Brent slips below $83 on inventory build</h4><p>A fifth straight weekly draw was more than offset by a rise in US crude output.</p></div>
        <div class="item"><span class="idx">04</span><h4>Tokyo leads Asia for a fourth session</h4><p>The Nikkei closed 1.86% higher; Hong Kong fell 2.05% into the weekend.</p></div>

        <div class="sect" style="margin-top:26px"><b>·</b> Sentiment <span style="margin-left:0">CNN-style</span></div>
        <div style="text-align:center;padding:14px 0 6px">
          <div style="font-family:'Fraunces';font-size:64px;line-height:1;color:var(--grn)">63</div>
          <div class="tagline g" style="margin-top:6px">Greed</div>
          <div class="figcap" style="margin-top:10px">Previous close 61 · one week ago 54 · one year ago 39</div>
        </div>
        ${[["Price momentum", 78], ["Stock strength", 64], ["Breadth", 55], ["Put/call", 71], ["Safe haven", 48]].map((s) => `
          <div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>${s[0]}</span><span class="num">${s[1]}</span></div>
          <div class="bar" style="margin-top:4px"><i style="width:${s[1]}%;background:${s[1] > 60 ? grn : oxb}"></i></div></div>`).join("")}

        <div class="sect" style="margin-top:26px"><b>·</b> Most read</div>
        ${["The curve has been inverted for 43 months. History says watch the re-steepening.", "Why equal-weight is quietly outperforming cap-weight this quarter", "The carry trade unwinds quietly, in one chart", "Shiller CAPE across eleven markets, ranked"].map((t, i) => `
          <div class="item"><span class="idx">${String(i + 5).padStart(2, "0")}</span><h4 style="font-size:15px">${t}</h4></div>`).join("")}

        <div class="sect" style="margin-top:26px"><b>·</b> Data freshness</div>
        <p class="figcap" style="margin-top:0">Equities and futures are delayed fifteen minutes. Rates, currencies and economic releases are indicative and refresh every sixty seconds. Last update <span class="num" data-clock="UTC">—</span>.</p>
      </aside>
    </div>
  </div>`;
}

const ink = () => "#14161a";
function areaPath(a, w, h, pad) { return path(a, w, h, pad) + ` L${w} ${h} L0 ${h} Z`; }

function macro() {
  const infl = [["United States", 3.1, 2.0], ["Euro area", 2.8, 2.0], ["United Kingdom", 4.0, 2.0], ["Japan", 2.2, 2.0], ["Canada", 2.9, 2.0], ["Australia", 4.1, 2.5], ["Switzerland", 1.3, 2.0], ["Brazil", 4.6, 3.0], ["India", 5.1, 4.0], ["China", 0.3, 3.0], ["Mexico", 4.4, 3.0]];
  const curve = [5.36, 4.42, 4.09, 4.18, 4.36];
  const tenor = ["3M", "2Y", "5Y", "10Y", "30Y"];
  const W = 700, H = 220;
  const X = (i) => 40 + i * 155;
  const Y = (v) => H - 30 - ((v - 3.6) / 2.2) * (H - 60);
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kicker">The Ledger</div><h2>Macro &amp; Policy</h2>
        <p>Prices, policy and the shape of the sovereign curve — the numbers that set the discount rate for everything else on these pages.</p></div>
      <div style="text-align:right"><div class="figcap" style="margin:0">US 10-year benchmark</div>
        <div class="num" style="font-size:30px">4.18%</div><div class="num dn" style="font-size:13px">−4bp</div></div>
    </div>

    <div class="cols">
      <div class="main">
        <div class="block">
          <div class="sect"><b>I.</b> The Treasury curve <span>Constant maturity, per cent</span></div>
          <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" style="display:block">
            <defs>${hatch("h2", blue)}</defs>
            ${[3.5, 4, 4.5, 5, 5.5].map((g) => `<line x1="40" x2="${W - 20}" y1="${Y(g)}" y2="${Y(g)}" stroke="#ddd7c8"/><text x="6" y="${Y(g) + 4}" font-size="10.5" fill="#6f6b62" font-family="IBM Plex Mono">${g.toFixed(1)}</text>`).join("")}
            <path d="${curve.map((v, i) => (i ? "L" : "M") + X(i) + " " + Y(v)).join(" ")} L${X(4)} ${H - 30} L40 ${H - 30} Z" fill="url(#h2)" opacity=".35"/>
            <path d="${curve.map((v, i) => (i ? "L" : "M") + X(i) + " " + Y(v)).join(" ")}" fill="none" stroke="${ink()}" stroke-width="1.6"/>
            ${curve.map((v, i) => `<g data-tip="${tenor[i]} · ${v.toFixed(2)}%"><circle cx="${X(i)}" cy="${Y(v)}" r="4" fill="#f4f1ea" stroke="${ink()}" stroke-width="1.6"/>
              <text x="${X(i)}" y="${Y(v) - 12}" font-size="11.5" font-family="IBM Plex Mono" text-anchor="middle" fill="${ink()}">${v.toFixed(2)}</text>
              <text x="${X(i)}" y="${H - 10}" font-size="11" font-family="IBM Plex Mono" text-anchor="middle" fill="#6f6b62">${tenor[i]}</text></g>`).join("")}
          </svg>
          <div class="figcap">Fig. 1 — Par yields, 9 February. The curve remains inverted between three-month bills and ten-year notes for a forty-third month.</div>
        </div>

        <div class="block">
          <div class="sect"><b>II.</b> Inflation, latest reading <span>Year on year, per cent</span></div>
          <table>
            <thead><tr><th>Economy</th><th>Headline</th><th>Target</th><th>Gap</th><th style="width:38%">Deviation</th></tr></thead>
            <tbody>
            ${infl.map((c) => { const dev = c[1] - c[2]; const w = Math.min(100, Math.abs(dev) * 40);
              return `<tr data-tip="${c[0]} ${c[1].toFixed(1)}% vs target ${c[2].toFixed(1)}%"><td>${c[0]}</td>
              <td class="num">${c[1].toFixed(1)}</td><td class="num fl">${c[2].toFixed(1)}</td>
              <td class="num ${dev > 0 ? "dn" : "up"}">${sign(dev, 1)}</td>
              <td><div class="bar" style="position:relative"><i style="width:${w}%;background:${dev > 0 ? oxb : grn}"></i>
                <span style="position:absolute;left:50%;top:-3px;width:1px;height:13px;background:#14161a"></span></div></td></tr>`; }).join("")}
            </tbody>
          </table>
          <div class="figcap">Fig. 2 — Deviation from each central bank's stated objective. Red bars sit above target.</div>
        </div>

        <div class="block">
          <div class="sect"><b>III.</b> Policy rates <span>Per cent, current target range mid-point</span></div>
          <table>
            <thead><tr><th>Central bank</th><th>Rate</th><th>Last move</th><th>Next meeting</th><th>Market expects</th></tr></thead>
            <tbody>
            ${[["Federal Reserve", 5.25, "−25bp", "18 Mar", "68% cut"], ["ECB", 4.00, "unchanged", "12 Mar", "74% hold"], ["Bank of England", 5.00, "−25bp", "20 Mar", "61% hold"],
              ["Bank of Japan", 0.25, "+15bp", "19 Mar", "44% hike"], ["SNB", 1.25, "−25bp", "21 Mar", "55% cut"], ["Bank of Canada", 4.50, "−25bp", "13 Mar", "71% cut"],
              ["Reserve Bank of Australia", 4.35, "unchanged", "18 Mar", "88% hold"], ["Bank of China", 3.10, "−10bp", "20 Feb", "52% cut"]]
              .map((b) => `<tr><td>${b[0]}</td><td class="num">${b[1].toFixed(2)}</td>
              <td class="num ${b[2].startsWith("−") ? "up" : b[2].startsWith("+") ? "dn" : "fl"}">${b[2]}</td>
              <td class="num">${b[3]}</td><td><span class="tagline">${b[4]}</span></td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="sect"><b>IV.</b> Growth &amp; labour <span>Latest quarterly and monthly readings</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
            ${[["Real GDP, q/q annualised", [["United States", 2.4], ["Euro area", 1.1], ["United Kingdom", 0.8], ["Japan", 1.6], ["China", 5.2]]],
               ["Unemployment rate, %", [["Spain", 11.2], ["Italy", 7.6], ["France", 7.4], ["United States", 4.1], ["Japan", 2.5]]]]
              .map((g) => `<div><div class="sect" style="border-bottom-width:1px;font-size:9.5px"><b>·</b> ${g[0]}</div>
                ${g[1].map((x) => `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px dotted var(--rule)">
                  <span style="width:110px;font-size:12.5px">${x[0]}</span>
                  <span class="bar" style="flex:1"><i style="width:${Math.min(100, x[1] * (g[0].includes("GDP") ? 15 : 7))}%;background:${blue}"></i></span>
                  <span class="num" style="width:46px;text-align:right;font-size:12.5px">${x[1].toFixed(1)}</span></div>`).join("")}</div>`).join("")}
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="fig" style="height:190px"><img src="images/ledger-chart.jpg" alt="A printed statistical chart from an old economic yearbook"/></div>
        <div class="figcap">From the archive: the Bureau of Economic Analysis' original chart room, 1964.</div>

        <div class="sect" style="margin-top:24px"><b>·</b> The dollar</div>
        <div class="num" style="font-size:34px">104.31</div>
        <div class="num up" style="font-size:13px">+0.35 · +0.34% on the day</div>
        ${spark(series(120, 31, 0.014, 0.0004, 100), 270, 54, blue, true)}
        <div class="figcap">Dollar index versus six majors. Weighted 57.6% euro, 13.6% yen, 11.9% sterling.</div>

        <div class="sect" style="margin-top:26px"><b>·</b> Breakevens</div>
        ${[["5-year", 2.35], ["10-year", 2.41], ["5y5y", 2.48], ["10y10y", 2.55]].map((b) => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--rule);font-size:13px">
            <span>${b[0]}</span><span class="num">${b[1].toFixed(2)}%</span></div>`).join("")}
        <div class="figcap">Implied by nominal less inflation-linked yields. The market still prices one percentage point above target over the decade.</div>

        <div class="sect" style="margin-top:26px"><b>·</b> PMI <span style="margin-left:0">Feb flash</span></div>
        ${[["Japan mfg", 50.1], ["Euro mfg", 47.4], ["US services", 53.4], ["UK composite", 52.0]].map((p) => `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px dotted var(--rule);font-size:12.5px">
            <span>${p[0]}</span><span class="num ${p[1] >= 50 ? "up" : "dn"}">${p[1].toFixed(1)}</span></div>`).join("")}
        <div class="figcap">Readings above 50 imply expansion; the horizontal rule marks the threshold.</div>

        <div class="quote">“The re-steepening, when it comes, will matter more than the cut.”</div>
        <div class="figcap">— Meridian Rates Strategy, weekly note</div>
      </aside>
    </div>
  </div>`;
}

function sectorsView() {
  const sec = [["Technology", 1.42, 29.4], ["Comm. Services", 0.94, 8.9], ["Cons. Discretionary", 0.71, 10.6], ["Health Care", 0.26, 12.1],
    ["Industrials", 0.12, 8.8], ["Materials", -0.22, 2.0], ["Financials", -0.38, 12.9], ["Cons. Staples", -0.44, 5.6],
    ["Utilities", -0.72, 2.4], ["Real Estate", -0.91, 2.0], ["Energy", -1.31, 3.3]];
  const leaders = [["NVIDIA", "NVDA", 2.41, 3420], ["TSMC", "TSM", 3.12, 880], ["Microsoft", "MSFT", 0.62, 3180], ["Eli Lilly", "LLY", -1.06, 742], ["Exxon", "XOM", -1.31, 468], ["Chevron", "CVX", -1.94, 292], ["Conoco", "COP", -2.42, 118], ["Walmart", "WMT", 0.94, 560]];
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kicker">The Register</div><h2>Sectors &amp; Companies</h2>
        <p>Where the market's money actually sits: sector returns, the largest issuers, the concentration of the index, and how styles are trading against one another.</p></div>
      <div style="text-align:right"><div class="figcap" style="margin:0">S&amp;P 500 sectors · 1 day</div>
        <div class="num" style="font-size:26px">4 up / 7 down</div></div>
    </div>

    <div class="cols">
      <div class="main">
        <div class="block">
          <div class="sect"><b>I.</b> Sector returns <span>1 day, per cent</span></div>
          <table>
            <thead><tr><th>Sector</th><th>1D</th><th>1W</th><th>YTD</th><th>Weight</th><th style="width:34%">Share of index</th></tr></thead>
            <tbody>
            ${sec.map((s) => { const w = (rnd(s[0].length)() - 0.4) * 8; const y = (rnd(s[0].length + 3)() - 0.3) * 30;
              return `<tr data-tip="${s[0]} ${sign(s[1])}% today"><td>${s[0]}</td>
              <td class="num ${s[1] >= 0 ? "up" : "dn"}">${sign(s[1])}%</td>
              <td class="num ${w >= 0 ? "up" : "dn"}">${sign(w, 1)}%</td>
              <td class="num ${y >= 0 ? "up" : "dn"}">${sign(y, 1)}%</td>
              <td class="num">${s[2].toFixed(1)}%</td>
              <td><div class="bar"><i style="width:${(s[2] / 30) * 100}%;background:${s[1] >= 0 ? grn : oxb}"></i></div></td></tr>`; }).join("")}
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="sect"><b>II.</b> The largest issuers <span>Market value, US$ trillion</span></div>
          <table>
            <thead><tr><th>#</th><th>Company</th><th>Value</th><th>1D</th><th>YTD</th><th style="width:30%">Relative size</th></tr></thead>
            <tbody>
            ${[["NVIDIA", "NVDA", 3.42, 2.41, 41.2], ["Microsoft", "MSFT", 3.18, 0.62, 12.6], ["Apple", "AAPL", 2.89, -0.34, -2.1],
              ["Alphabet", "GOOGL", 2.24, 1.18, 14.8], ["Amazon", "AMZN", 2.01, 0.87, 9.4], ["Aramco", "2222", 1.84, -0.92, -4.8],
              ["Meta", "META", 1.31, 1.94, 22.1], ["Berkshire", "BRK.B", 0.91, 0.21, 6.2]]
              .map((c, i) => `<tr><td class="num fl">${String(i + 1).padStart(2, "0")}</td>
              <td>${c[0]} <span class="num" style="color:var(--mut);font-size:11.5px">${c[1]}</span></td>
              <td class="num">$${c[2].toFixed(2)}tn</td>
              <td class="num ${c[3] >= 0 ? "up" : "dn"}">${sign(c[3])}%</td>
              <td class="num ${c[4] >= 0 ? "up" : "dn"}">${sign(c[4], 1)}%</td>
              <td><div class="bar"><i style="width:${(c[2] / 3.42) * 100}%;background:${blue}"></i></div></td></tr>`).join("")}
            </tbody>
          </table>
          <div class="figcap">Fig. 1 — Five American technology issuers now account for 21.6% of global equity value.</div>
        </div>

        <div class="block">
          <div class="sect"><b>III.</b> Growth against value <span>Rebased to 100, three years</span></div>
          <svg viewBox="0 0 760 200" width="100%" height="200" style="display:block">
            <line x1="0" y1="180" x2="760" y2="180" stroke="${ink()}"/>
            <path d="${path(series(150, 81, 0.022, 0.0011, 100), 750, 170, 8)}" fill="none" stroke="${grn}" stroke-width="1.8"/>
            <path d="${path(series(150, 82, 0.016, 0.0004, 100), 750, 170, 8)}" fill="none" stroke="${oxb}" stroke-width="1.8" stroke-dasharray="5 3"/>
            ${["2023", "2024", "2025", "2026"].map((y, i) => `<text x="${i * 248 + 4}" y="196" font-size="10.5" fill="#6f6b62" font-family="IBM Plex Mono">${y}</text>`).join("")}
          </svg>
          <div class="figcap">Fig. 2 — Solid: Russell 1000 Growth. Dashed: Russell 1000 Value. Growth's excess return over twelve quarters stands at 6.1 points annualised, the longest such run since the late 1990s.</div>
        </div>

        <div class="block">
          <div class="sect"><b>IV.</b> Movers of the day <span>Constituents, US session</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
            <table><thead><tr><th>Leaders</th><th>Close</th><th>%</th></tr></thead><tbody>
              ${leaders.filter((l) => l[2] > 0).map((l) => `<tr><td>${l[0]} <span class="num" style="color:var(--mut);font-size:11.5px">${l[1]}</span></td><td class="num">${l[3]}</td><td class="num up">${sign(l[2])}%</td></tr>`).join("")}
            </tbody></table>
            <table><thead><tr><th>Laggards</th><th>Close</th><th>%</th></tr></thead><tbody>
              ${leaders.filter((l) => l[2] < 0).map((l) => `<tr><td>${l[0]} <span class="num" style="color:var(--mut);font-size:11.5px">${l[1]}</span></td><td class="num">${l[3]}</td><td class="num dn">${sign(l[2])}%</td></tr>`).join("")}
            </tbody></table>
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="sect"><b>·</b> Concentration</div>
        <div class="num" style="font-size:52px;font-family:'Fraunces';letter-spacing:-.02em">36.4%</div>
        <p class="body" style="font-size:13.5px;margin-top:4px">of the index's twelve-month return came from its ten largest constituents. In an average year since 1980 the figure is 18%.</p>
        <div class="bar" style="margin:12px 0"><i style="width:36.4%;background:${oxb}"></i></div>
        ${[["NVDA", 9.1], ["AAPL", 7.4], ["MSFT", 6.8], ["AMZN", 4.2], ["META", 3.6]].map((c) => `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px dotted var(--rule);font-size:12.5px"><span>${c[0]}</span><span class="num">${c[1]}%</span></div>`).join("")}

        <div class="sect" style="margin-top:26px"><b>·</b> Advance / decline</div>
        <div style="display:flex;height:26px;border:1px solid var(--ink)">
          <span style="width:51.2%;background:${grn};color:#f4f1ea;display:flex;align-items:center;justify-content:center;font:700 11px 'IBM Plex Mono'">257</span>
          <span style="width:48.8%;background:${oxb};color:#f4f1ea;display:flex;align-items:center;justify-content:center;font:700 11px 'IBM Plex Mono'">246</span>
        </div>
        <div class="figcap">Advancing against declining constituents at the close. Ratio 1.04.</div>

        <div class="sect" style="margin-top:26px"><b>·</b> Positioning <span style="margin-left:0">prime brokers</span></div>
        ${[["Technology", "overweight"], ["Energy", "underweight"], ["Health care", "neutral"], ["Financials", "overweight"], ["Staples", "underweight"]].map((p) => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--rule);font-size:12.5px">
            <span>${p[0]}</span><span class="tagline ${p[1] === "overweight" ? "g" : p[1] === "underweight" ? "o" : ""}">${p[1]}</span></div>`).join("")}

        <div class="sect" style="margin-top:26px"><b>·</b> Thematic baskets <span style="margin-left:0">YTD</span></div>
        ${[["Artificial intelligence", 38.4], ["Quantum computing", 44.8], ["Obesity drugs", 26.1], ["Uranium", 22.7], ["Clean energy", -14.2]].map((t) => `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px dotted var(--rule);font-size:12.5px">
            <span>${t[0]}</span><span class="num ${t[1] >= 0 ? "up" : "dn"}">${sign(t[1], 1)}%</span></div>`).join("")}
      </aside>
    </div>
  </div>`;
}

function diary() {
  const days = [
    ["Mon 09", [["08:30", "Non-farm payrolls", "185k cons · high"], ["10:00", "Wholesale inventories", "0.2% cons · low"]]],
    ["Tue 10", [["07:00", "UK unemployment", "4.0% cons · med"], ["10:00", "ZEW sentiment", "21.4 cons · med"]]],
    ["Wed 11", [["08:30", "US CPI y/y", "3.1% cons · high"], ["14:00", "FOMC minutes", "— · high"]]],
    ["Thu 12", [["08:30", "Jobless claims", "212k cons · med"], ["12:45", "ECB rate decision", "4.00% held · high"]]],
    ["Fri 13", [["01:30", "China industrial output", "5.2% cons · med"], ["08:30", "US retail sales", "+0.4% cons · high"]]],
  ];
  const earn = [["Monday", "AAPL", "Apple", "after close", 2.11, 4.2], ["Monday", "MCD", "McDonald's", "before open", 2.83, 2.8],
    ["Tuesday", "AMD", "AMD", "after close", 0.77, 7.4], ["Wednesday", "DIS", "Disney", "after close", 1.12, 6.1],
    ["Wednesday", "UBER", "Uber", "before open", 0.31, 6.8], ["Thursday", "NFLX", "Netflix", "after close", 4.48, 8.9],
    ["Thursday", "PEP", "PepsiCo", "before open", 1.72, 2.6], ["Friday", "ENB", "Enbridge", "before open", 0.62, 2.2]];
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kicker">The Diary</div><h2>Schedule &amp; Events</h2>
        <p>The week ahead: economic releases, policy meetings, results dates, dividends and auctions — with the market impact each is expected to carry.</p></div>
      <div style="text-align:right"><div class="figcap" style="margin:0">Week of</div>
        <div class="num" style="font-size:24px">9 – 13 February 2026</div><div class="num" style="font-size:12.5px">142 earnings · 21 releases</div></div>
    </div>

    <div class="cols">
      <div class="main">
        <div class="block">
          <div class="sect"><b>I.</b> The week ahead <span>All times Eastern</span></div>
          <div class="week">
            ${days.map((d) => `<div>
              <div class="day"><span>${d[0]}</span><span>${d[1].length}</span></div>
              ${d[1].map((e) => `<div class="ev" data-tip="${e[1]} · ${e[0]} ET"><span class="m">${e[0]} · <span class="imp">${e[2].split("·")[1].trim() === "high" ? "HIGH IMPACT" : e[2].split("·")[1].trim() === "med" ? "MEDIUM" : "LOW"}</span></span><b>${e[1]}</b><span class="m">${e[2].split("·")[0].trim()}</span></div>`).join("")}
            </div>`).join("")}
          </div>
          <div class="figcap">Fig. 1 — Wednesday's CPI and minutes, and Thursday's ECB decision, are the week's three fixed points.</div>
        </div>

        <div class="block">
          <div class="sect"><b>II.</b> Earnings <span>Consensus and implied move</span></div>
          <table>
            <thead><tr><th>Day</th><th>Company</th><th>Timing</th><th>Cons. EPS</th><th>Revenue</th><th>Implied move</th></tr></thead>
            <tbody>
            ${earn.map((e) => `<tr><td class="num">${e[0]}</td><td>${e[2]} <span class="num" style="color:var(--mut);font-size:11.5px">${e[1]}</span></td>
              <td class="num fl">${e[3]}</td><td class="num">${e[4].toFixed(2)}</td>
              <td class="num">$${(e[4] * 24).toFixed(1)}bn</td>
              <td class="num dn">±${e[5].toFixed(1)}%</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="sect"><b>III.</b> Ex-dividend dates <span>Next ten sessions</span></div>
          <table>
            <thead><tr><th>Company</th><th>XD date</th><th>Payment</th><th>Yield</th><th>Qualifying</th></tr></thead>
            <tbody>
            ${[["Exxon Mobil", "12 Feb", "0.95", "3.34%", "quarterly"], ["Johnson & Johnson", "13 Feb", "1.19", "3.11%", "quarterly"],
              ["Realty Income", "13 Feb", "0.265", "5.62%", "monthly"], ["Unilever", "16 Feb", "0.42", "3.94%", "quarterly"],
              ["Shell", "17 Feb", "0.345", "4.02%", "quarterly"], ["Pfizer", "18 Feb", "0.43", "5.94%", "quarterly"]]
              .map((d) => `<tr><td>${d[0]}</td><td class="num">${d[1]}</td><td class="num">$${d[2]}</td><td class="num">${d[3]}</td><td class="fl" style="text-align:right">${d[4]}</td></tr>`).join("")}
            </tbody>
          </table>
          <div class="figcap">Fig. 2 — Combined yield of the twelve largest payers going ex this fortnight: 4.18%, versus 1.32% for the index.</div>
        </div>
      </div>

      <aside class="rail">
        <div class="sect"><b>·</b> Next policy decision</div>
        <div style="border:1px solid var(--ink);padding:14px;margin-top:4px">
          <div class="num" style="font-size:34px;letter-spacing:-.02em">37 days</div>
          <div class="figcap" style="margin-top:2px">to the Federal Reserve · Wednesday 18 March, 14:00 ET</div>
          <div class="bar" style="margin:12px 0 8px"><i style="width:34%;background:${blue}"></i></div>
          <div class="figcap" style="margin-top:0">34% of the inter-meeting period has elapsed.</div>
          <div style="border-top:1px dotted var(--rule);margin-top:10px;padding-top:8px">
            ${[["Cut 25bp", 68], ["Hold", 30], ["Cut 50bp", 2]].map((p) => `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0"><span>${p[0]}</span><span class="num">${p[1]}%</span></div>`).join("")}
          </div>
        </div>

        <div class="sect" style="margin-top:26px"><b>·</b> Countdowns</div>
        ${[["Disney Q1", "today · after close"], ["Netflix results", "Thu · after close"], ["ECB decision", "3 days · 12:45"], ["UK budget", "17 days · 26 Feb"]]
          .map((c) => `<div style="display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--rule);font-size:12.5px">
            <span>${c[0]}</span><span class="num" style="color:var(--oxb);white-space:nowrap">${c[1]}</span></div>`).join("")}

        <div class="sect" style="margin-top:26px"><b>·</b> Auctions</div>
        ${[["11 Feb", "3-year · $58bn"], ["12 Feb", "10-year · $42bn"], ["13 Feb", "30-year · $25bn"], ["17 Feb", "4-week bills · $75bn"]]
          .map((a) => `<div class="ev"><span class="m">${a[0]}</span><b>${a[1]}</b></div>`).join("")}

        <div class="quote">“Diary days cluster: three of the last four weeks have held at least two red-flag sessions.”</div>
      </aside>
    </div>
  </div>`;
}

const NAV = [
  { id: "front", n: "I", label: "Front page" },
  { id: "macro", n: "II", label: "Macro & Policy" },
  { id: "sectors", n: "III", label: "Sectors & Companies" },
  { id: "diary", n: "IV", label: "Schedule" },
];

const VIEWS = {
  front: { title: "Front Page", html: front },
  macro: { title: "Macro & Policy", html: macro },
  sectors: { title: "Sectors & Companies", html: sectorsView },
  diary: { title: "Schedule & Events", html: diary },
};

function shell(page, ctx) {
  return `
  <div class="ledger">
    <style>${CSS}</style>
    <div class="alert"><div class="wrap">
      <span><b>MARKET</b> S&amp;P 500 4,922.41 <span class="up">+0.62%</span></span>
      <span><b>10Y</b> 4.18% <span class="up">−4bp</span></span>
      <span><b>DXY</b> 104.31 <span class="dn">+0.34%</span></span>
      <span><b>BRENT</b> $82.14 <span class="dn">−1.24%</span></span>
      <span><b>GOLD</b> $2,412 <span class="up">+0.81%</span></span>
      <span><b>NEW YORK</b> OPEN</span>
    </div></div>
    <header class="mast"><div class="wrap">
      <div class="mast-top"><span>Meridian Research</span><span>Vol. XII — No. 1,204</span><span>Simulated edition</span></div>
      <div class="wordmark">The Meridian <i>Ledger</i></div>
      <div class="strap">
        <span>MONDAY, 9 FEBRUARY 2026</span><span>LONDON · NEW YORK · SINGAPORE</span>
        <span data-clock="UTC">—</span><span>15 MINUTES DELAYED</span>
      </div>
      <nav class="nav">${NAV.map((n) => `<a href="#/ledger/${n.id}" class="${n.id === ctx.pKey ? "on" : ""}"><b>${n.n}</b>${n.label}</a>`).join("")}</nav>
    </div></header>
    <main>${page.html()}</main>
    <div class="wrap"><div class="folio">
      <span>THE MERIDIAN LEDGER · 9 FEBRUARY 2026</span>
      <span>ALL FIGURES SIMULATED. FOR DESIGN REVIEW ONLY.</span>
      <span>PAGE 4 — MARKETS</span>
    </div></div>
  </div>`;
}

export const ledger = { id: "ledger", name: "Design B · The Meridian Ledger", short: "LEDGER · BROADSHEET", shell, views: VIEWS, nav: NAV };
