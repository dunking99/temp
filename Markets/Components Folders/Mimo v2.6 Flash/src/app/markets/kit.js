/* Meridian Markets — shared client toolkit: hash router, charts, tooltips */

export function rnd(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function series(n, seed, vol, drift = 0, start = 100) {
  const r = rnd(seed);
  const out = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = v * (1 + (r() - 0.5) * vol + drift);
    out.push(v);
  }
  return out;
}

export function path(a, w, h, pad = 0) {
  const mn = Math.min(...a), mx = Math.max(...a), rg = mx - mn || 1;
  return a
    .map((v, i) => (i ? "L" : "M") + ((i / (a.length - 1)) * w).toFixed(2) + " " + (pad + (h - 2 * pad) - ((v - mn) / rg) * (h - 2 * pad)).toFixed(2))
    .join(" ");
}
export function area(a, w, h, pad = 0) {
  return path(a, w, h, pad) + ` L${w} ${h} L0 ${h} Z`;
}

let uid = 0;
export function spark(a, w, h, col, fill, sw) {
  const id = "g" + ++uid;
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" style="display:block">
    ${fill ? `<defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".38"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${area(a, w, h, 2)}" fill="url(#${id})"/>` : ""}
    <path d="${path(a, w, h, 2)}" fill="none" stroke="${col}" stroke-width="${sw || 1.6}" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

/* main line chart with optional grid lines */
export function chart(opts) {
  const { vals, w = 880, h = 240, color = "#29d08b", fill = true, grid = [], pad = 14, sw = 2, labels = [] } = opts;
  const id = "g" + ++uid;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  const Y = (v) => pad + (h - 2 * pad) - ((v - mn) / rg) * (h - 2 * pad);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="display:block">
    ${fill ? `<defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>` : ""}
    ${grid.map((g) => `<line x1="0" x2="${w}" y1="${Y(g)}" y2="${Y(g)}" stroke="currentColor" stroke-opacity=".13"/>`).join("")}
    <path d="${area(vals, w, h, pad)}" fill="url(#${id})" opacity="${fill ? 1 : 0}"/>
    <path d="${path(vals, w, h, pad)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <circle cx="${w}" cy="${Y(vals[vals.length - 1])}" r="3.5" fill="${color}"/>
    ${labels.map((l, i) => `<text x="${(i / (labels.length - 1)) * (w - 20) + 10}" y="${h - 2}" font-size="10" text-anchor="middle" fill="currentColor" opacity=".5" font-family="IBM Plex Mono">${l}</text>`).join("")}
  </svg>`;
}

export function sign(v, d = 2) {
  return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(d);
}
export const dir = (v) => (v > 0 ? "up" : v < 0 ? "dn" : "fl");

/* ---------- tooltip ---------- */
let tipEl;
function ensureTip() {
  if (tipEl) return tipEl;
  tipEl = document.createElement("div");
  tipEl.id = "mk-tip";
  tipEl.style.cssText =
    "position:fixed;z-index:999;pointer-events:none;opacity:0;transition:opacity .12s;background:#04060a;border:1px solid rgba(140,150,170,.4);color:#e8ecf4;padding:7px 10px;font:500 11.5px/1.45 'IBM Plex Mono',monospace;border-radius:6px;white-space:pre;box-shadow:0 14px 34px rgba(0,0,0,.45)";
  document.body.appendChild(tipEl);
  return tipEl;
}
function showTip(e, txt) {
  const t = ensureTip();
  t.textContent = txt;
  t.style.opacity = "1";
  const x = Math.min(e.clientX + 16, window.innerWidth - t.offsetWidth - 12);
  t.style.left = x + "px";
  t.style.top = Math.max(8, e.clientY - 14) + "px";
}
function hideTip() {
  if (tipEl) tipEl.style.opacity = "0";
}
export function bindTips() {
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest("[data-tip]");
    if (t) showTip(e, t.getAttribute("data-tip"));
    else hideTip();
  });
  document.addEventListener("mouseleave", hideTip);
}

/* ---------- live clock ---------- */
function tickClocks() {
  const now = new Date();
  document.querySelectorAll("[data-clock]").forEach((el) => {
    const tz = el.getAttribute("data-clock");
    try {
      el.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz === "local" ? undefined : tz,
      }).format(now) + (tz === "local" ? "" : " " + tz);
    } catch (err) {
      el.textContent = now.toLocaleTimeString();
    }
  });
}

/* ---------- segmented control wiring ----------
   markup: [data-seg-group="NAME"] > [data-seg="key"]; targets: [data-seg-target="NAME"][data-seg-view="key"] */
export function wireSeg(scope, onPick) {
  scope.querySelectorAll("[data-seg-group]").forEach((g) => {
    const name = g.getAttribute("data-seg-group");
    g.querySelectorAll("[data-seg]").forEach((b) => {
      b.addEventListener("click", () => {
        g.querySelectorAll("[data-seg]").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        const key = b.getAttribute("data-seg");
        scope.querySelectorAll(`[data-seg-target="${name}"]`).forEach((t) => {
          t.style.display = t.getAttribute("data-seg-view") === key ? "" : "none";
        });
        if (onPick) onPick(name, key, b);
      });
    });
  });
}

/* ---------- hash router ---------- */
export function boot(designs) {
  const root = document.getElementById("app");
  bindTips();
  tickClocks();
  setInterval(tickClocks, 1000);

  function parse() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    const dKey = designs[parts[0]] ? parts[0] : Object.keys(designs)[0];
    const design = designs[dKey];
    const pKey = design.views[parts[1]] ? parts[1] : Object.keys(design.views)[0];
    return { design, dKey, page: design.views[pKey], pKey };
  }

  function render() {
    const { design, dKey, page, pKey } = parse();
    document.title = `${page.title} — ${design.name} · Meridian`;
    root.innerHTML = design.shell(page, { dKey, pKey, design });
    // switcher
    const old = document.getElementById("design-switcher");
    if (old) old.remove();
    const sw = document.createElement("div");
    sw.id = "design-switcher";
    sw.innerHTML =
      `<span>DESIGN</span>` +
      Object.keys(designs)
        .map((k, i) => {
          const d = designs[k];
          return `<a href="#/${k}/${d.views[pKey] ? pKey : Object.keys(d.views)[0]}" class="${k === dKey ? "on" : ""}">${"ABC"[i]} · ${d.short}</a>`;
        })
        .join("");
    document.body.appendChild(sw);
    const st = document.createElement("style");
    st.textContent = SWCSS;
    if (!document.getElementById("sw-style")) {
      st.id = "sw-style";
      document.body.appendChild(st);
    }
    if (page.init) page.init(root);
    wireSeg(root);
    window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", render);
  render();
}

const SWCSS = `
#design-switcher{position:fixed;right:18px;bottom:18px;z-index:900;display:flex;align-items:center;gap:6px;
  background:rgba(8,10,14,.86);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);border-radius:999px;
  padding:7px 10px;box-shadow:0 18px 40px rgba(0,0,0,.45)}
#design-switcher span{font:600 9px 'IBM Plex Mono',monospace;letter-spacing:.16em;color:#8b93a3;padding:0 6px}
#design-switcher a{font:600 11px/1 'Inter',sans-serif;color:#cfd6e2;text-decoration:none;padding:7px 11px;border-radius:999px;transition:.15s}
#design-switcher a:hover{background:rgba(255,255,255,.1);color:#fff}
#design-switcher a.on{background:#fff;color:#0a0c10}
@media (max-width:760px){#design-switcher{left:12px;right:12px;justify-content:center;flex-wrap:wrap}}
`;
