"use client";

import { useMemo, useState } from "react";
import { JOB_RECORDS } from "@/lib/jobSearchData";

const RANK: Record<string, number> = { applied: 0, recruiter: 1, hm: 2, onsite: 3, offer: 4 };
const ACTIVE = "#b5714e"; // terracotta — advancing / still in play
const NOTSEL = "#8a7d70"; // muted gray — not selected
const CLOSED = "#cabfad"; // pale tan — role closed (neutral, not a rejection) / never heard back

// horizontal-flow ribbon: vertical segment at x0 (y0a..y0b) → vertical segment at x1 (y1a..y1b)
function ribbon(x0: number, y0a: number, y0b: number, x1: number, y1a: number, y1b: number) {
  const xm = (x0 + x1) / 2;
  return `M${x0},${y0a} C${xm},${y0a} ${xm},${y1a} ${x1},${y1a} L${x1},${y1b} C${xm},${y1b} ${xm},${y0b} ${x0},${y0b} Z`;
}

const W = 920, PX = 4;
// cliff bar
const CTOP = 22, CH = 30;
// sankey of the 12
const S = 12;               // px per application
const NW = 15;              // node width
const STOP = 150;           // top edge of the advancing spine
const RECX = 70, HMX = 280, ONX = 490, PLAYX = 720; // spine columns
const NSX = 580, RCX = 700; // terminal columns (offset from ONX so the onsite drop flows diagonally, not as a vertical hairline)

export default function JobSearchFunnel() {
  const [tip, setTip] = useState<{ label: string; sub: string; x: number; y: number } | null>(null);

  const d = useMemo(() => {
    const ge = (k: number) => JOB_RECORDS.filter((r) => RANK[r.t] >= k).length;
    const total = JOB_RECORDS.length;
    const reachedHuman = ge(1);
    const hm = ge(2);
    const onsite = ge(3);
    const inPlay = JOB_RECORDS.filter((r) => r.o === "active" && RANK[r.t] >= 1).length;
    const roleClosed = JOB_RECORDS.filter((r) => r.o === "withdrew" && RANK[r.t] >= 1).length;
    const notSelected = reachedHuman - inPlay - roleClosed; // all rejections/ghosts after a human, merged
    const noReply = total - reachedHuman;
    // drop-off counts feeding the single "Not selected" terminal
    const dropRec = reachedHuman - hm;          // ended at the recruiter screen
    const dropHM = hm - onsite;                 // ended after the HM round
    const onsiteReject = onsite - inPlay - roleClosed; // the one rejection that reached the final stage
    return { total, reachedHuman, hm, onsite, inPlay, roleClosed, notSelected, noReply, dropRec, dropHM, onsiteReject };
  }, []);

  const hRec = d.reachedHuman * S, hHM = d.hm * S, hOn = d.onsite * S, hPlay = d.inPlay * S;
  const NSY = STOP + hRec + 64;   // baseline of the two gray terminals, below the spine
  const H = NSY + d.notSelected * S + 20;
  const barW = W - PX * 2;
  const cliffTerr = (d.reachedHuman / d.total) * barW;

  const show = (label: string, sub: string) => (e: React.MouseEvent) => setTip({ label, sub, x: e.clientX, y: e.clientY });

  return (
    <section className="not-prose font-sans text-foreground">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: ACTIVE }} /> reached a human / still in play</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: NOTSEL }} /> not selected</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: CLOSED }} /> role closed / never heard back</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 600, maxWidth: W }} onMouseLeave={() => setTip(null)}>
          {/* ── the cliff: how many of everything sent reached a human ── */}
          <text x={PX} y={CTOP - 4} fontSize="11" fontWeight={600} letterSpacing="0.04em" fill="#6b6058">EVERY APPLICATION — DID IT REACH A HUMAN?</text>
          <rect x={PX} y={CTOP + 8} width={barW} height={CH} rx={4} fill={CLOSED}
            onMouseMove={show(`${d.noReply} never heard back`, `${Math.round((100 * d.noReply) / d.total)}% of everything I sent`)} />
          <rect x={PX} y={CTOP + 8} width={cliffTerr} height={CH} rx={4} fill={ACTIVE}
            onMouseMove={show(`${d.reachedHuman} reached a human`, `${Math.round((100 * d.reachedHuman) / d.total)}% of ${d.total} applications`)} />
          <text x={PX + cliffTerr / 2} y={CTOP + 8 + CH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight={700} fill="#fff">{d.reachedHuman}</text>
          <text x={PX + cliffTerr + 10} y={CTOP + 8 + CH / 2 + 4} fontSize="12" fill="#7a6e60"><tspan fontWeight={700} fill="#2b2522">{d.noReply}</tspan> never heard back — {Math.round((100 * d.noReply) / d.total)}% of everything I sent</text>

          {/* ── the funnel of the 12 that got a reply ── */}
          <text x={PX} y={STOP - 58} fontSize="11" fontWeight={600} letterSpacing="0.04em" fill="#6b6058">WHAT HAPPENED TO THOSE {d.reachedHuman}</text>

          {/* advancing terracotta spine (top-aligned, narrowing left→right) */}
          {([
            [RECX + NW, HMX, hHM],
            [HMX + NW, ONX, hOn],
            [ONX + NW, PLAYX, hPlay],
          ] as const).map(([x0, x1, h], i) => (
            <path key={"a" + i} d={ribbon(x0, STOP, STOP + h, x1, STOP, STOP + h)} fill={ACTIVE} opacity={0.9} />
          ))}

          {/* gray drop ribbons → the single "Not selected" terminal (bands ordered by source height, no crossings) */}
          <g onMouseMove={show(`${d.onsiteReject + d.dropHM + d.dropRec} not selected`, "every rejection, whatever stage it ended at")}>
            {/* onsite rejection (highest source) → top band of the terminal */}
            <path d={ribbon(ONX + NW, STOP + 2 * S, STOP + 3 * S, NSX, NSY, NSY + d.onsiteReject * S)} fill={NOTSEL} opacity={0.7} />
            {/* HM-round drop → middle band */}
            <path d={ribbon(HMX + NW, STOP + hOn, STOP + hHM, NSX, NSY + d.onsiteReject * S, NSY + (d.onsiteReject + d.dropHM) * S)} fill={NOTSEL} opacity={0.7} />
            {/* recruiter-screen drop (lowest source) → bottom band */}
            <path d={ribbon(RECX + NW, STOP + hHM, STOP + hRec, NSX, NSY + (d.onsiteReject + d.dropHM) * S, NSY + d.notSelected * S)} fill={NOTSEL} opacity={0.7} />
          </g>

          {/* role-closed ribbon → its own separate terminal */}
          <path d={ribbon(ONX + NW, STOP + S, STOP + 2 * S, RCX, NSY, NSY + d.roleClosed * S)} fill={CLOSED} opacity={0.85}
            onMouseMove={show(`${d.roleClosed} role closed`, "reached the final round, then the role was pulled — not a rejection")} />

          {/* spine stage nodes */}
          {([
            [RECX, hRec, d.reachedHuman, "Recruiter screen"],
            [HMX, hHM, d.hm, "HM"],
            [ONX, hOn, d.onsite, "Onsite / final"],
            [PLAYX, hPlay, d.inPlay, "Still in play"],
          ] as const).map(([x, h, n, label], i) => (
            <g key={"n" + i} onMouseMove={show(`${n} reached ${label.toLowerCase()}`, "")}>
              <text x={x + NW / 2} y={STOP - 30} textAnchor="middle" fontSize="10.5" fill="#8a7d70">{label}</text>
              <text x={x + NW / 2} y={STOP - 14} textAnchor="middle" fontSize="14" fontWeight={700} fill="#2b2522" fontFamily="ui-monospace, monospace">{n}</text>
              <rect x={x} y={STOP} width={NW} height={h} rx={2.5} fill={ACTIVE} />
            </g>
          ))}

          {/* gray terminal nodes */}
          {([
            [NSX, d.notSelected * S, d.notSelected, "Not selected", NOTSEL],
            [RCX, d.roleClosed * S, d.roleClosed, "Role closed", CLOSED],
          ] as const).map(([x, h, n, label, fill], i) => (
            <g key={"t" + i} onMouseMove={show(`${n} ${label.toLowerCase()}`, i === 0 ? "every rejection, whatever stage it ended at" : "the role was pulled — not a rejection")}>
              <text x={x + NW / 2} y={NSY - 30} textAnchor="middle" fontSize="10.5" fill="#8a7d70">{label}</text>
              <text x={x + NW / 2} y={NSY - 14} textAnchor="middle" fontSize="14" fontWeight={700} fill="#2b2522" fontFamily="ui-monospace, monospace">{n}</text>
              <rect x={x} y={NSY} width={NW} height={h} rx={2.5} fill={fill as string} />
            </g>
          ))}
        </svg>
      </div>

      {tip && (
        <div className="pointer-events-none fixed z-50 max-w-[240px] rounded-lg bg-foreground px-3 py-2 text-[12px] leading-snug text-background shadow-lg"
          style={{ left: Math.min(tip.x + 14, (typeof window !== "undefined" ? window.innerWidth : 9999) - 250), top: tip.y + 14 }}>
          <div className="font-semibold">{tip.label}</div>
          {tip.sub && <div className="opacity-80">{tip.sub}</div>}
        </div>
      )}
    </section>
  );
}
