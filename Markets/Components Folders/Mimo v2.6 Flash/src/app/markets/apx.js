import { series, spark, chart, path, area, sign, rnd, wireSeg } from "./kit";

/* ============================ APX — dark trading terminal ============================ */

const INDICES = [
  ["S&P 500", "SPX", 4922.41, 0.62, 1.4, 4.1, 98],
  ["Nasdaq 100", "NDX", 17482.9, 0.94, 2.2, 6.8, 97],
  ["Dow Jones Industrial", "DJI", 38654.2, 0.21, 0.7, 2.4, 94],
  ["Russell 2000", "RUT", 1984.3, -0.44, -1.2, 1.9, 71],
  ["FTSE 100", "UKX", 7684.2, -0.18, 0.3, 2.1, 74],
  ["DAX", "DAX", 16992.7, 0.44, 1.1, 7.8, 96],
  ["Nikkei 225", "NKY", 38412.7, 1.86, 3.4, 16.9, 99],
  ["Hang Seng", "HSI", 16224.1, -2.05, -3.8, -6.3, 18],
  ["Shanghai Composite", "SHC", 3018.4, -1.47, -2.1, -1.4, 44],
  ["MSCI Emerging", "MXEF", 1042.6, -0.62, -0.9, 2.7, 52],
  ["STOXX Europe 600", "SXXP", 512.4, 0.31, 0.9, 5.2, 95],
  ["ASX 200", "AS51", 7612.3, -0.36, 0.4, 0.8, 81],
];

const SECTORS = {
  "1D": [["Technology", 1.42], ["Comm. Services", 0.94], ["Cons. Discretionary", 0.71], ["Health Care", 0.26], ["Industrials", 0.12], ["Materials", -0.22], ["Financials", -0.38], ["Cons. Staples", -0.44], ["Utilities", -0.72], ["Real Estate", -0.91], ["Energy", -1.31]],
  "5D": [["Technology", 3.18], ["Comm. Services", 2.04], ["Health Care", 0.88], ["Industrials", 0.54], ["Financials", -0.21], ["Cons. Discretionary", 1.62], ["Materials", -0.74], ["Cons. Staples", -1.12], ["Utilities", -1.44], ["Real Estate", -2.06], ["Energy", -3.41]],
  "1M": [["Technology", 5.9], ["Comm. Services", 4.1], ["Financials", 2.6], ["Industrials", 2.1], ["Health Care", 1.4], ["Cons. Discretionary", 0.9], ["Materials", -0.4], ["Cons. Staples", -1.8], ["Utilities", -2.4], ["Energy", -3.1], ["Real Estate", -4.2]],
};

const CURVES = {
  Today: [5.39, 5.36, 5.24, 4.84, 4.42, 4.22, 4.09, 4.18, 4.47, 4.36],
  "1M ago": [5.41, 5.4, 5.31, 4.97, 4.61, 4.41, 4.28, 4.34, 4.6, 4.48],
  "1Y ago": [4.62, 4.85, 5.07, 5.02, 4.88, 4.54, 4.14, 4.06, 4.32, 4.14],
  "3Y ago": [0.04, 0.06, 0.09, 0.14, 0.51, 0.96, 1.58, 1.92, 2.35, 2.32],
};
const TENORS = ["1M", "3M", "6M", "1Y", "2Y", "5Y", "7Y", "10Y", "20Y", "30Y"];
const CX = TENORS.map((_, i) => i / 9);

function curveSVG(key, color = "#ffb020") {
  const v = CURVES[key];
  const W = 760, H = 230;
  const X = (i) => 34 + CX[i] * (W - 74);
  const Y = (y) => H - 26 - (y / 6) * (H - 52);
  const line = v.map((y, i) => (i ? "L" : "M") + X(i) + " " + Y(y)).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" style="display:block;color:#6d7783">
    ${[0, 1, 2, 3, 4, 5, 6].map((g) => `<line x1="34" x2="${W - 40}" y1="${Y(g)}" y2="${Y(g)}" stroke="currentColor" stroke-opacity=".14"/><text x="4" y="${Y(g) + 3.5}" font-size="9.5" font-family="IBM Plex Mono" fill="currentColor" opacity=".7">${g}%</text>`).join("")}
    <path d="${line} L${X(9)} ${H - 26} L34 ${H - 26} Z" fill="${color}" opacity=".1"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>
    ${v.map((y, i) => `<g data-tip="${TENORS[i]} · ${y.toFixed(2)}%"><circle cx="${X(i)}" cy="${Y(y)}" r="4" fill="#06080a" stroke="${color}" stroke-width="2"/>
      <text x="${X(i)}" y="${Y(y) - 11}" font-size="9.5" font-family="IBM Plex Mono" fill="#dfe5ea" text-anchor="middle">${y.toFixed(2)}</text>
      <text x="${X(i)}" y="${H - 6}" font-size="9.5" font-family="IBM Plex Mono" fill="currentColor" text-anchor="middle" opacity=".7">${TENORS[i]}</text></g>`).join("")}
  </svg>`;
}

const heat = (p, max) => {
  const t = Math.max(-1, Math.min(1, p / (max || 3)));
  return t >= 0
    ? `background:rgba(41,208,139,${(0.1 + 0.5 * t).toFixed(2)});box-shadow:inset 0 0 0 1px rgba(41,208,139,${(0.25 + 0.5 * t).toFixed(2)})`
    : `background:rgba(255,84,112,${(0.1 + 0.5 * -t).toFixed(2)});box-shadow:inset 0 0 0 1px rgba(255,84,112,${(0.25 + 0.5 * -t).toFixed(2)})`;
};

const CSS = `
.apx{--bg:#06080a;--pnl:#0a0d11;--pnl2:#0e1217;--line:#1b2027;--line2:#262d36;--tx:#dfe5ea;--dim:#7c8695;--up:#29d08b;--dn:#ff5470;--acc:#ffb020;
 background:var(--bg);color:var(--tx);min-height:100vh;font-family:'Inter',system-ui,sans-serif}
.apx *{box-sizing:border-box}
.apx .mono{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums}
.apx .up{color:var(--up)} .apx .dn{color:var(--dn)} .apx .fl{color:var(--dim)}
.apx a{color:inherit;text-decoration:none}
.apx .wrap{max-width:1440px;margin:0 auto;padding:0 26px}
.apx .hdr{position:sticky;top:0;z-index:50;background:rgba(6,8,10,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.apx .hdr-in{display:flex;align-items:center;gap:26px;height:56px}
.apx .mark{font-family:'Archivo',sans-serif;font-weight:800;letter-spacing:-.02em;font-size:17px;display:flex;align-items:center;gap:9px}
.apx .mark i{width:9px;height:9px;background:var(--acc);display:block}
.apx .mark small{font:600 9.5px 'IBM Plex Mono';letter-spacing:.2em;color:var(--dim);border-left:1px solid var(--line2);padding-left:9px}
.apx nav{display:flex;gap:2px;margin-left:8px;overflow:auto}
.apx nav a{font:600 11px 'IBM Plex Mono';letter-spacing:.13em;text-transform:uppercase;color:var(--dim);padding:18px 13px;border-bottom:2px solid transparent;white-space:nowrap;transition:.15s}
.apx nav a:hover{color:var(--tx);background:rgba(255,255,255,.03)}
.apx nav a.on{color:var(--acc);border-bottom-color:var(--acc)}
.apx .rt{margin-left:auto;display:flex;align-items:center;gap:16px}
.apx .live{font:600 10px 'IBM Plex Mono';letter-spacing:.14em;color:var(--up);display:flex;align-items:center;gap:6px}
.apx .live b{width:7px;height:7px;border-radius:99px;background:var(--up);animation:apx 1.8s infinite}
@keyframes apx{0%{box-shadow:0 0 0 0 rgba(41,208,139,.6)}70%{box-shadow:0 0 0 7px rgba(41,208,139,0)}100%{box-shadow:0 0 0 0 rgba(41,208,139,0)}}
.apx .clk{font:500 12px 'IBM Plex Mono';color:var(--dim)}
.apx .marq{border-bottom:1px solid var(--line);background:var(--pnl);overflow:hidden;white-space:nowrap}
.apx .marq .track{display:inline-block;padding:9px 0;animation:mqa 46s linear infinite}
.apx .marq:hover .track{animation-play-state:paused}
@keyframes mqa{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.apx .marq span{padding:0 20px;border-right:1px solid var(--line);font:500 12px 'IBM Plex Mono'}
.apx .marq b{color:var(--dim);font-weight:500;letter-spacing:.06em}
.apx .hero{position:relative;border-bottom:1px solid var(--line);overflow:hidden}
.apx .hero .bg{position:absolute;inset:0;background:url(images/apx-hero.jpg) center/cover;opacity:.5;filter:saturate(.7) contrast(1.05)}
.apx .hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,8,10,.35),rgba(6,8,10,.94))}
.apx .hero-in{position:relative;z-index:2;padding:34px 0 26px;display:flex;gap:34px;align-items:flex-end;flex-wrap:wrap}
.apx h1{font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(38px,6vw,74px);line-height:.9;letter-spacing:-.035em;margin:0;text-transform:uppercase}
.apx .kick{font:600 10.5px 'IBM Plex Mono';letter-spacing:.24em;color:var(--acc);margin-bottom:12px}
.apx .stats{margin-left:auto;display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.apx .stats div{background:rgba(8,11,14,.8);padding:11px 14px}
.apx .stats .k{font:600 9.5px 'IBM Plex Mono';letter-spacing:.13em;color:var(--dim)}
.apx .stats .v{font:600 18px 'IBM Plex Mono';margin-top:3px}
.apx .stats .c{font:500 11px 'IBM Plex Mono'}
.apx main{padding:26px 0 70px}
.apx .cols{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px;align-items:start}
@media (max-width:1050px){.apx .cols{grid-template-columns:1fr}}
.apx .pnl{background:var(--pnl);border:1px solid var(--line);margin-bottom:20px}
.apx .pnl>h3{margin:0;padding:13px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;
  font:600 11px 'IBM Plex Mono';letter-spacing:.17em;text-transform:uppercase;color:var(--dim)}
.apx .pnl>h3 i{color:var(--acc);font-style:normal}
.apx .pnl>h3 .seg{margin-left:auto}
.apx .pad{padding:16px}
.apx .seg{display:flex;border:1px solid var(--line2);border-radius:3px;overflow:hidden}
.apx .seg button{background:transparent;border:0;color:var(--dim);font:600 10px 'IBM Plex Mono';letter-spacing:.1em;padding:6px 10px;cursor:pointer;text-transform:uppercase}
.apx .seg button:hover{color:var(--tx)}
.apx .seg button.on{background:var(--acc);color:#0a0c10}
.apx table{width:100%;border-collapse:collapse}
.apx th{font:600 9.5px 'IBM Plex Mono';letter-spacing:.14em;text-transform:uppercase;color:var(--dim);text-align:right;padding:9px 14px;border-bottom:1px solid var(--line)}
.apx th:first-child,.apx td:first-child{text-align:left}
.apx td{padding:9px 14px;font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.045);text-align:right}
.apx tbody tr:hover{background:rgba(255,176,32,.05)}
.apx .tk{font:600 11px 'IBM Plex Mono';color:var(--dim);letter-spacing:.06em}
.apx .nm{font-weight:600}
.apx .heat{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
@media (max-width:700px){.apx .heat{grid-template-columns:repeat(2,1fr)}}
.apx .heat b{display:block;padding:12px;border-radius:2px;min-height:78px;font-weight:600;font-size:12px;position:relative;transition:.15s;cursor:default}
.apx .heat b:hover{transform:translateY(-2px)}
.apx .heat b span{position:absolute;left:12px;bottom:10px;font-family:'IBM Plex Mono';font-size:15px}
.apx .heat b em{position:absolute;right:10px;top:9px;font:600 9px 'IBM Plex Mono';font-style:normal;opacity:.7}
.apx .kv{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12.5px}
.apx .kv:last-child{border-bottom:0}
.apx .kv span{color:var(--dim)}
.apx .bignum{font:700 52px 'Archivo';letter-spacing:-.03em;line-height:1}
.apx .bd{display:flex;height:10px;overflow:hidden;border-radius:2px;background:var(--pnl2)}
.apx .bd i{display:block;height:100%}
.apx .tag{font:600 10px 'IBM Plex Mono';letter-spacing:.1em;padding:3px 7px;border:1px solid var(--line2);border-radius:2px;color:var(--dim);text-transform:uppercase}
.apx .tag.u{color:var(--up);border-color:rgba(41,208,139,.4);background:rgba(41,208,139,.08)}
.apx .tag.d{color:var(--dn);border-color:rgba(255,84,112,.4);background:rgba(255,84,112,.08)}
.apx .tag.a{color:var(--acc);border-color:rgba(255,176,32,.4);background:rgba(255,176,32,.08)}
.apx .two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media (max-width:860px){.apx .two{grid-template-columns:1fr}}
.apx .rail .pnl{margin-bottom:16px}
.apx .evt{display:flex;gap:12px;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.05);cursor:default}
.apx .evt:hover{background:rgba(255,255,255,.03)}
.apx .evt .t{font:500 11px 'IBM Plex Mono';color:var(--acc);width:44px;flex:none}
.apx .evt .n{font-size:12.5px;font-weight:600}
.apx .evt .s{font:500 11px 'IBM Plex Mono';color:var(--dim);margin-top:2px}
.apx .st{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid rgba(255,255,255,.05);font-size:12.5px}
.apx .st b{font:600 10px 'IBM Plex Mono';letter-spacing:.1em}
.apx .st .o{color:var(--up)} .apx .st .c{color:var(--dim)}
.apx .dots i{display:inline-block;width:6px;height:6px;border-radius:99px;margin-right:4px}
.apx .ft{border-top:1px solid var(--line);padding:22px 0 40px;color:var(--dim);font:500 11px 'IBM Plex Mono';display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
.apx .note{font:500 11px 'IBM Plex Mono';color:var(--dim);letter-spacing:.04em}
.apx .pagehd{padding:26px 0 18px;border-bottom:1px solid var(--line);display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap}
.apx .pagehd h2{font-family:'Archivo';font-weight:800;font-size:34px;letter-spacing:-.03em;margin:0;text-transform:uppercase}
.apx .pagehd p{margin:6px 0 0;color:var(--dim);font-size:13px;max-width:640px}
.apx .pagehd .rt{margin-left:auto;text-align:right}
@media (max-width:880px){.apx .pnl{overflow-x:auto}.apx table{min-width:620px}.apx .hdr-in{gap:12px}.apx .stats{grid-template-columns:repeat(2,1fr)}.apx .hero-in{padding:26px 0 22px}}
@media (prefers-reduced-motion:reduce){.apx .marq .track,.apx .live b{animation:none}}
.legend{display:flex;gap:8px;flex-wrap:wrap}
.legend button{background:transparent;border:1px solid var(--line2);color:var(--dim);font:600 10.5px 'IBM Plex Mono';padding:5px 9px;cursor:pointer;display:flex;gap:7px;align-items:center;border-radius:2px}
.legend button.on{color:var(--tx);border-color:currentColor}
.legend button i{width:9px;height:2px;display:block}
`;

const TICK = [
  ["SPX", 4922.41, 0.62], ["NDX", 17482.9, 0.94], ["VIX", 13.92, -4.21], ["US10Y", 4.18, -0.04],
  ["DXY", 104.31, 0.34], ["EURUSD", 1.0891, -0.28], ["USDJPY", 151.42, 0.62], ["BRENT", 82.14, -1.24],
  ["GOLD", 2412.6, 0.81], ["COPPER", 4.21, 1.14], ["BTC", 68412, 2.14], ["SPX500 FUT", 4931.5, 0.58],
];

function tickerMarquee() {
  const one = TICK.map(
    (t) => `<span><b>${t[0]}</b> ${t[1].toLocaleString(undefined, { maximumFractionDigits: 4 })} <em style="font-style:normal;color:${t[2] >= 0 ? "var(--up)" : "var(--dn)"}">${sign(t[2])}%</em></span>`
  ).join("");
  return `<div class="marq"><div class="track">${one}${one}</div></div>`;
}

function sparkRow(seed, up, w = 84, h = 20) {
  return spark(series(44, seed, 0.03, up ? 0.0012 : -0.0012, 100), w, h, up ? "#29d08b" : "#ff5470", false);
}

/* --------------------------- VIEWS --------------------------- */

function overview() {
  const adv = 257, dec = 246;
  const buckets = [["<-5", 18], ["-5/-3", 44], ["-3/-1", 96], ["-1/0", 88], ["0/+1", 102], ["+1/+3", 94], ["+3/+5", 41], [">+5", 20]];
  return `
  <section class="hero">
    <div class="bg"></div>
    <div class="wrap hero-in">
      <div>
        <div class="kick">MERIDIAN · MARKETS DESK · 09 FEB 2026</div>
        <h1>Markets<br>open higher</h1>
        <p style="max-width:520px;color:#a9b2c0;font-size:13.5px;line-height:1.6;margin:16px 0 0">
          A cooler US CPI has revived the rate-cut trade: the whole curve is lower, chips are carrying the index,
          and energy is the only sector down more than a percent. Breadth is positive but narrow.
        </p>
      </div>
      <div class="stats">
        ${[["S&P 500", "4,922.41", "+0.62%", "up"], ["US 10Y", "4.18%", "−4bp", "up"], ["DXY", "104.31", "+0.34%", "dn"],
            ["BRENT", "$82.14", "−1.24%", "dn"], ["VIX", "13.92", "−4.21%", "up"], ["BTC", "$68,412", "+2.14%", "up"]]
          .map((s) => `<div><div class="k">${s[0]}</div><div class="v">${s[1]}</div><div class="c ${s[3]}">${s[2]}</div></div>`).join("")}
      </div>
    </div>
  </section>

  <div class="wrap">
    <div class="cols" style="padding-top:26px">
      <div>
        <div class="pnl">
          <h3><i>01</i> Session board <span class="tag">12 indices · live</span>
            <span class="seg"><button class="on">Level</button><button>1D %</button><button>YTD</button></span></h3>
          <div class="pad" style="padding-top:4px">
            <table><thead><tr><th>Index</th><th>Ticker</th><th>Last</th><th>1D</th><th>1M</th><th>52w pos</th><th style="width:96px">Session</th></tr></thead><tbody>
            ${INDICES.map((r, i) => `<tr>
              <td class="nm">${r[0]}</td><td class="tk">${r[1]}</td>
              <td class="mono">${r[2].toLocaleString()}</td>
              <td class="mono ${r[3] >= 0 ? "up" : "dn"}">${sign(r[3])}%</td>
              <td class="mono ${r[4] >= 0 ? "up" : "dn"}">${sign(r[4], 1)}%</td>
              <td style="min-width:110px"><div style="position:relative;height:6px;background:#161b22;border-radius:1px" data-tip="52w range position ${r[6]}%">
                <i style="position:absolute;left:0;top:0;bottom:0;width:${r[6]}%;background:${r[6] > 70 ? "#29d08b" : r[6] < 35 ? "#ff5470" : "#5aa9ff"};display:block"></i>
                <i style="position:absolute;left:${r[6]}%;top:-3px;width:2px;height:12px;background:#dfe5ea;display:block"></i></div></td>
              <td style="width:96px">${sparkRow(i + 3, r[3] >= 0)}</td></tr>`).join("")}
            </tbody></table>
          </div>
        </div>

        <div class="pnl">
          <h3><i>02</i> Market breadth <span class="tag u">Confirming</span></h3>
          <div class="pad">
            <div class="bd" style="margin-bottom:14px" data-tip="257 advancing / 246 declining">
              <i style="width:51.2%;background:linear-gradient(90deg,#0e6c48,#29d08b)"></i>
              <i style="width:48.8%;background:linear-gradient(90deg,#ff5470,#7a1f2e)"></i>
            </div>
            <svg viewBox="0 0 760 140" width="100%" height="140" style="display:block">
              ${buckets.map((b, i) => { const h = (b[1] / 110) * 110; const x = i * 95 + 6;
                return `<g data-tip="${b[0]}% : ${b[1]} stocks"><rect x="${x}" y="${118 - h}" width="76" height="${h}" fill="${i < 4 ? "#ff5470" : "#29d08b"}" opacity=".78"/>
                  <text x="${x + 38}" y="${110 - h}" font-size="11" font-family="IBM Plex Mono" fill="#dfe5ea" text-anchor="middle">${b[1]}</text>
                  <text x="${x + 38}" y="${134}" font-size="9.5" font-family="IBM Plex Mono" fill="#7c8695" text-anchor="middle">${b[0]}%</text></g>`; }).join("")}
            </svg>
            <div class="two" style="gap:14px;margin-top:6px">
              ${[["Advance / decline", "1.04"], ["Up volume share", "56.2%"], ["New highs − lows", "+38"], ["% above 200DMA", "68%"]]
                .map((k) => `<div class="kv"><span>${k[0]}</span><b class="mono">${k[1]}</b></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>03</i> US treasury curve
            <span class="seg" data-seg-group="yc">
              <button data-seg="Today" class="on">Today</button><button data-seg="1M ago">1M ago</button>
              <button data-seg="1Y ago">1Y ago</button><button data-seg="3Y ago">3Y ago</button></span></h3>
          <div class="pad">
            <div id="ycHost">${curveSVG("Today")}</div>
            <div class="two" style="gap:14px;margin-top:8px">
              ${[["2s10s", "−24bp", "dn"], ["3M10Y", "−118bp", "dn"], ["5s30s", "+27bp", "up"], ["Curve state", "INVERTED 43M", "dn"]]
                .map((k) => `<div class="kv"><span>${k[0]}</span><b class="mono ${k[2]}">${k[1]}</b></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>04</i> Sector heat
            <span class="seg" data-seg-group="sh"><button data-seg="1D" class="on">1D</button><button data-seg="5D">5D</button><button data-seg="1M">1M</button></span></h3>
          <div class="pad">
            ${Object.keys(SECTORS).map((k) => `<div class="heat" data-seg-target="sh" data-seg-view="${k}" style="${k === "1D" ? "" : "display:none"}">
              ${SECTORS[k].map((s, i) => `<b style="${heat(s[1], k === "1M" ? 6 : 3)}" data-tip="${s[0]} ${sign(s[1], 2)}% · ${k}">
                ${s[0]}<em>${i + 1}</em><span>${sign(s[1])}%</span></b>`).join("")}</div>`).join("")}
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="pnl">
          <h3><i>05</i> Sentiment</h3>
          <div class="pad" style="text-align:center">
            <div class="bignum" style="color:var(--up)">63</div>
            <div class="tag u" style="margin-top:6px">GREED · +2 on the day</div>
            <div style="margin-top:16px;text-align:left">
              ${[["Momentum", 78], ["Price strength", 64], ["Breadth", 55], ["Put/call", 71], ["Volatility", 60], ["Safe haven", 48], ["Junk demand", 69]]
                .map((s) => `<div style="margin-bottom:9px"><div class="kv" style="border:0;padding:0 0 4px"><span>${s[0]}</span><b class="mono">${s[1]}</b></div>
                  <div style="height:5px;background:#141920;border-radius:1px"><i style="display:block;height:5px;width:${s[1]}%;background:${s[1] > 60 ? "#29d08b" : s[1] < 50 ? "#ffb020" : "#5aa9ff"};border-radius:1px"></i></div></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>06</i> Next up</h3>
          ${[["11:00", "US 3-year auction", "$58bn · WI 4.31%"], ["12:45", "ECB press conference", "Deposit 4.00% · hold expected"], ["AMC", "Disney Q1 results", "EPS $1.12 · implied ±6.1%"]]
            .map((e) => `<div class="evt"><span class="t">${e[0]}</span><div><div class="n">${e[1]}</div><div class="s">${e[2]}</div></div></div>`).join("")}
        </div>

        <div class="pnl">
          <h3><i>07</i> Biggest mover</h3>
          <div class="pad">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:40px;height:40px;background:#12192a;border:1px solid var(--line2);display:grid;place-items:center;font:800 13px 'Archivo';color:#5aa9ff">SM</div>
              <div><b>SMCI</b><div class="note">Super Micro Computer</div></div>
              <div style="margin-left:auto;text-align:right"><div class="mono" style="font-size:26px;color:var(--up)">+18.4%</div><div class="note">$1,042.18</div></div>
            </div>
            <div style="margin-top:12px">${spark(series(50, 11, 0.04, 0.006, 880), 300, 54, "#29d08b", true)}</div>
            <div class="kv"><span>Volume</span><b class="mono">6.2× 30d avg</b></div>
            <div class="kv"><span>Catalyst</span><b>FY guidance raised to $26bn</b></div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>08</i> Exchange status</h3>
          ${[["New York", "OPEN", "closes 3h 18m", 1], ["London", "OPEN", "closes 2h 48m", 1], ["Frankfurt", "OPEN", "closes 2h 48m", 1], ["Tokyo", "CLOSED", "opens 11h 18m", 0], ["Hong Kong", "CLOSED", "opens 8h 18m", 0]]
            .map((e) => `<div class="st"><span>${e[0]}</span><span class="note">${e[2]}</span><b class="${e[3] ? "o" : "c"}">${e[1]}</b></div>`).join("")}
          <div class="pad" style="padding-top:12px"><div class="note">DATA FRESHNESS · composite feed, 15m delayed · last tick <span data-clock="America/New_York">—</span></div></div>
        </div>
      </aside>
    </div>
  </div>`;
}

function indicesView() {
  const seriesSets = [
    ["S&P 500", "#ffb020", series(160, 5, 0.02, 0.0011, 100)],
    ["Nasdaq 100", "#29d08b", series(160, 9, 0.022, 0.0016, 100)],
    ["FTSE 100", "#5aa9ff", series(160, 15, 0.015, 0.0003, 100)],
    ["Nikkei 225", "#ff5470", series(160, 21, 0.02, 0.0013, 100)],
    ["Hang Seng", "#b47cff", series(160, 33, 0.028, -0.0006, 100)],
  ];
  const periods = ["1D", "1W", "1M", "3M", "YTD", "1Y"];
  const r = rnd(41);
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kick">SUB-PAGE 01</div><h2>Equity Indices</h2>
        <p>Every major benchmark on one screen: level, momentum, breadth of the move, and where it sits inside its own year.</p></div>
      <div class="rt"><div class="note">WORLDWIDE · 12 EXCHANGES</div><div class="mono" style="font-size:26px;margin-top:4px">+0.41%</div><div class="note">equal-weighted composite</div></div>
    </div>

    <div class="cols" style="padding-top:22px">
      <div>
        <div class="pnl">
          <h3><i>01</i> Full index table <span class="tag">sortable view</span>
            <span class="seg"><button class="on">All</button><button>Americas</button><button>EMEA</button><button>APAC</button></span></h3>
          <div class="pad" style="padding-top:4px">
            <table><thead><tr><th>#</th><th>Index</th><th>Last</th><th>1D</th><th>5D</th><th>1Y</th><th>YTD</th><th style="width:90px">Trend</th></tr></thead><tbody>
            ${INDICES.map((x, i) => { const ytd = 6.8 - i * 0.9; const y1 = 16.9 - i * 1.7;
              return `<tr><td class="tk">${String(i + 1).padStart(2, "0")}</td><td class="nm">${x[0]} <span class="tk">${x[1]}</span></td>
              <td class="mono">${x[2].toLocaleString()}</td>
              <td class="mono ${x[3] >= 0 ? "up" : "dn"}">${sign(x[3])}%</td>
              <td class="mono ${x[4] >= 0 ? "up" : "dn"}">${sign(x[4], 1)}%</td>
              <td class="mono ${y1 >= 0 ? "up" : "dn"}">${sign(y1, 1)}%</td>
              <td class="mono ${ytd >= 0 ? "up" : "dn"}">${sign(ytd, 1)}%</td>
              <td>${sparkRow(i + 12, x[3] >= 0, 78, 18)}</td></tr>`; }).join("")}
            </tbody></table>
          </div>
        </div>

        <div class="pnl">
          <h3><i>02</i> Relative performance <span class="tag a">rebased to 100</span></h3>
          <div class="pad">
            <div class="legend" id="idxLegend" style="margin-bottom:14px">
              ${seriesSets.map((s, i) => `<button class="on" data-line="${i}"><i style="background:${s[1]}"></i>${s[0]}</button>`).join("")}
            </div>
            <div style="color:#6d7783">
              <svg viewBox="0 0 900 250" width="100%" height="250" id="idxChart" style="display:block">
                ${[85, 95, 105, 115, 125].map((g, i) => `<line x1="0" x2="860" y1="${20 + i * 52}" y2="${20 + i * 52}" stroke="currentColor" stroke-opacity=".14"/>
                  <text x="866" y="${24 + i * 52}" font-size="9.5" font-family="IBM Plex Mono" fill="currentColor" opacity=".7">${g}</text>`).join("")}
                ${seriesSets.map((s, i) => `<path class="idxline" data-line="${i}" d="${path(s[2], 860, 230, 8)}" fill="none" stroke="${s[1]}" stroke-width="2"/>`).join("")}
              </svg>
            </div>
            <div class="note" style="margin-top:10px">Six-month total return, local currency, rebased to 100. Click a name to isolate.</div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>03</i> Return matrix</h3>
          <div class="pad">
            <table><thead><tr><th>Index</th>${periods.map((p) => `<th>${p}</th>`).join("")}</tr></thead><tbody>
            ${INDICES.slice(0, 8).map((x) => `<tr><td class="nm">${x[0]}</td>
              ${periods.map((p, i) => { const v = (r() - 0.4) * (2 + i * 5);
                return `<td><span data-tip="${x[0]} · ${p}: ${sign(v)}%" class="mono" style="display:inline-block;min-width:56px;padding:4px 6px;${heat(v, 10)}">${sign(v, 1)}</span></td>`; }).join("")}
            </tr>`).join("")}
            </tbody></table>
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="pnl"><h3><i>04</i> Today's leaders</h3>
          ${[["Nikkei 225", 1.86], ["Nasdaq 100", 0.94], ["MSCI EM", -0.62], ["Hang Seng", -2.05]].map((l) => `<div class="st"><span>${l[0]}</span><b class="${l[1] >= 0 ? "o" : "c"}" style="color:${l[1] >= 0 ? "var(--up)" : "var(--dn)"}">${sign(l[1])}%</b></div>`).join("")}
        </div>
        <div class="pnl"><h3><i>05</i> Index concentration</h3>
          <div class="pad">
            <div class="note">Top 10 constituents drive</div>
            <div class="bignum" style="font-size:44px;color:var(--acc)">36.4%</div>
            <div class="note" style="margin-bottom:12px">of the S&P 500's 12-month return</div>
            <div class="bd" style="margin-bottom:8px"><i style="width:36.4%;background:var(--acc)"></i><i style="width:63.6%;background:#1b2027"></i></div>
            ${[["NVDA", 9.1], ["AAPL", 7.4], ["MSFT", 6.8], ["AMZN", 4.2], ["META", 3.6], ["Other 486", 68.9]].map((c) => `<div class="kv"><span>${c[0]}</span><b class="mono">${c[1]}%</b></div>`).join("")}
          </div>
        </div>
        <div class="pnl"><h3><i>06</i> 52-week extremes</h3>
          ${[["New highs", "84", 1], ["New lows", "46", 0], ["Above 50DMA", "61%", 1], ["Below 200DMA", "19%", 0]].map((k) => `<div class="st"><span>${k[0]}</span><b style="color:${k[2] ? "var(--up)" : "var(--dn)"}">${k[1]}</b></div>`).join("")}
        </div>
      </aside>
    </div>
  </div>`;
}

function ratesView() {
  const g = [["United States", "US", 4.18, 4.06], ["Germany", "DE", 2.34, 2.51], ["United Kingdom", "UK", 4.12, 3.86],
    ["Japan", "JP", 0.78, 0.71], ["France", "FR", 2.86, 2.94], ["Canada", "CA", 3.42, 3.21],
    ["Australia", "AU", 3.98, 4.12], ["Italy", "IT", 3.21, 3.55], ["Spain", "ES", 3.02, 3.31], ["Netherlands", "NL", 2.61, 2.72]];
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kick">SUB-PAGE 02</div><h2>Rates &amp; the curve</h2>
        <p>Sovereign yields, the shape of the curve, what central banks are expected to do next, and what the bond market implies about inflation.</p></div>
      <div class="rt"><div class="note">US 10Y BENCHMARK</div><div class="mono" style="font-size:26px;margin-top:4px">4.18%</div><div class="note dn">−4bp on the day</div></div>
    </div>

    <div class="cols" style="padding-top:22px">
      <div>
        <div class="pnl">
          <h3><i>01</i> Curve shape
            <span class="seg" data-seg-group="yc2">
              <button data-seg="Today" class="on">Today</button><button data-seg="1M ago">1M ago</button>
              <button data-seg="1Y ago">1Y ago</button><button data-seg="3Y ago">3Y ago</button></span></h3>
          <div class="pad"><div data-seg-target="yc2" data-seg-view="Today">${curveSVG("Today")}</div>
            <div data-seg-target="yc2" data-seg-view="1M ago" style="display:none">${curveSVG("1M ago", "#5aa9ff")}</div>
            <div data-seg-target="yc2" data-seg-view="1Y ago" style="display:none">${curveSVG("1Y ago", "#29d08b")}</div>
            <div data-seg-target="yc2" data-seg-view="3Y ago" style="display:none">${curveSVG("3Y ago", "#b47cff")}</div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>02</i> Global 10-year yields <span class="tag">today vs a year ago</span></h3>
          <div class="pad">
            ${g.map((x) => { const lo = Math.min(x[2], x[3]), hi = Math.max(x[2], x[3]); const S = (v) => (v / 5) * 100;
              const d = Math.round((x[2] - x[3]) * 100);
              return `<div style="display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)" data-tip="${x[0]} 10Y ${x[2].toFixed(2)}% (was ${x[3].toFixed(2)}%)">
                <span style="width:112px;font-size:12.5px">${x[0]}</span>
                <span style="flex:1;position:relative;height:16px">
                  <i style="position:absolute;left:0;right:0;top:7.5px;height:1px;background:#1f2530;display:block"></i>
                  <i style="position:absolute;left:${S(lo)}%;width:${S(hi) - S(lo)}%;top:7px;height:3px;background:${x[2] < x[3] ? "#29d08b" : "#ff5470"};display:block"></i>
                  <i style="position:absolute;left:${S(x[3])}%;top:4px;width:9px;height:9px;margin-left:-4.5px;border-radius:99px;background:#39424e;display:block"></i>
                  <i style="position:absolute;left:${S(x[2])}%;top:3px;width:11px;height:11px;margin-left:-5.5px;border-radius:99px;background:#ffb020;display:block"></i></span>
                <span class="mono" style="width:52px;text-align:right">${x[2].toFixed(2)}</span>
                <span class="mono ${d >= 0 ? "dn" : "up"}" style="width:52px;text-align:right">${d >= 0 ? "+" : "−"}${Math.abs(d)}bp</span></div>`; }).join("")}
            <div class="note" style="margin-top:10px">Amber = today · grey = 12 months ago · scale 0–5%</div>
          </div>
        </div>

        <div class="pnl">
          <h3><i>03</i> Real vs nominal <span class="tag a">5y constant maturity</span></h3>
          <div class="pad" style="color:#6d7783">
            <svg viewBox="0 0 860 200" width="100%" height="200" style="display:block">
              <path d="${path(series(140, 7, 0.02, -0.0004, 4.6), 860, 190, 8)}" fill="none" stroke="#ffb020" stroke-width="2.2"/>
              <path d="${path(series(140, 17, 0.03, 0.0009, 1.8), 860, 190, 8)}" fill="none" stroke="#5aa9ff" stroke-width="2.2"/>
            </svg>
            <div class="legend" style="margin-top:8px"><span style="color:#ffb020">■ Nominal 5Y 4.09%</span><span style="color:#5aa9ff">■ Real 5Y 1.74%</span><span style="color:var(--dim)">■ Breakeven 2.35%</span></div>
            <div class="two" style="gap:14px;margin-top:10px">
              ${[["5y5y breakeven", "2.48%"], ["Fed target", "2.00%"], ["Real yield", "+1.74%"], ["Term premium", "+0.22%"]]
                .map((k) => `<div class="kv"><span>${k[0]}</span><b class="mono">${k[1]}</b></div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="pnl"><h3><i>04</i> Next policy decisions</h3>
          ${[["Federal Reserve", "18 Mar", 68, "25bp CUT"], ["ECB", "12 Mar", 74, "HOLD"], ["Bank of England", "20 Mar", 61, "HOLD"], ["Bank of Japan", "19 Mar", 44, "15bp HIKE"]]
            .map((b) => `<div style="padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.05)">
              <div class="kv" style="border:0;padding:0 0 6px"><span>${b[0]}</span><b class="mono">${b[1]}</b></div>
              <div style="display:flex;gap:8px;align-items:center">
                <div class="bd" style="flex:1"><i style="width:${b[2]}%;background:#29d08b"></i><i style="width:${100 - b[2]}%;background:#1b2027"></i></div>
                <span class="tag u">${b[3]} ${b[2]}%</span></div></div>`).join("")}
        </div>
        <div class="pnl"><h3><i>05</i> Curve metrics</h3>
          <div class="pad">
            ${[["2s10s", "−24bp", "dn"], ["3M10Y", "−118bp", "dn"], ["5s30s", "+27bp", "up"], ["2s5s", "−33bp", "dn"], ["10s30s", "+18bp", "up"], ["10y real", "+1.74%", "up"]]
              .map((k) => `<div class="kv"><span>${k[0]}</span><b class="mono ${k[2]}">${k[1]}</b></div>`).join("")}
          </div>
        </div>
        <div class="pnl"><h3><i>06</i> Recent auctions</h3>
          ${[["2Y · 06 Feb", "4.31%", "6.1×"], ["5Y · 05 Feb", "4.19%", "5.4×"], ["7Y · 04 Feb", "4.22%", "4.9×"], ["10Y · 06 Feb", "4.18%", "6.8×"]]
            .map((a) => `<div class="st"><span>${a[0]}</span><span class="note">stop ${a[1]}</span><b style="color:var(--up)">${a[2]}</b></div>`).join("")}
          <div class="pad" style="padding-top:10px"><div class="note">Bid-to-cover above the six-month average on every tenor this week.</div></div>
        </div>
      </aside>
    </div>
  </div>`;
}

function fxView() {
  const pairs = [["EUR/USD", 1.0891, -0.28], ["USD/JPY", 151.42, 0.62], ["GBP/USD", 1.2684, 0.17], ["USD/CHF", 0.8842, 0.19],
    ["AUD/USD", 0.6518, -0.44], ["USD/CAD", 1.3604, 0.11], ["USD/CNH", 7.2416, 0.31], ["EUR/GBP", 0.8586, -0.42]];
  const strength = [["JPY", -1.84], ["GBP", -0.42], ["EUR", -0.31], ["CAD", 0.12], ["AUD", 0.24], ["CHF", 0.48], ["USD", 0.72], ["CNY", 1.12]];
  const ccy = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD"];
  const rr = rnd(6);
  return `
  <div class="wrap">
    <div class="pagehd">
      <div><div class="kick">SUB-PAGE 03</div><h2>Currencies</h2>
        <p>The dollar against the world: the index, the majors, how every currency is performing against every other, and the carry that flows between them.</p></div>
      <div class="rt"><div class="note">DOLLAR INDEX · DXY</div><div class="mono" style="font-size:26px;margin-top:4px">104.31</div><div class="note up">+0.34% · firmer</div></div>
    </div>

    <div class="cols" style="padding-top:22px">
      <div>
        <div class="pnl"><h3><i>01</i> Dollar index <span class="tag u">6-month tape</span></h3>
          <div class="pad" style="color:#6d7783">
            ${chart({ vals: series(200, 31, 0.014, 0.0004, 100.8), w: 860, h: 220, color: "#ffb020", grid: [100, 102, 104, 106] })}
            <div class="two" style="gap:14px;margin-top:8px;color:var(--tx)">
              ${[["52w range", "99.58 – 107.35"], ["200-day avg", "103.41"], ["CFTC net long", "+$12.4bn"], ["Corr. to 2y real rate", "0.81"]]
                .map((k) => `<div class="kv"><span>${k[0]}</span><b class="mono">${k[1]}</b></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="pnl"><h3><i>02</i> Majors</h3>
          <div class="pad" style="padding-top:4px">
            <table><thead><tr><th>Pair</th><th>Rate</th><th>1D</th><th>Day range</th><th style="width:90px">5d</th><th>Spread</th></tr></thead><tbody>
            ${pairs.map((p, i) => { const w = 30 + rr() * 55;
              return `<tr data-tip="${p[0]} last ${p[1]}"><td class="nm mono">${p[0]}</td>
              <td class="mono">${p[1].toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
              <td class="mono ${p[2] >= 0 ? "up" : "dn"}">${sign(p[2])}%</td>
              <td style="min-width:130px"><div style="position:relative;height:6px;background:#161b22" data-tip="range position ${w.toFixed(0)}%">
                <i style="position:absolute;left:0;right:0;top:2.5px;height:1px;background:#242b36;display:block"></i>
                <i style="position:absolute;left:${w}%;top:-3px;width:2px;height:12px;background:#ffb020;display:block"></i></div></td>
              <td>${sparkRow(i + 44, p[2] >= 0, 78, 18)}</td>
              <td class="mono note">${(0.4 + i * 0.2).toFixed(1)} pip</td></tr>`; }).join("")}
            </tbody></table>
          </div>
        </div>

        <div class="pnl"><h3><i>03</i> Cross-rate heatmap <span class="tag">today, %</span></h3>
          <div class="pad">
            <div style="display:grid;grid-template-columns:70px repeat(6,1fr);gap:3px">
              <div></div>${ccy.map((c) => `<div class="note" style="text-align:center">${c}</div>`).join("")}
              ${ccy.map((row) => `<div class="note">${row}</div>` + ccy.map((col) => {
                if (row === col) return `<div style="height:36px;border-radius:2px;background:#12161c"></div>`;
                const v = (rr() - 0.5) * 1.6;
                return `<div data-tip="${row}/${col} ${sign(v)}%" style="height:36px;border-radius:2px;display:grid;place-items:center;font:600 10.5px 'IBM Plex Mono';${heat(v, 1.4)}">${sign(v, 1)}</div>`;
              }).join("")).join("")}
            </div>
            <div class="note" style="margin-top:12px">Rows are base currencies. Green = the base currency appreciated against every column on the row.</div>
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="pnl"><h3><i>04</i> Currency strength · 1D</h3>
          <div class="pad">
            ${strength.slice().reverse().map((s) => `<div style="display:flex;align-items:center;gap:10px;padding:6px 0" data-tip="${s[0]} ${sign(s[1], 2)}% vs basket">
              <span class="mono" style="width:34px">${s[0]}</span>
              <span style="flex:1;position:relative;height:14px"><i style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#262d36;display:block"></i>
                <i style="position:absolute;top:3px;height:8px;border-radius:1px;background:${s[1] >= 0 ? "#29d08b" : "#ff5470"};${s[1] >= 0 ? `left:50%;width:${Math.abs(s[1]) * 34}%` : `right:50%;width:${Math.abs(s[1]) * 34}%`};display:block"></i></span>
              <span class="mono ${s[1] >= 0 ? "up" : "dn"}" style="width:52px;text-align:right;font-size:11.5px">${sign(s[1])}</span></div>`).join("")}
          </div>
        </div>
        <div class="pnl"><h3><i>05</i> Carry ranking</h3>
          <div class="pad" style="padding-top:6px">
            ${[["TRY", 45.0, 6.42], ["BRL", 13.25, 5.18], ["MXN", 10.5, 4.86], ["USD", 5.25, 4.02], ["GBP", 5.0, 3.41], ["EUR", 4.0, 2.68], ["JPY", 0.25, -1.12], ["CHF", 1.25, -0.84]]
              .map((c) => `<div class="kv" data-tip="${c[0]} policy ${c[1]}% · 3M forward ${sign(c[2])}%"><span>${c[0]} <span class="note">pol ${c[1]}%</span></span>
                <b class="mono ${c[2] >= 0 ? "up" : "dn"}">${sign(c[2])}%</b></div>`).join("")}
            <div class="note" style="margin-top:10px">3-month forward points, annualised vs USD.</div>
          </div>
        </div>
        <div class="pnl"><h3><i>06</i> FX event risk</h3>
          ${[["12 Feb", "US CPI", "HIGH"], ["12 Feb", "ECB decision", "HIGH"], ["19 Mar", "BoJ decision", "HIGH"], ["20 Mar", "BoE decision", "MED"]]
            .map((e) => `<div class="st"><span>${e[1]}</span><span class="note">${e[0]}</span><b style="color:${e[2] === "HIGH" ? "var(--acc)" : "var(--dim)"}">${e[2]}</b></div>`).join("")}
        </div>
      </aside>
    </div>
  </div>`;
}

function commoditiesView() {
  const groups = {
    ENERGY: [["Brent Crude", 82.14, -1.24], ["WTI Crude", 78.02, -1.36], ["Natural Gas", 2.41, 3.18], ["Gasoline", 2.18, -0.94], ["Heating Oil", 2.44, -0.62]],
    METALS: [["Gold", 2412.6, 0.81], ["Silver", 28.42, 1.94], ["Copper", 4.21, 1.14], ["Aluminium", 2348, -0.42], ["Nickel", 17420, 0.86]],
    AGRICULTURE: [["Wheat", 592.25, -0.62], ["Corn", 442.5, 0.34], ["Soybeans", 1042.75, -1.12], ["Sugar", 0.1842, -2.06], ["Cocoa", 6412, -6.21]],
  };
  const curve = {
    Brent: [79.4, 80.6, 81.4, 82.14, 81.6, 80.4, 79.8, 79.1],
    Copper: [4.02, 4.08, 4.14, 4.21, 4.28, 4.35, 4.41, 4.49],
    Gold: [2398, 2404, 2412.6, 2421, 2433, 2447, 2462, 2480],
    "Nat Gas": [2.61, 2.52, 2.41, 2.34, 2.29, 2.31, 2.38, 2.44],
  };
  return `
  <div class="wrap">
    <div class="pagehd" style="position:relative;border-bottom:0;padding-bottom:0">
      <div style="width:100%">
        <div style="position:relative;border:1px solid var(--line);overflow:hidden">
          <div style="position:absolute;inset:0;background:url(images/apx-metal.jpg) center/cover;opacity:.55"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,8,10,.95) 25%,rgba(6,8,10,.25))"></div>
          <div style="position:relative;padding:34px 26px;display:flex;gap:30px;flex-wrap:wrap;align-items:flex-end">
            <div><div class="kick">SUB-PAGE 04</div><h2 style="margin:0;font-family:'Archivo';font-weight:800;font-size:34px;letter-spacing:-.03em;text-transform:uppercase">Commodities</h2>
              <p style="max-width:560px;color:#a9b2c0;font-size:13.5px;line-height:1.6;margin:8px 0 0">Energy, metals and agriculture — cash prices, the futures curve behind them, and the physical balance that sets the direction.</p></div>
            <div style="margin-left:auto;display:flex;gap:1px;background:var(--line);border:1px solid var(--line)">
              ${[["BRENT", "$82.14", "−1.24%", "dn"], ["GOLD", "$2,412", "+0.81%", "up"], ["COPPER", "$4.21", "+1.14%", "up"]].map((s) =>
                `<div style="background:rgba(8,11,14,.85);padding:12px 16px"><div class="note">${s[0]}</div><div class="mono" style="font-size:19px">${s[1]}</div><div class="mono ${s[3]}" style="font-size:11px">${s[2]}</div></div>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cols" style="padding-top:22px">
      <div>
        <div class="pnl">
          <h3><i>01</i> Futures curve
            <span class="seg" data-seg-group="fc">
              <button data-seg="Brent" class="on">Brent</button><button data-seg="Copper">Copper</button>
              <button data-seg="Gold">Gold</button><button data-seg="Nat Gas">Nat gas</button></span></h3>
          <div class="pad">
            ${Object.keys(curve).map((k, ki) => { const v = curve[k]; const mn = Math.min(...v), mx = Math.max(...v);
              const col = ki === 0 ? "#ffb020" : ["#29d08b", "#5aa9ff", "#b47cff"][ki - 1];
              const state = v[v.length - 1] > v[0] ? "CONTANGO" : "BACKWARDATION";
              return `<div data-seg-target="fc" data-seg-view="${k}" style="${ki ? "display:none" : ""}">
                <div class="row" style="display:flex;justify-content:space-between;margin-bottom:6px">
                  <span class="note">${k} · front month in bold</span><span class="tag ${state === "CONTANGO" ? "u" : "d"}">${state}</span></div>
                <svg viewBox="0 0 780 220" width="100%" height="220" style="display:block;color:#6d7783">
                  <line x1="30" x2="760" y1="196" y2="196" stroke="currentColor" stroke-opacity=".3"/>
                  <path d="${v.map((y, i) => (i ? "L" : "M") + (40 + (i / 7) * 700) + " " + (190 - ((y - mn) / (mx - mn || 1)) * 150)).join(" ")}"
                    fill="none" stroke="${col}" stroke-width="2.4"/>
                  ${v.map((y, i) => `<g data-tip="${["M1", "M2", "M3", "M4", "M5", "M7", "M9", "M12"][i]} · ${y}">
                    <circle cx="${40 + (i / 7) * 700}" cy="${190 - ((y - mn) / (mx - mn || 1)) * 150}" r="4.5" fill="#06080a" stroke="${col}" stroke-width="2"/>
                    <text x="${40 + (i / 7) * 700}" y="${178 - ((y - mn) / (mx - mn || 1)) * 150}" font-size="10.5" font-family="IBM Plex Mono" fill="#dfe5ea" text-anchor="middle">${y}</text>
                    <text x="${40 + (i / 7) * 700}" y="212" font-size="9.5" font-family="IBM Plex Mono" fill="currentColor" text-anchor="middle" opacity=".75">${["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Sep", "Dec"][i]}</text></g>`).join("")}
                </svg>
                <div class="note" style="margin-top:6px">${state === "CONTANGO"
                  ? "Longer-dated contracts trade above the prompt month — storage is being paid for."
                  : "Prompt months command a premium — the market is paying for barrels today."}</div>
              </div>`; }).join("")}
          </div>
        </div>

        <div class="pnl"><h3><i>02</i> Price board <span class="tag">15 contracts</span></h3>
          <div class="pad" style="padding-top:4px">
            ${Object.keys(groups).map((gname) => `
              <div class="note" style="letter-spacing:.2em;padding:12px 0 6px;border-bottom:1px solid var(--line)">${gname}</div>
              <table><tbody>
              ${groups[gname].map((c, i) => `<tr>
                <td class="nm" style="text-align:left">${c[0]}</td>
                <td class="mono">${c[1].toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                <td class="mono ${c[2] >= 0 ? "up" : "dn"}">${sign(c[2])}%</td>
                <td class="mono note">${sign(c[2] * 3.4, 1)}% 1M</td>
                <td style="width:86px">${sparkRow(i + gname.length, c[2] >= 0, 76, 18)}</td>
                <td class="mono note">${(c[1] * (1 + c[2] / 100)).toFixed(2)} prev</td></tr>`).join("")}
              </tbody></table>`).join("")}
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="pnl"><h3><i>03</i> Crude balance</h3>
          <div class="pad">
            ${[["Global demand", "102.4 m b/d", 96], ["OPEC+ supply", "41.2 m b/d", 62], ["US production", "13.4 m b/d", 78], ["OECD stocks", "2,741 mb", 44]]
              .map((k) => `<div style="margin-bottom:11px"><div class="kv" style="border:0;padding:0 0 4px"><span>${k[0]}</span><b class="mono">${k[1]}</b></div>
                <div class="bd"><i style="width:${k[2]}%;background:${k[2] > 70 ? "#29d08b" : "#ffb020"}"></i></div></div>`).join("")}
            <div class="note" style="margin-top:8px">Commercial crude inventories fell 2.4mb last week, a fifth straight draw.</div>
          </div>
        </div>
        <div class="pnl"><h3><i>04</i> Freight signal</h3>
          <div class="pad">
            <div class="bignum" style="font-size:38px">1,842</div>
            <div class="note">Baltic Dry Index · <span class="up">+4.1% 1D</span></div>
            ${spark(series(60, 71, 0.05, 0.002, 1500), 300, 60, "#29d08b", true)}
            <div class="kv"><span>Cape 5TC</span><b class="mono">$24,106/day</b></div>
            <div class="kv"><span>Container · SCFI</span><b class="mono">2,314 <span class="up">+2.1%</span></b></div>
          </div>
        </div>
        <div class="pnl"><h3><i>05</i> Watchlist alerts</h3>
          ${[["Brent < $80", "1.2% away"], ["Gold > $2,450", "1.6% away"], ["Copper > $4.30", "2.1% away"], ["Cocoa > $7,000", "9.2% away"]]
            .map((a) => `<div class="st"><span>${a[0]}</span><span class="note">${a[1]}</span></div>`).join("")}
          <div class="pad" style="padding-top:10px"><button class="seg" style="width:100%"><span class="note" style="padding:7px;text-align:center;width:100%">+ NEW ALERT</span></button></div>
        </div>
      </aside>
    </div>
  </div>`;
}

/* --------------------------- SHELL --------------------------- */

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "indices", label: "Equity Indices" },
  { id: "rates", label: "Rates" },
  { id: "fx", label: "Currencies" },
  { id: "commodities", label: "Commodities" },
];

const VIEWS = {
  overview: { title: "Markets Overview", html: overview,
    init(root) {
      const host = root.querySelector("#ycHost");
      root.querySelectorAll('[data-seg-group="yc"] [data-seg]').forEach((b) =>
        b.addEventListener("click", () => { if (host) host.innerHTML = curveSVG(b.getAttribute("data-seg"), "#ffb020"); }));
      root.querySelectorAll('[data-seg-group="sh"] [data-seg]').forEach(() => {});
    } },
  indices: { title: "Equity Indices", html: indicesView,
    init(root) {
      root.querySelectorAll("#idxLegend [data-line]").forEach((b) =>
        b.addEventListener("click", () => {
          const i = b.getAttribute("data-line");
          const on = b.classList.toggle("on");
          const p = root.querySelector(`#idxChart .idxline[data-line="${i}"]`);
          if (p) { p.style.display = on ? "" : "none"; p.style.opacity = on ? "1" : "0"; }
        }));
    } },
  rates: { title: "Rates & the Curve", html: ratesView },
  fx: { title: "Currencies", html: fxView },
  commodities: { title: "Commodities", html: commoditiesView },
};

function shell(page, ctx) {
  return `
  <div class="apx">
    <style>${CSS}</style>
    <header class="hdr"><div class="wrap hdr-in">
      <div class="mark"><i></i>MERIDIAN <small>APX TERMINAL</small></div>
      <nav>${NAV.map((n) => `<a href="#/apx/${n.id}" class="${n.id === ctx.pKey ? "on" : ""}">${n.label}</a>`).join("")}</nav>
      <div class="rt"><span class="live"><b></b>LIVE</span><span class="clk" data-clock="America/New_York">—</span></div>
    </div></header>
    ${tickerMarquee()}
    <main>${page.html()}</main>
    <div class="wrap"><footer class="ft">
      <span>MERIDIAN APX · PROFESSIONAL TERMINAL · DELAYED DATA 15M</span>
      <span>SIMULATED FEED — NOT INVESTMENT ADVICE · <span data-clock="UTC">—</span></span>
    </footer></div>
  </div>`;
}

export const apx = { id: "apx", name: "Design A · APX Terminal", short: "APX · TERMINAL", shell, views: VIEWS, nav: NAV };
