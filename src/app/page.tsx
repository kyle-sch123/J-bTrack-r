"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Inbox,
  ListChecks,
  ShieldCheck,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/sections/navbar";
import HeroSection from "@/sections/heroSection";
import Footer from "@/sections/footer";
import SunMark from "@/components/SunMark";

// ─── Honest content ─────────────────────────────────────────────────────────

const features = [
  {
    icon: FileText,
    title: "Application tracking",
    description:
      "Every application in one place — company, role, status, dates, notes, and a link back to the original email thread.",
  },
  {
    icon: Calendar,
    title: "Interview details, lifted",
    description:
      "Interview dates, times, and types are pulled out of invites automatically — no calendar wrangling.",
  },
  {
    icon: BarChart3,
    title: "A quiet dashboard",
    description:
      "See your application volume, status mix, and how long things have been pending at a glance.",
  },
  {
    icon: Bell,
    title: "A review queue, not alerts",
    description:
      "When the AI isn't certain about an email, it lands in a calm review queue. No push notifications.",
  },
  {
    icon: Users,
    title: "Recruiter details, captured",
    description:
      "Recruiter names, emails, and phone numbers are extracted from your conversations as they happen.",
  },
  {
    icon: Shield,
    title: "Read-only by design",
    description:
      "Gmail is connected with a read-only scope. You disconnect at any time — your data, your control.",
  },
];

const steps = [
  {
    icon: Inbox,
    eyebrow: "Step 01",
    title: "Connect your inbox.",
    description:
      "A read-only OAuth grant with Google. Job Trackr only sees email — never sends, never edits, never deletes.",
    meta: "Read-only OAuth · 30 seconds",
    tilt: "lg:-rotate-1",
  },
  {
    icon: Sparkles,
    eyebrow: "Step 02",
    title: "We read quietly.",
    description:
      "Application confirmations, interview invites, rejections and offers are parsed into structured entries as they arrive — a rule-based pass first, an AI pass when it's actually needed.",
    meta: "Hybrid parsing · every 15 min",
    tilt: "lg:rotate-1 lg:translate-y-4",
  },
  {
    icon: ListChecks,
    eyebrow: "Step 03",
    title: "You stay in control.",
    description:
      "Confident entries are filed automatically. Anything uncertain waits for you in a review queue — approve, edit, or skip in a click.",
    meta: "Review queue · you decide",
    tilt: "lg:-rotate-1",
  },
];

const credo = [
  { k: "Free forever", v: "No tiers, no upgrade prompts" },
  { k: "Privacy first", v: "Read-only Gmail access" },
  { k: "Honest about limits", v: "A review queue catches AI mistakes" },
  { k: "Solo built", v: "By someone who has been there" },
];

// Section eyebrow — dashed rule with a small sun
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <SunMark className="h-4 w-4 text-clay" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        {children}
      </span>
      <span className="block h-px w-10 border-t border-dashed border-clay/50" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <Navbar />
      <HeroSection />

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="relative bg-card">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Sticky header */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Eyebrow>What&apos;s inside</Eyebrow>
                <h2 className="font-display text-4xl leading-[1.06] tracking-[-0.01em] lg:text-5xl">
                  Small features,
                  <br />
                  <em className="text-clay">thoughtfully</em> arranged.
                </h2>
                <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">
                  Nothing flashy. Just the things a job seeker actually wants —
                  and nothing that gets in the way.
                </p>
              </div>
            </div>

            {/* Ledger rows */}
            <div className="lg:col-span-8">
              <ul className="border-t border-line">
                {features.map((f, i) => (
                  <li
                    key={f.title}
                    className="group grid grid-cols-[auto_1fr] items-start gap-x-6 border-b border-line py-8 transition-colors duration-300 sm:grid-cols-[auto_auto_1fr] sm:gap-x-8 lg:py-9"
                  >
                    <span className="pt-1 font-display text-3xl text-ink-faint transition-colors duration-300 group-hover:text-clay lg:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden pt-2 sm:grid sm:h-10 sm:w-10 sm:place-items-center sm:rounded-lg sm:bg-paper sm:text-ink-soft sm:transition-colors sm:duration-300 group-hover:sm:bg-clay-wash group-hover:sm:text-clay">
                      <f.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-ink lg:text-2xl">
                        {f.title}
                      </h3>
                      <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">
                        {f.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative border-y border-line bg-parch"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="mb-16 max-w-2xl lg:mb-24">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.06] tracking-[-0.01em] lg:text-5xl">
              Three quiet steps.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              From a one-time OAuth grant to a tracked application takes about
              as long as making coffee.
            </p>
          </div>

          {/* Postcards, pinned slightly askew */}
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            {/* Dashed thread connecting the cards */}
            <div
              aria-hidden
              className="absolute top-1/2 right-8 left-8 hidden border-t border-dashed border-ink-faint/40 lg:block"
            />

            {steps.map((step) => (
              <div
                key={step.title}
                className={`relative rounded-2xl border border-line bg-card p-8 shadow-[0_28px_56px_-32px_rgba(50,38,26,0.35)] transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 lg:p-10 ${step.tilt}`}
              >
                <div className="mb-8 flex items-baseline gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-clay">
                    {step.eyebrow}
                  </span>
                  <span className="block h-px flex-1 border-t border-dashed border-line" />
                </div>

                <h3 className="mb-4 font-display text-2xl leading-snug text-ink lg:text-3xl">
                  {step.title}
                </h3>
                <p className="mb-10 leading-relaxed text-ink-soft">
                  {step.description}
                </p>

                <div className="flex items-center gap-2.5 border-t border-dashed border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  <step.icon className="h-3.5 w-3.5 text-clay" strokeWidth={2} />
                  {step.meta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section id="about" className="relative bg-card">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Left — narrative */}
            <div className="lg:col-span-7">
              <Eyebrow>About</Eyebrow>
              <h2 className="mb-10 font-display text-4xl leading-[1.06] tracking-[-0.01em] lg:text-5xl">
                A small tool for an
                <br />
                <em className="text-clay">already-hard</em> chapter.
              </h2>
              <div className="max-w-xl space-y-6 text-lg leading-relaxed text-ink-soft">
                <p>
                  Job Trackr is a passion project from a solo developer in South
                  Africa. It started with a familiar frustration — keeping
                  spreadsheets of job applications during a long search felt
                  like a second job in itself.
                </p>
                <p>
                  So it became this: a quiet companion that reads what your
                  inbox is already telling you, and turns it into something you
                  can actually look at without dread.
                </p>
                <p className="text-ink">
                  No paid tiers. No data sold. No upsells. Just a tool that
                  exists to make a stressful stretch slightly less stressful.
                </p>
              </div>
            </div>

            {/* Right — principles card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-line bg-paper p-8 lg:p-10">
                {/* "taped" corner */}
                <span
                  aria-hidden
                  className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 rounded-sm bg-clay-wash/90 shadow-sm"
                />

                <div className="mb-10 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft">
                    Principles
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                    Cape Town · ZA
                  </span>
                </div>

                <ul className="space-y-5">
                  {credo.map((row, i) => (
                    <li
                      key={row.k}
                      className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-dashed border-line pb-5 last:border-b-0 last:pb-0"
                    >
                      <span className="flex items-baseline gap-3 whitespace-nowrap">
                        <span className="font-display text-base text-clay">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-ink">
                          {row.k}
                        </span>
                      </span>
                      <span className="text-right text-sm text-ink-soft">
                        {row.v}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-center gap-3 border-t border-line pt-6 text-xs text-ink-soft">
                  <ShieldCheck className="h-4 w-4 text-clay" strokeWidth={2} />
                  <span>
                    Disconnect Gmail any time from{" "}
                    <Link
                      href="/settings"
                      className="underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-clay"
                    >
                      Settings
                    </Link>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA band — espresso ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink">
        {/* sunrise arcs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
        >
          <svg width="900" height="320" viewBox="0 0 900 320" fill="none">
            {[420, 340, 260, 180].map((r, i) => (
              <circle
                key={r}
                cx="450"
                cy="430"
                r={r}
                stroke="var(--clay)"
                strokeOpacity={0.18 + i * 0.06}
                strokeWidth="1.5"
              />
            ))}
            <circle cx="450" cy="430" r="110" fill="var(--clay)" fillOpacity="0.25" />
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-10 lg:py-32">
          <SunMark className="mb-8 h-9 w-9 text-clay" />
          <h2 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-[-0.01em] text-paper lg:text-6xl">
            When you&apos;re ready, your <em className="text-clay-wash">inbox</em>{" "}
            is too.
          </h2>
          <Link
            href="/auth"
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-clay py-3 pr-3 pl-7 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-clay-deep"
          >
            Start tracking your applications
            <span className="grid h-8 w-8 place-items-center rounded-full bg-paper/20 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
          <div className="mt-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-clay" strokeWidth={2} />
            Free forever · No credit card
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
