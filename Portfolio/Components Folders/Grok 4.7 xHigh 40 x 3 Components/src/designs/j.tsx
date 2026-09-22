import { useMemo, useState, type ReactNode } from "react";
import {
  accounts,
  allocationRows,
  cashTotal,
  CLASS_ORDER,
  coreValue,
  homeWeight,
  photos,
  positions,
  spark,
  totalValue,
} from "../data";
import { line, money, pct, scale } from "../lib";

type FlowNode = { id: string; label: string; value: number; x: number; y: number; h: number; w: number };
type FlowLink = { source: string; target: string; value: number };

function buildModel() {
  const left = accounts.map((a) => ({
    id: a.id,
    label: a.short,
    value: positions.filter((p) => p.account === a.id).reduce((s, p) => s + p.mv, 0) + a.cash,
  }));
  const midNames = [...CLASS_ORDER.filter((n) => n !== "Cash"), "Cash"];
  const mid = midNames.map((name) => ({
    id: name,
    label: name,
    value: name === "Cash" ? cashTotal : positions.filter((p) => p.assetClass === name).reduce((s, p) => s + p.mv, 0),
  }));
  const top = positions.slice(0, 6);
  const right = [
    ...top.map((p) => ({ id: p.ticker, label: p.ticker, value: p.mv })),
    { id: "other", label: "Other + cash", value: positions.slice(6).reduce((s, p) => s + p.mv, 0) + cashTotal },
  ];
  const links: FlowLink[] = [];
  for (const p of positions) {
    links.push({ source: p.account, target: p.assetClass, value: p.mv });
    links.push({ source: p.assetClass, target: top.some((t) => t.ticker === p.ticker) ? p.ticker : "other", value: p.mv });
  }
  for (const a of accounts) {
    if (a.cash) {
      links.push({ source: a.id, target: "Cash", value: a.cash });
      links.push({ source: "Cash", target: "other", value: a.cash });
    }
  }
  return { left, mid, right, links };
}

function place(nodes: { id: string; label: string; value: number }[], x: number, w: number, height = 360): FlowNode[] {
  const total = nodes.reduce((s, n) => s + n.value, 0) || 1;
  const gap = 8;
  const usable = height - gap * (nodes.length - 1);
  let y = 12;
  return nodes.map((n) => {
    const h = Math.max(14, (n.value / total) * usable);
    const node = { ...n, x, y, h, w };
    y += h + gap;
    return node;
  });
}

function band(x1: number, y1a: number, y1b: number, x2: number, y2a: number, y2b: number) {
  const c = (x2 - x1) * 0.55;
  return `M${x1},${y1a} C${x1 + c},${y1a} ${x2 - c},${y2a} ${x2},${y2a} L${x2},${y2b} C${x2 - c},${y2b} ${x1 + c},${y1b} ${x1},${y1b} Z`;
}

function ribbons(sources: FlowNode[], targets: FlowNode[], links: FlowLink[], color: string) {
  const so: Record<string, number> = {};
  const to: Record<string, number> = {};
  return links.map((l, i) => {
    const s = sources.find((n) => n.id === l.source);
    const t = targets.find((n) => n.id === l.target);
    if (!s || !t || !s.value || !t.value) return null;
    const sh = (l.value / s.value) * s.h;
    const th = (l.value / t.value) * t.h;
    const y1 = s.y + (so[s.id] ?? 0);
    const y2 = t.y + (to[t.id] ?? 0);
    so[s.id] = (so[s.id] ?? 0) + sh;
    to[t.id] = (to[t.id] ?? 0) + th;
    return { key: i, d: band(s.x + s.w, y1, y1 + sh, t.x, y2, y2 + th), color, source: l.source, target: l.target, value: l.value };
  }).filter(Boolean) as { key: number; d: string; color: string; source: string; target: string; value: number }[];
}

export function D28a() {
  const model = useMemo(() => buildModel(), []);
  const [hover, setHover] = useState<string | null>(null);
  const L = place(model.left, 8, 92);
  const M = place(model.mid, 250, 110);
  const R = place(model.right, 530, 86);
  const a = ribbons(L, M, model.links.filter((l) => L.some((n) => n.id === l.source)), "#c4552a");
  const b = ribbons(M, R, model.links.filter((l) => M.some((n) => n.id === l.source) && R.some((n) => n.id === l.target)), "#1d4e89");
  const all = [...a, ...b];
  return (
    <div style={{ background: "#fbfaf7", color: "#1c1915", fontFamily: "'IBM Plex Sans', sans-serif", padding: 12 }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>Accounts flow into sleeves, sleeves into the largest holdings. Hover a node.</div>
      <svg viewBox="0 0 640 390" width="100%" height="390">
        {all.map((r) => {
          const hot = !hover || hover === r.source || hover === r.target;
          return <path key={r.key} d={r.d} fill={r.color} opacity={hot ? 0.35 : 0.06} />;
        })}
        {[...L, ...M, ...R].map((n) => (
          <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} fill={hover === n.id ? "#1c1915" : "#efe8dc"} />
            <text x={n.x + 6} y={n.y + Math.min(16, n.h - 2)} fontSize="11" fill={hover === n.id ? "#fff" : "#1c1915"}>{n.label}</text>
          </g>
        ))}
      </svg>
      {hover && <div style={{ fontSize: 13 }}>{hover} · {money(( [...L, ...M, ...R].find((n) => n.id === hover)?.value) ?? 0)}</div>}
    </div>
  );
}

export function D28b() {
  const [acc, setAcc] = useState(accounts[0].id);
  const holdings = positions.filter((p) => p.account === acc);
  const classes = CLASS_ORDER.map((name) => ({
    name,
    value: name === "Cash" ? accounts.find((a) => a.id === acc)!.cash : holdings.filter((p) => p.assetClass === name).reduce((s, p) => s + p.mv, 0),
  })).filter((c) => c.value > 0);
  const names = holdings.slice(0, 6);
  return (
    <div style={{ background: "#10161c", color: "#e8eef4", fontFamily: "'Space Grotesk', sans-serif", padding: 16 }}>
      <div style={{ fontSize: 13, color: "#9aafc2", marginBottom: 8 }}>Pick an account. The path is only that account's money.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Col title="Account">
          {accounts.map((a) => (
            <button key={a.id} onClick={() => setAcc(a.id)} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 6, background: acc === a.id ? "#f0c36a" : "#1c2733", color: acc === a.id ? "#10161c" : "#e8eef4", border: 0, padding: "8px 10px" }}>{a.short}<div style={{ fontSize: 12 }}>{money(positions.filter((p) => p.account === a.id).reduce((s, p) => s + p.mv, 0) + a.cash)}</div></button>
          ))}
        </Col>
        <Col title="Sleeve">
          {classes.map((c) => <div key={c.name} style={{ background: "#1c2733", padding: "8px 10px", marginBottom: 6 }}>{c.name}<div style={{ fontSize: 12, color: "#f0c36a" }}>{money(c.value)}</div></div>)}
        </Col>
        <Col title="Holding">
          {names.map((p) => <div key={p.ticker} style={{ background: "#1c2733", padding: "8px 10px", marginBottom: 6 }}>{p.ticker}<div style={{ fontSize: 12 }}>{money(p.mv)}</div></div>)}
          <div style={{ fontSize: 12, color: "#9aafc2" }}>{holdings.length > 6 ? `+ ${holdings.length - 6} more in this account` : "All holdings shown"}</div>
        </Col>
      </div>
    </div>
  );
}

function Col({ title, children }: { title: string; children: ReactNode }) {
  return <div><div style={{ fontSize: 11, letterSpacing: "0.14em", marginBottom: 8 }}>{title.toUpperCase()}</div>{children}</div>;
}

export function D28c() {
  const [deep, setDeep] = useState(false);
  const [acc, setAcc] = useState(accounts[2].id);
  const a = accounts.find((x) => x.id === acc)!;
  const hs = positions.filter((p) => p.account === acc);
  const classes = CLASS_ORDER.map((name) => ({ name, value: name === "Cash" ? a.cash : hs.filter((p) => p.assetClass === name).reduce((s, p) => s + p.mv, 0) })).filter((c) => c.value > 0);
  return (
    <div style={{ background: "#f4efe6", color: "#241c14", fontFamily: "'Source Serif 4', serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>Follow one account</div>
        <button onClick={() => setDeep((v) => !v)} style={{ border: "1px solid #241c14", background: deep ? "#241c14" : "transparent", color: deep ? "#f4efe6" : "#241c14", padding: "6px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>{deep ? "Through to holdings" : "Stop at sleeves"}</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {accounts.map((x) => <button key={x.id} onClick={() => setAcc(x.id)} style={{ border: 0, background: acc === x.id ? "#c4552a" : "#e7dccb", color: acc === x.id ? "#fff" : "#241c14", padding: "6px 10px", fontFamily: "'IBM Plex Sans', sans-serif" }}>{x.short}</button>)}
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
        <FlowBox title={a.name} sub={money(hs.reduce((s, p) => s + p.mv, 0) + a.cash)} />
        <Arrow />
        <div>{classes.map((c) => <div key={c.name} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>{c.name} {money(c.value)}</div>)}</div>
        {deep && <Arrow />}
        {deep && <div>{hs.slice(0, 5).map((p) => <div key={p.ticker} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>{p.ticker} {money(p.mv)}</div>)}</div>}
      </div>
    </div>
  );
}
function FlowBox({ title, sub }: { title: string; sub: string }) {
  return <div style={{ background: "#fff", padding: "10px 12px", minWidth: 140 }}><div>{title}</div><div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>{sub}</div></div>;
}
function Arrow() {
  return <div style={{ fontSize: 28 }}>→</div>;
}

const chapters = [
  { id: "core", title: "The core", quote: "Three funds still do the work.", body: `VTI, VXUS and BND are ${money(coreValue)}. The rest of the book is commentary on that sentence. When the commentary gets louder than the sentence, the book has changed character.` },
  { id: "sat", title: "The satellites", quote: "A shortlist, not a strategy.", body: "Apple, Microsoft, NVIDIA, a bank, a hospital company, a retailer, a machine maker, a chip tool, an oil major. They are familiar because they are familiar. Familiar is not the same as sized." },
  { id: "cash", title: "The cash", quote: "A floor became a habit.", body: `${money(cashTotal)} earns a decent overnight rate and exceeds the five percent policy. Some of it is a tax bill. The rest is a decision that has not been made.` },
  { id: "abroad", title: "The missing abroad", quote: "Home is doing too much of the talking.", body: `${pct(homeWeight, 0, false)} of the book is the United States. The policy asked for a wider map. The international sleeve is the largest unfinished sentence.` },
];

export function D29a() {
  const [call, setCall] = useState("cash");
  const calls = [
    { id: "core", k: "Core", v: pct(coreValue / totalValue, 0, false) },
    { id: "cash", k: "Cash", v: pct(cashTotal / totalValue, 0, false) },
    { id: "home", k: "Home", v: pct(homeWeight, 0, false) },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", background: "#1a1612", color: "#f6efe6", minHeight: 420, fontFamily: "'Fraunces', serif" }}>
      <div style={{ background: `url(${photos.library}) center/cover`, minHeight: 420, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent, rgba(20,14,10,0.55))" }} />
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.18em" }}>ALLOCATION STORY</div>
        <h3 style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.05, margin: "10px 0" }}>A core, with a restless edge.</h3>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.5 }}>The Hale book is not a pile of ideas. It is a broad centre, a few opinions, and a cash balance that has started to have an opinion of its own.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {calls.map((c) => (
            <button key={c.id} onClick={() => setCall(c.id)} style={{ flex: 1, textAlign: "left", background: call === c.id ? "#f0c36a" : "transparent", color: call === c.id ? "#1a1612" : "#f6efe6", border: "1px solid #5c4d3c", padding: 8 }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11 }}>{c.k}</div>
              <div style={{ fontSize: 28 }}>{c.v}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function D29b() {
  const [id, setId] = useState(chapters[0].id);
  const ch = chapters.find((c) => c.id === id) ?? chapters[0];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", background: "#f7f1e8", color: "#231c16", minHeight: 340, fontFamily: "'Newsreader', serif" }}>
      <div style={{ borderRight: "1px solid #e4d5c4", padding: 12 }}>
        {chapters.map((c, i) => (
          <button key={c.id} onClick={() => setId(c.id)} style={{ display: "block", width: "100%", textAlign: "left", background: id === c.id ? "#231c16" : "transparent", color: id === c.id ? "#f7f1e8" : "#231c16", border: 0, padding: "10px 8px", fontSize: 18 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>{c.title}
          </button>
        ))}
      </div>
      <div style={{ padding: "28px 32px" }}>
        <div style={{ fontSize: 28, fontStyle: "italic" }}>“{ch.quote}”</div>
        <p style={{ fontSize: 18, lineHeight: 1.5 }}>{ch.body}</p>
      </div>
    </div>
  );
}

export function D29c() {
  const [n, setN] = useState(1);
  const marks = [
    { n: 1, name: "US Equity", text: "the tower" },
    { n: 2, name: "Intl Equity", text: "the gap" },
    { n: 3, name: "Cash", text: "the habit" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", background: "#fff", fontFamily: "'Source Serif 4', serif", color: "#1a1a1a" }}>
      <div style={{ padding: "24px 28px", fontSize: 18, lineHeight: 1.55 }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em" }}>A COLUMN</div>
        The allocation can be told in three marks. The first is the US equity sleeve
        <Sup on={n === 1} onClick={() => setN(1)} />
        , large enough to set the weather. The second is the international shortfall
        <Sup on={n === 2} onClick={() => setN(2)} />
        , which no quiet week will close. The third is cash
        <Sup on={n === 3} onClick={() => setN(3)} />
        , respectable in yield and slightly indecent in size.
      </div>
      <div style={{ borderLeft: "1px solid #eee", padding: 16 }}>
        {allocationRows.map((r) => {
          const mark = marks.find((m) => m.name === r.name);
          const hot = mark?.n === n;
          return (
            <button key={r.name} onClick={() => mark && setN(mark.n)} onMouseEnter={() => mark && setN(mark.n)} style={{ width: "100%", textAlign: "left", border: 0, background: hot ? "#fff6ee" : "transparent", padding: "6px 4px", color: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
                <span>{mark ? `${mark.n}. ` : ""}{r.name}</span><span>{pct(r.weight, 1, false)}</span>
              </div>
              <div style={{ height: 8, background: "#f3f3f3" }}><div style={{ width: `${r.weight * 100}%`, height: "100%", background: hot ? "#c4552a" : "#1a1a1a" }} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function Sup({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button onClick={onClick} style={{ border: 0, background: on ? "#f0e2c8" : "transparent", color: "#9c3b2e", fontSize: 12, verticalAlign: "super", padding: "0 2px" }}>{on ? "●" : "†"}</button>;
}

type Key = "ticker" | "price" | "qty" | "mv" | "gain" | "weight";

export function D30a() {
  const [q, setQ] = useState("");
  const [acc, setAcc] = useState("all");
  const [key, setKey] = useState<Key>("mv");
  const [dir, setDir] = useState<-1 | 1>(-1);
  const [open, setOpen] = useState<string | null>(null);
  let rows = positions.filter((p) => (acc === "all" || p.account === acc) && (`${p.ticker} ${p.name}`.toLowerCase().includes(q.toLowerCase())));
  rows = [...rows].sort((a, b) => {
    const av = a[key] as number | string;
    const bv = b[key] as number | string;
    return av > bv ? dir : av < bv ? -dir : 0;
  });
  function sort(k: Key) {
    if (k === key) setDir((d) => (d === 1 ? -1 : 1));
    else { setKey(k); setDir(k === "ticker" ? 1 : -1); }
  }
  return (
    <div style={{ background: "#f6f7f8", color: "#142033", fontFamily: "'IBM Plex Sans', sans-serif", padding: 12 }}>
      <style>{`.d30a-th{background:transparent;border:0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6d7c90;padding:6px;text-align:right}.d30a-row{width:100%;display:grid;grid-template-columns:1.5fr 80px 150px 110px 120px 90px;background:#fff;border:0;border-bottom:1px solid #e7edf3;padding:0;color:inherit;text-align:left}`}</style>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search holdings" style={{ border: "1px solid #d5dde6", padding: "6px 8px", flex: 1 }} />
        {[{ id: "all", short: "All" }, ...accounts].map((a) => (
          <button key={a.id} onClick={() => setAcc(a.id)} style={{ border: "1px solid #d5dde6", background: acc === a.id ? "#142033" : "#fff", color: acc === a.id ? "#fff" : "#142033", padding: "6px 8px" }}>{a.short}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 80px 150px 110px 120px 90px", background: "#fff" }}>
        <button className="d30a-th" style={{ textAlign: "left" }} onClick={() => sort("ticker")}>Name</button>
        <button className="d30a-th" onClick={() => sort("price")}>Price</button>
        <button className="d30a-th" onClick={() => sort("qty")}>Position</button>
        <button className="d30a-th" onClick={() => sort("mv")}>Value</button>
        <button className="d30a-th" onClick={() => sort("gain")}>Gain</button>
        <button className="d30a-th" onClick={() => sort("weight")}>Share</button>
      </div>
      {rows.map((p) => (
        <div key={p.ticker}>
          <button className="d30a-row" onClick={() => setOpen(open === p.ticker ? null : p.ticker)}>
            <span style={{ padding: 8 }}><b>{p.ticker}</b> <span style={{ color: "#6d7c90" }}>{p.name}</span></span>
            <span style={{ padding: 8, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{money(p.price, 2)}</span>
            <span style={{ padding: 8, textAlign: "right", fontSize: 12 }}>{p.qty.toLocaleString()} @ {money(p.avgCost, 2)}</span>
            <span style={{ padding: 8, textAlign: "right" }}>{money(p.mv)}</span>
            <span style={{ padding: 8, textAlign: "right", color: p.gain >= 0 ? "#1f7a4d" : "#a33b2b" }}>{money(p.gain, 0, true)} <small>{pct(p.gainP, 1)}</small></span>
            <span style={{ padding: 8 }}><i style={{ display: "block", height: 4, background: "#e7edf3" }}><b style={{ display: "block", height: "100%", width: `${Math.min(100, p.weight * 400)}%`, background: "#1d4e89" }} /></i>{pct(p.weight, 1, false)}</span>
          </button>
          {open === p.ticker && (
            <div style={{ background: "#eef3f8", padding: "8px 12px 10px", fontSize: 12 }}>
              {p.lots.map((lot) => (
                <div key={lot.date} style={{ display: "grid", gridTemplateColumns: "100px 80px 100px 60px 1fr", gap: 8, padding: "3px 0" }}>
                  <span>{lot.date}</span><span>{lot.qty} sh</span><span>cost {money(lot.cost, 2)}</span><span>{lot.term}</span>
                  <span style={{ color: p.price >= lot.cost ? "#1f7a4d" : "#a33b2b" }}>{money((p.price - lot.cost) * lot.qty, 0, true)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 12, color: "#6d7c90", marginTop: 6 }}>{rows.length} holdings · book {money(totalValue)} including cash not shown here.</div>
    </div>
  );
}

export function D30b() {
  const [closed, setClosed] = useState<string[]>([]);
  const groups = CLASS_ORDER.filter((n) => n !== "Cash").map((name) => {
    const rows = positions.filter((p) => p.assetClass === name);
    return { name, rows, value: rows.reduce((s, p) => s + p.mv, 0), gain: rows.reduce((s, p) => s + p.gain, 0) };
  });
  return (
    <div style={{ background: "#f3efe6", color: "#241c14", fontFamily: "'Source Serif 4', serif", padding: 12 }}>
      {groups.map((g) => {
        const shut = closed.includes(g.name);
        return (
          <div key={g.name} style={{ marginBottom: 8 }}>
            <button onClick={() => setClosed(shut ? closed.filter((x) => x !== g.name) : [...closed, g.name])} style={{ width: "100%", display: "flex", justifyContent: "space-between", background: "#241c14", color: "#f3efe6", border: 0, padding: "8px 12px", fontSize: 16 }}>
              <span>{g.name} · {g.rows.length}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>{money(g.value)} · {money(g.gain, 0, true)}</span>
            </button>
            {!shut && g.rows.map((p) => (
              <div key={p.ticker} style={{ display: "grid", gridTemplateColumns: "72px 1.3fr 90px 120px 90px 100px 70px", gap: 8, alignItems: "center", background: "#fffaf3", borderBottom: "1px solid #eadfce", padding: "7px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
                <b>{p.ticker}</b>
                <span>{p.name}</span>
                <Spark ticker={p.ticker} price={p.price} up={p.gain >= 0} />
                <span>{p.qty.toLocaleString()} @ {money(p.avgCost, 0)}</span>
                <span>{money(p.mv)}</span>
                <span style={{ color: p.gain >= 0 ? "#1f7a4d" : "#a33b2b" }}>{money(p.gain, 0, true)}</span>
                <span>{pct(p.weight, 1, false)}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Spark({ ticker, price, up }: { ticker: string; price: number; up: boolean }) {
  const pts = scale(spark(ticker, price, 22), 84, 26, 2);
  return <svg width="84" height="26" viewBox="0 0 84 26"><path d={line(pts)} fill="none" stroke={up ? "#1f7a4d" : "#a33b2b"} strokeWidth="1.4" /></svg>;
}

const extraCols = ["day", "sector", "account", "yield"] as const;

export function D30c() {
  const [q, setQ] = useState("");
  const [dense, setDense] = useState(false);
  const [gainMode, setGainMode] = useState<"$" | "%">("$");
  const [cols, setCols] = useState<Record<(typeof extraCols)[number], boolean>>({ day: true, sector: false, account: true, yield: false });
  const [sel, setSel] = useState(positions[0].ticker);
  const rows = positions.filter((p) => `${p.ticker} ${p.name}`.toLowerCase().includes(q.toLowerCase()));
  const selected = positions.find((p) => p.ticker === sel) ?? rows[0];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", background: "#0f1412", color: "#e7efe9", fontFamily: "'IBM Plex Sans', sans-serif", minHeight: 460 }}>
      <div style={{ padding: 12, overflow: "auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" style={{ background: "#1a2420", color: "#e7efe9", border: "1px solid #2c3d36", padding: "6px 8px" }} />
          <button onClick={() => setDense((v) => !v)} style={{ background: "transparent", color: "#e7efe9", border: "1px solid #2c3d36", padding: "6px 8px" }}>{dense ? "Comfortable" : "Compact"}</button>
          <button onClick={() => setGainMode(gainMode === "$" ? "%" : "$")} style={{ background: "transparent", color: "#e7efe9", border: "1px solid #2c3d36", padding: "6px 8px" }}>Gain in {gainMode === "$" ? "%" : "$"}</button>
          {extraCols.map((c) => (
            <label key={c} style={{ fontSize: 12 }}><input type="checkbox" checked={cols[c]} onChange={() => setCols({ ...cols, [c]: !cols[c] })} /> {c}</label>
          ))}
        </div>
        <div style={{ minWidth: 760 }}>
          {rows.map((p) => (
            <button key={p.ticker} onClick={() => setSel(p.ticker)} style={{ width: "100%", display: "grid", gridTemplateColumns: `120px 1fr 80px 130px 110px ${cols.day ? "90px" : ""} ${cols.sector ? "120px" : ""} ${cols.account ? "110px" : ""} ${cols.yield ? "70px" : ""}`, gap: 6, textAlign: "left", background: sel === p.ticker ? "#1e3330" : "transparent", color: "inherit", border: 0, borderBottom: "1px solid #1e2b27", padding: dense ? "4px 2px" : "8px 2px", fontSize: dense ? 12 : 13 }}>
              <b>{p.ticker}</b>
              <span style={{ color: "#9fb0a6" }}>{p.name}</span>
              <span>{money(p.price, 2)}</span>
              <span>{p.qty.toLocaleString()} @ {money(p.avgCost, 0)}</span>
              <span>{money(p.mv)}</span>
              <span style={{ color: p.gain >= 0 ? "#9dffa8" : "#ffb4a8" }}>{gainMode === "$" ? money(p.gain, 0, true) : pct(p.gainP, 1)}</span>
              {cols.day && <span>{pct(p.dayPct, 2)}</span>}
              {cols.sector && <span>{p.sector}</span>}
              {cols.account && <span>{accounts.find((a) => a.id === p.account)?.short}</span>}
              {cols.yield && <span>{pct(p.yieldFwd, 1, false)}</span>}
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <aside style={{ background: "#17211e", padding: 16, borderLeft: "1px solid #24332e" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#9fb0a6" }}>POSITION</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36 }}>{selected.ticker}</div>
          <div style={{ color: "#9fb0a6" }}>{selected.name}</div>
          <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
            Price {money(selected.price, 2)}<br />
            {selected.qty.toLocaleString()} shares at {money(selected.avgCost, 2)}<br />
            Value {money(selected.mv)} · {pct(selected.weight, 2, false)} of the book<br />
            Gain {money(selected.gain, 0, true)} ({pct(selected.gainP, 1)})<br />
            Today {money(selected.day, 0, true)}<br />
            Account {accounts.find((a) => a.id === selected.account)?.name}<br />
            Sector {selected.sector}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#9fb0a6" }}>{selected.lots.length} lots · {selected.lots.filter((l) => l.term === "LT").length} long-term</div>
        </aside>
      )}
    </div>
  );
}
