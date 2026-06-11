"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Inbox } from "lucide-react";
import SunMark from "@/components/SunMark";

// Stamp used in the ledger mock — slightly rotated, like it was pressed by hand.
function Stamp({
  label,
  tone,
  tilt = "-rotate-2",
}: {
  label: string;
  tone: string;
  tilt?: string;
}) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.16em] ${tone} ${tilt}`}
    >
      {label}
    </span>
  );
}

const ledgerEntries = [
  {
    role: "Frontend Engineer",
    company: "Solara Systems",
    date: "Mon · 09:14",
    stamp: { label: "Interview", tone: "text-marigold border-marigold/50 bg-marigold/10", tilt: "-rotate-2" },
  },
  {
    role: "Product Designer",
    company: "Fernwood & Co.",
    date: "Tue · 16:02",
    stamp: { label: "Applied", tone: "text-dusk border-dusk/50 bg-dusk/10", tilt: "rotate-1" },
  },
  {
    role: "Full-stack Developer",
    company: "Halcyon Labs",
    date: "Thu · 11:47",
    stamp: { label: "Offer", tone: "text-moss border-moss/50 bg-moss/10", tilt: "-rotate-1" },
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-paper">
      {/* Rising-sun arcs behind the ledger, upper right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] hidden lg:block"
      >
        <svg width="640" height="640" viewBox="0 0 640 640" fill="none">
          {[300, 240, 180, 120].map((r, i) => (
            <circle
              key={r}
              cx="320"
              cy="320"
              r={r}
              stroke="var(--clay)"
              strokeOpacity={0.07 + i * 0.025}
              strokeWidth="1.5"
            />
          ))}
          <circle cx="320" cy="320" r="64" fill="var(--clay)" fillOpacity="0.08" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-24 lg:px-10 lg:pt-20 lg:pb-32">
        {/* Top meta strip */}
        <div className="rise rise-1 mb-14 flex items-center justify-between gap-6 border-b border-line pb-5 lg:mb-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft">
            Job Trackr — desk edition
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft sm:inline">
            A warmer job hunt
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left — copy */}
          <div className="max-w-2xl lg:col-span-7">
            <div className="rise rise-1 mb-8 flex items-center gap-3">
              <SunMark className="h-5 w-5 text-clay" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                For job seekers, by one
              </span>
            </div>

            <h1 className="rise rise-2 font-display text-5xl leading-[1.04] tracking-[-0.01em] text-ink sm:text-6xl lg:text-[5.5rem]">
              Apply boldly.
              <br />
              We&apos;ll keep{" "}
              <em className="relative inline-block whitespace-nowrap text-clay">
                the ledger
                {/* hand-drawn underline */}
                <svg
                  aria-hidden
                  viewBox="0 0 220 14"
                  className="absolute -bottom-2 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 10 C 60 2, 150 2, 216 8"
                    stroke="var(--clay)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              </em>
              .
            </h1>

            <p className="rise rise-3 mt-9 max-w-xl text-lg leading-relaxed text-ink-soft lg:text-xl">
              Connect your inbox once. Job Trackr reads application
              confirmations, interview invites and rejections as they arrive —
              and files each one neatly, so the spreadsheet can finally rest.
            </p>

            {/* CTAs */}
            <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/auth"
                className="group inline-flex items-center gap-3 rounded-full bg-clay py-3 pr-3 pl-7 text-sm font-semibold text-paper shadow-[0_12px_24px_-12px_rgba(184,69,31,0.6)] transition-colors duration-300 hover:bg-clay-deep"
              >
                Start your ledger
                <span className="grid h-8 w-8 place-items-center rounded-full bg-paper/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </Link>
              <Link
                href="#how-it-works"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-clay"
              >
                See how it works
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>

            {/* Honest meta */}
            <div className="rise rise-5 mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              {["Free forever", "Read-only Gmail", "No credit card"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="block h-1 w-1 rounded-full bg-clay/60" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right — the ledger */}
          <div className="rise rise-3 lg:col-span-5 lg:pt-4">
            <figure className="relative mx-auto max-w-md">
              {/* Main ledger card */}
              <div className="relative rounded-2xl border border-line bg-card p-6 shadow-[0_1px_0_0_rgba(50,38,26,0.04),0_36px_72px_-32px_rgba(50,38,26,0.35)]">
                <div className="mb-5 flex items-baseline justify-between border-b border-dashed border-line pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                    This week
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-clay">
                    3 entries
                  </span>
                </div>

                <ul className="space-y-5">
                  {ledgerEntries.map((entry) => (
                    <li
                      key={entry.company}
                      className="flex items-start justify-between gap-4 border-b border-dashed border-line pb-5 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-display text-lg leading-snug text-ink">
                          {entry.role}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {entry.company}
                        </p>
                        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                          {entry.date}
                        </p>
                      </div>
                      <Stamp
                        label={entry.stamp.label}
                        tone={entry.stamp.tone}
                        tilt={entry.stamp.tilt}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Review slip, tucked under the corner */}
              <div className="absolute -bottom-10 -left-4 w-64 -rotate-3 rounded-xl border border-dashed border-clay/50 bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(50,38,26,0.4)] sm:-left-8">
                <div className="mb-2 flex items-center gap-2">
                  <Inbox className="h-3.5 w-3.5 text-clay" strokeWidth={2} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-clay">
                    Review queue · 1 waiting
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-ink-soft">
                  Looks like an interview invite from Solara — file it?
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper">
                    Approve
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">
                    Skip
                  </span>
                </div>
              </div>

              <figcaption className="mt-16 flex items-baseline justify-between gap-4 px-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                  Fig. 01
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                  Applications, kept warm
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Hairline divider closing the section */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </section>
  );
}
