"use client";

import { useMemo, useState } from "react";
import { JOB_RECORDS, JOB_META } from "@/lib/jobSearchData";

const BAR = "#b09f88"; // sand — one week's applications

// geometry (same x-scale as JobSearchTimeline so the two line up when placed together)
const W = 920, PX = 16, LABELW = 132;
const PLOT_R = W - PX - LABELW;
const T0 = +new Date("2026-04-01T00:00:00"), T1 = +new Date("2026-07-27T00:00:00");
const xOf = (s: string) => PX + (+new Date(s + "T00:00:00") - T0) / (T1 - T0) * (PLOT_R - PX);
const TOPPAD = 40, BARSTOP = 48, BASEY = BARSTOP + 70, H = BASEY + 28;

export default function JobSearchWeekly() {
  const [tip, setTip] = useState<{ label: string; x: number; y: number } | null>(null);

  const d = useMemo(() => {
    const from = +new Date(JOB_META.from + "T00:00:00");
    const wkOf = (s: string) => Math.max(0, Math.floor((+new Date(s + "T00:00:00") - from) / (7 * 864e5)));
    const cnt: Record<number, number> = {};
    JOB_RECORDS.forEach((r) => { cnt[wkOf(r.d)] = (cnt[wkOf(r.d)] || 0) + 1; });
    const nWeeks = Math.max(...Object.keys(cnt).map(Number)) + 1;
    const weeks = Array.from({ length: nWeeks }, (_, i) => ({ i, n: cnt[i] || 0, mid: new Date(from + i * 7 * 864e5 + 3.5 * 864e5).toISOString().slice(0, 10) }));
    return { total: JOB_RECORDS.length, weeks, peak: Math.max(...weeks.map((w) => w.n)) };
  }, []);

  const barW = ((PLOT_R - PX) / d.weeks.length) * 0.62;
  const months = [["2026-04-01", "Apr"], ["2026-05-01", "May"], ["2026-06-01", "Jun"], ["2026-07-01", "Jul"]] as const;

  return (
    <section className="not-prose font-sans text-foreground">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 560, maxWidth: W }} onMouseLeave={() => setTip(null)}>
          <text x={PX} y="14" fontSize="11" fontWeight="600" letterSpacing="0.06em" fill="#6b6058">EVERY APPLICATION, BY WEEK</text>
          {months.map(([m, lab]) => (
            <g key={m}>
              <line x1={xOf(m)} y1={TOPPAD} x2={xOf(m)} y2={BASEY} stroke="#e0d4c2" />
              <text x={xOf(m) + 4} y={TOPPAD - 6} fontSize="11.5" fill="#8a7d70">{lab}</text>
            </g>
          ))}
          {d.weeks.map((w) => {
            if (!w.n) return null;
            const h = (w.n / d.peak) * (BASEY - BARSTOP - 6), cx = xOf(w.mid);
            return (
              <g key={w.i} onMouseMove={(e) => setTip({ label: `${w.n} applications`, x: e.clientX, y: e.clientY })}>
                <rect x={cx - barW / 2} y={BASEY - h} width={barW} height={h} rx={3} fill={BAR} />
                <text x={cx} y={BASEY - h - 5} textAnchor="middle" fontSize="9.5" fontWeight="500" fill="#8a7d70">{w.n}</text>
              </g>
            );
          })}
          <line x1={PX} y1={BASEY} x2={PLOT_R} y2={BASEY} stroke="#c9bda9" />
          <text x={PX} y={BASEY + 16} fontSize="10.5" fill="#8a7d70">{d.total} applications · peaked at {d.peak} in one week</text>
        </svg>
      </div>

      {tip && (
        <div className="pointer-events-none fixed z-50 max-w-[250px] rounded-lg bg-foreground px-3 py-2 text-[12px] leading-snug text-background shadow-lg"
          style={{ left: Math.min(tip.x + 14, (typeof window !== "undefined" ? window.innerWidth : 9999) - 260), top: tip.y + 14 }}>
          <div className="font-semibold">{tip.label}</div>
        </div>
      )}
    </section>
  );
}
