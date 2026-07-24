"use client";

import { useMemo, useState } from "react";
import { JOB_RECORDS, JOB_META, type JobRecord } from "@/lib/jobSearchData";

const RANK: Record<string, number> = { applied: 0, recruiter: 1, hm: 2, onsite: 3, offer: 4 };
const ACTIVE = "#b5714e"; // terracotta — still in play
const ENDED = "#6b6058"; // muted — ended
const colorOf = (o: string) => (o === "active" ? ACTIVE : ENDED);
const STAGE_LABEL: Record<string, string> = { recruiter: "Recruiter screen", hm: "HM", onsite: "Onsite / final", offer: "Offer" };
const OUTCOME_LABEL: Record<string, string> = { active: "in play", rejected: "rejected", withdrew: "role closed", ghosted: "no reply", offer: "offer", unknown: "" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (s: string) => { const [, mo, da] = s.split("-"); return `${MONTHS[+mo - 1]} ${+da}`; };

// geometry
const W = 920, PX = 16, LABELW = 132;
const PLOT_R = W - PX - LABELW;
const T0 = +new Date("2026-04-01T00:00:00"), T1 = +new Date("2026-07-27T00:00:00");
const xOf = (s: string) => PX + (+new Date(s + "T00:00:00") - T0) / (T1 - T0) * (PLOT_R - PX);
const ROW = 22, TOPPAD = 40;

export default function JobSearchTimeline({ showIntro = true }: { showIntro?: boolean } = {}) {
  const [tip, setTip] = useState<{ r: JobRecord; x: number; y: number } | null>(null);

  const d = useMemo(() => {
    const total = JOB_RECORDS.length;
    const ge = (k: number) => JOB_RECORDS.filter((r) => RANK[r.t] >= k).length;
    const journeys = JOB_RECORDS.filter((r) => RANK[r.t] >= 1).sort((a, b) => a.d.localeCompare(b.d));
    const active = JOB_RECORDS.filter((r) => r.o === "active" && RANK[r.t] >= 1).length;
    const from = +new Date(JOB_META.from + "T00:00:00");
    const wkOf = (s: string) => Math.max(0, Math.floor((+new Date(s + "T00:00:00") - from) / (7 * 864e5)));
    const cnt: Record<number, number> = {};
    JOB_RECORDS.forEach((r) => { cnt[wkOf(r.d)] = (cnt[wkOf(r.d)] || 0) + 1; });
    const nWeeks = Math.max(...Object.keys(cnt).map(Number)) + 1;
    const weeks = Array.from({ length: nWeeks }, (_, i) => ({ i, n: cnt[i] || 0, mid: new Date(from + i * 7 * 864e5 + 3.5 * 864e5).toISOString().slice(0, 10) }));
    const peak = Math.max(...weeks.map((w) => w.n));
    return { total, journeys, reachedHuman: ge(1), active, co: JOB_META.companies, weeks, peak };
  }, []);

  const pct = (n: number) => Math.round((100 * n) / d.total);
  const jH = TOPPAD + d.journeys.length * ROW + 8;
  const barsTop = jH + 34, barsH = 92, baseY = barsTop + barsH - 22;
  const barW = ((PLOT_R - PX) / d.weeks.length) * 0.62;
  const H = barsTop + barsH + 6;
  const months = [["2026-04-01", "Apr"], ["2026-05-01", "May"], ["2026-06-01", "Jun"], ["2026-07-01", "Jul"]] as const;

  return (
    <section className="not-prose font-sans text-foreground">
      {showIntro && (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Spring–summer 2026</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{d.total} applications in one search</h2>
        </>
      )}

      <div className={`${showIntro ? "mt-6" : ""} grid grid-cols-2 gap-3 sm:grid-cols-4`}>
        {([[d.total, "applications"], [`${d.co}`, "companies"], [`${d.reachedHuman}`, `reached a human · ${pct(d.reachedHuman)}%`], [`${d.active}`, "still in play"]] as [string | number, string][]).map(([v, k], i) => (
          <div key={i} className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--background),white_45%)] px-4 py-3">
            <div className="font-mono text-2xl font-bold tracking-tight tabular-nums">{v}</div>
            <div className="mt-0.5 text-[11.5px] leading-tight text-muted">{k}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: ACTIVE }} /> still in play</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: ENDED }} /> ended</span>
        <span className="text-[12px]">● a round · ◇ rejected · ○ open</span>
      </div>

      <div className="mt-3 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 560, maxWidth: W }} onMouseLeave={() => setTip(null)}>
          <text x={PX} y="14" fontSize="11" fontWeight="600" letterSpacing="0.06em" fill="#6b6058">THE {d.journeys.length} THAT GOT A REPLY</text>
          {months.map(([m, lab]) => (
            <g key={m}>
              <line x1={xOf(m)} y1={TOPPAD} x2={xOf(m)} y2={baseY} stroke="#e0d4c2" />
              <text x={xOf(m) + 4} y={TOPPAD - 6} fontSize="11.5" fill="#8a7d70">{lab}</text>
            </g>
          ))}
          {d.journeys.map((a, i) => {
            const y = TOPPAD + i * ROW + ROW / 2;
            const x0 = xOf(a.d), x1 = Math.max(xOf(a.en), x0 + 6), c = colorOf(a.o);
            const on = a.o === "active";
            const dots = a.sd.length ? a.sd : [a.d];
            const label = `${STAGE_LABEL[a.t] || ""}${OUTCOME_LABEL[a.o] ? " · " + OUTCOME_LABEL[a.o] : ""}`;
            return (
              <g key={i} onMouseMove={(e) => setTip({ r: a, x: e.clientX, y: e.clientY })}>
                <line x1={x0} y1={y} x2={x1} y2={y} stroke={c} strokeWidth={on ? 4 : 3.2} strokeLinecap="round" strokeDasharray={a.o === "ghosted" ? "1.5 3.5" : undefined} />
                {dots.map((dd, j) => <circle key={j} cx={xOf(dd)} cy={y} r={3.4} fill={c} stroke="var(--background)" strokeWidth={1.4} />)}
                {a.o === "rejected" || a.o === "withdrew" ? (
                  <rect x={x1 - 3.4} y={y - 3.4} width={6.8} height={6.8} transform={`rotate(45 ${x1} ${y})`} fill={c} />
                ) : on ? (
                  <circle cx={x1} cy={y} r={4.6} fill="var(--background)" stroke={ACTIVE} strokeWidth={2.4} />
                ) : null}
                <text x={x1 + 9} y={y + 3.6} fontSize="11" fill={c} fontWeight={on ? 600 : 400}>{label}</text>
                <rect x={0} y={y - ROW / 2} width={W} height={ROW} fill="transparent" />
              </g>
            );
          })}
          <text x={PX} y={barsTop - 22} fontSize="11" fontWeight="600" letterSpacing="0.06em" fill="#6b6058">EVERY APPLICATION, BY WEEK</text>
          {d.weeks.map((w) => {
            if (!w.n) return null;
            const h = (w.n / d.peak) * (baseY - barsTop - 6), cx = xOf(w.mid);
            return (
              <g key={w.i} onMouseMove={(e) => setTip({ r: { f: `${w.n} applications`, t: "applied", o: "unknown", w: false, d: w.mid, en: w.mid, sd: [] }, x: e.clientX, y: e.clientY })}>
                <rect x={cx - barW / 2} y={baseY - h} width={barW} height={h} rx={3} fill="#b09f88" />
                <text x={cx} y={baseY - h - 5} textAnchor="middle" fontSize="9.5" fontWeight="500" fill="#8a7d70">{w.n}</text>
              </g>
            );
          })}
          <line x1={PX} y1={baseY} x2={PLOT_R} y2={baseY} stroke="#c9bda9" />
          <text x={PX} y={baseY + 16} fontSize="10.5" fill="#8a7d70">{d.total} applications · peaked at {d.peak} in one week</text>
        </svg>
      </div>

      <p className="mt-6 text-[11.5px] leading-relaxed text-muted">
        Each lifeline is one application that got a reply — dots mark the rounds, the label its furthest stage and outcome.
        Companies anonymized, roles generalized; onsite and final rounds counted as one. The search is ongoing.
      </p>

      {tip && (
        <div className="pointer-events-none fixed z-50 max-w-[250px] rounded-lg bg-foreground px-3 py-2 text-[12px] leading-snug text-background shadow-lg"
          style={{ left: Math.min(tip.x + 14, (typeof window !== "undefined" ? window.innerWidth : 9999) - 260), top: tip.y + 14 }}>
          <div className="font-semibold">{tip.r.f}</div>
          {tip.r.t !== "applied" || tip.r.sd.length ? (
            <>
              <div className="opacity-85">{STAGE_LABEL[tip.r.t] || "Applied"} · {OUTCOME_LABEL[tip.r.o] || tip.r.o}</div>
              <div className="mt-0.5 font-mono text-[11px] tabular-nums opacity-70">{fmtDay(tip.r.d)} → {tip.r.o === "active" ? "now" : fmtDay(tip.r.en)} · {tip.r.sd.length || 1} round{(tip.r.sd.length || 1) === 1 ? "" : "s"}</div>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
}
