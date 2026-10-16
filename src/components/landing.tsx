"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  GitMerge,
  Mail,
  Menu,
  Moon,
  MoveUpRight,
  Snowflake,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import ElsewhereHero from "@/components/ui/elsewhere-hero";
import {
  partners,
  program,
  rewards,
  roles,
  sponsors,
  stats,
  timeline,
  values,
  workflow,
} from "@/lib/data";
import { useExperienceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
type Stat = { value: string; label: string; suffix: string };

const sponsorSchema = z.object({
  company: z.string().min(2, "Tell us who you represent."),
  email: z.email("Enter a valid email."),
  message: z
    .string()
    .min(20, "Add at least 20 characters so the team has context."),
});

type SponsorForm = z.infer<typeof sponsorSchema>;

function Wordmark({ href }: { href: string }) {
  return (
    <a className="wordmark" href={href} aria-label="NSoC Winter home">
      <span className="wordmark__mark">
        <Image
          className="logo-image logo-image--dark"
          src="/nsoc-logo-dark.webp"
          alt="Official NSoC Winter logo"
          width={44}
          height={44}
          priority
        />
        <Image
          className="logo-image logo-image--light"
          src="/nsoc-logo-light.webp"
          alt=""
          width={44}
          height={44}
          priority
        />
      </span>
      <span className="wordmark__copy">
        <strong>NSoC</strong>
        <small>WINTER EDITION</small>
      </span>
    </a>
  );
}

// Day / night switch — also swaps the hero between the winter day and night footage.
// Which icon shows comes from the <html> theme class in CSS, so it never mismatches on hydration.
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between winter day and night"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <Sun className="theme-icon theme-icon--sun" size={18} />
      <Moon className="theme-icon theme-icon--moon" size={18} />
    </button>
  );
}

// `solid` keeps the bar in its scrolled look — for pages without the video hero behind it.
export function Header({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(solid);

  // Transparent and full width while the hero is under it; once the content has scrolled
  // up over the hero, it settles into a solid centred bar that stays fixed for the rest of the site.
  useEffect(() => {
    if (solid) return;
    const update = () => {
      const cover = document.querySelector(".hero-cover");
      const headerBottom = 96;
      setScrolled(cover ? cover.getBoundingClientRect().top <= headerBottom : window.scrollY > 40);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [solid]);

  return (
    <header className={cn("site-header", scrolled && "site-header--scrolled")}>
      <div className="nav-shell">
        <Wordmark href={solid ? "/" : "#top"} />
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/login" className="login-link">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="mobile-menu" aria-label="Open navigation">
                <Menu size={20} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content
                className="mobile-nav-panel"
                aria-describedby={undefined}
              >
                <div className="mobile-nav-top">
                  <Dialog.Title>Navigate NSoC</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="icon-button"
                      aria-label="Close navigation"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile navigation">
                  <Dialog.Close asChild>
                    <Link href="/login">
                      <span>01</span>
                      Log in
                      <ArrowRight size={18} />
                    </Link>
                  </Dialog.Close>
                </nav>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function SignalStrip() {
  const [programStats, setProgramStats] = useState<Stat[]>([...stats]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<{ stats: Stat[] }>("/api/program", { signal: controller.signal })
      .then(({ data }) => setProgramStats(data.stats))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  // As the strip scrolls into view below the hero, each cell drops in from above, one after another.
  // Same initial state on server and client (no hydration mismatch); reduced motion just skips the animation.
  const dropIn = (index: number) => ({
    initial: { opacity: 0, y: -56 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.7, delay: index * 0.14, ease: [0.2, 0.7, 0.2, 1] as const },
  });

  return (
    <section className="signal-strip" id="signal" aria-label="Program snapshot">
      <motion.div className="signal-intro" {...dropIn(0)}>
        <span className="status-dot" />
        <p>ONE SEASON · A LOT OF FIRSTS</p>
      </motion.div>
      {programStats.map((stat, index) => (
        <motion.div className="signal-stat" key={stat.label} {...dropIn(index + 1)}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          <small>{stat.suffix}</small>
        </motion.div>
      ))}
    </section>
  );
}

function SectionHeading({
  id,
  index,
  kicker,
  title,
  copy,
}: {
  id: "about" | "paths" | "rewards" | "timeline" | "partners";
  index: string;
  kicker: string;
  title: React.ReactNode;
  copy?: string;
}) {
  return (
    <div className="section-heading" id={id}>
      <div className="section-heading__meta">
        <span>{index}</span>
        <p>{kicker}</p>
      </div>
      <div>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section about">
      <SectionHeading
        id="about"
        index="01"
        kicker="WHY NSOC"
        title={
          <>
            Open source starts
            <span>a little awkwardly.</span>
          </>
        }
        copy="The first issue can be confusing. The first review can sting. Then your first merge lands—and the unfamiliar codebase starts to feel like a place you belong."
      />
      <div className="manifesto-grid">
        <div className="manifesto-quote reveal-line">
          <span className="quote-mark">“</span>
          <p>
            Your first PR doesn’t need to be brilliant. It needs to be{" "}
            <em>open.</em>
          </p>
          <div className="commit-chip">
            <GitMerge size={15} /> merge: proof-of-work
          </div>
        </div>
        <div className="value-grid">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <article className="value-card reveal-line" key={item.title}>
                <div className="value-card__top">
                  <span>{item.tag}</span>
                  <Icon size={23} strokeWidth={1.5} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pathways() {
  const activeRole = useExperienceStore((state) => state.activeRole);
  const setActiveRole = useExperienceStore((state) => state.setActiveRole);
  const role = useMemo(
    () => roles.find((item) => item.id === activeRole) ?? roles[0],
    [activeRole],
  );
  const Icon = role.icon;

  return (
    <section className="section pathways">
      <SectionHeading
        id="paths"
        index="02"
        kicker="CHOOSE YOUR PATH"
        title={
          <>
            Find your place
            <span>at the table.</span>
          </>
        }
        copy="Contribute code, open your project, or build the community around it. Pick the role that matches how you want to create impact."
      />
      <div className="role-console reveal-line">
        <div
          className="role-tabs"
          role="tablist"
          aria-label="Participation paths"
        >
          {roles.map((item) => {
            const TabIcon = item.icon;
            const active = item.id === activeRole;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={active}
                className={cn("role-tab", active && "is-active")}
                key={item.id}
                onClick={() => setActiveRole(item.id)}
              >
                <span>{item.index}</span>
                <TabIcon size={20} />
                <strong>{item.title}</strong>
              </button>
            );
          })}
        </div>
        <div className="role-display" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="role-display__copy"
            >
              <div className="role-orb">
                <Icon size={38} strokeWidth={1.25} />
              </div>
              <span>{role.index} / ACTIVE PATH</span>
              <h3>{role.title}</h3>
              <p>{role.summary}</p>
              <Button asChild variant="secondary">
                <a href="https://nsoc.in/register">
                  {role.cta} <MoveUpRight size={16} />
                </a>
              </Button>
            </motion.div>
          </AnimatePresence>
          <div className="role-checklist">
            <span>MISSION PARAMETERS</span>
            {role.points.map((point) => (
              <div key={point}>
                <span className="check-box">
                  <Check size={13} />
                </span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section className="section workflow-section">
      <div className="workflow-title">
        <span>FROM ZERO TO MERGED</span>
        <h2>From a quiet night to a public contribution.</h2>
      </div>
      <div className="workflow-grid">
        <div className="workflow-line" aria-hidden="true" />
        {workflow.map((item) => {
          const Icon = item.icon;
          return (
            <article className="workflow-step reveal-line" key={item.step}>
              <div className="workflow-node">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span>PHASE {item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Rewards() {
  const reduceMotion = useReducedMotion();

  const celebrate = (featured: boolean) => {
    if (!featured || reduceMotion) return;
    confetti({
      particleCount: 85,
      spread: 72,
      origin: { y: 0.68 },
      colors: ["#7cc4f2", "#a9dbfa", "#dcefff", "#f4f8fc"],
    });
  };

  return (
    <section className="section rewards-section">
      <SectionHeading
        id="rewards"
        index="03"
        kicker="REWARDS VAULT"
        title={
          <>
            Good work deserves
            <span>a proper thank-you.</span>
          </>
        }
        copy="The leaderboard rewards consistent, reviewed contributions—not noise. Open a reward tier to inspect the loadout."
      />
      <div className="reward-grid">
        {rewards.map((reward) => {
          const Icon = reward.icon;
          return (
            <Accordion.Root
              key={reward.rank}
              type="single"
              collapsible
              className={cn(
                "reward-card reveal-line",
                reward.featured && "reward-card--featured",
              )}
            >
              <Accordion.Item value="details">
                <Accordion.Header>
                  <Accordion.Trigger onClick={() => celebrate(reward.featured)}>
                    <div className="reward-card__rank">
                      <span>{reward.rank}</span>
                      <Icon size={24} strokeWidth={1.4} />
                    </div>
                    <div>
                      <h3>{reward.title}</h3>
                      <p>{reward.items.length} REWARDS</p>
                    </div>
                    <ChevronDown className="reward-chevron" size={19} />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="reward-content">
                  <ul>
                    {reward.items.map((item) => (
                      <li key={item}>
                        <Check size={13} /> {item}
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          );
        })}
      </div>
      <p className="reward-note">
        Tap <strong>Rank 01</strong> for a small victory signal.
      </p>
    </section>
  );
}

function Timeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section timeline-section" id="timeline">
      <div className="timeline-heading">
        <div className="eyebrow">
          <Snowflake size={14} />
          Program timeline
        </div>
        <h2>
          Here&apos;s how we <span>planned.</span>
        </h2>
        <p>
          Follow the journey from registration to results. Each milestone moves the community
          closer to building, shipping, and celebrating meaningful open-source work together.
        </p>
      </div>

      <div className="timeline-journey">
        <svg
          className="timeline-path"
          viewBox="0 0 1200 1610"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--mint)" />
              <stop offset="45%" stopColor="var(--cyan)" />
              <stop offset="76%" stopColor="var(--violet)" />
              <stop offset="100%" stopColor="#f2ba54" />
            </linearGradient>
          </defs>
          <path
            className="timeline-path__ghost"
            d="M600 70C760 152 760 238 600 320S440 488 600 570s160 168 0 250-160 168 0 250 160 168 0 250-160 168 0 250"
          />
          <motion.path
            className="timeline-path__active"
            d="M600 70C760 152 760 238 600 320S440 488 600 570s160 168 0 250-160 168 0 250 160 168 0 250-160 168 0 250"
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 2.4, ease: [0.22, 0.8, 0.2, 1] }}
          />
        </svg>

        <ol>
          {timeline.map((item, index) => {
            const Icon = item.icon;
            const step = String(index + 1).padStart(2, "0");

            return (
              <li key={item.title}>
                <span className="timeline-node" aria-hidden="true"><span /></span>
                <article className="timeline-card">
                  <span className="timeline-card__number" aria-hidden="true">{step}</span>
                  <div className="timeline-card__meta">
                    <span className="timeline-card__icon"><Icon size={26} strokeWidth={1.7} /></span>
                    <time dateTime={item.dateTime}>
                      <CalendarDays size={14} />
                      {item.date}
                    </time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="timeline-progress" aria-label={`Step ${index + 1} of ${timeline.length}`}>
                    <span>Step {step} / {String(timeline.length).padStart(2, "0")}</span>
                    <span className="timeline-progress__track" aria-hidden="true">
                      <span style={{ width: `${((index + 1) / timeline.length) * 100}%` }} />
                    </span>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function PartnerNetwork() {
  const reduceMotion = useReducedMotion();

  const sponsorList = useMemo(() => {
    return [...sponsors, ...sponsors];
  }, []);

  return (
    <section className="section partner-section">
      <SectionHeading
        id="partners"
        index="05"
        kicker="BACKED BY THE ECOSYSTEM"
        title={
          <>
            The people helping
            <span>keep the lights on.</span>
          </>
        }
        copy="Sponsors and community partners help NSoC give more builders a place to learn, contribute, and be seen."
      />

      {reduceMotion ? (
        <div className="sponsor-grid">
          {sponsors.map((sponsor, index) => (
            <a
              href={sponsor.url}
              target="_blank"
              rel="noreferrer"
              key={sponsor.name}
              className="sponsor-card"
            >
              <div className="sponsor-card__header">
                <span>SPONSOR / 0{index + 1}</span>
                <MoveUpRight size={17} />
              </div>
              <strong className="sponsor-card__name">{sponsor.name}</strong>
              <p className="sponsor-card__desc">{sponsor.description}</p>
            </a>
          ))}
        </div>
      ) : (
        <motion.div
          className="sponsor-stage-horizontal"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Horizontally scrolling sponsors directory"
        >
          <div className="sponsor-marquee-track">
            <div className="sponsor-marquee-group">
              {sponsorList.map((sponsor, index) => {
                const originalIndex = sponsors.findIndex((s) => s.name === sponsor.name);
                return (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    key={`${sponsor.name}-${index}`}
                    className="sponsor-card"
                  >
                    <div className="sponsor-card__header">
                      <span>SPONSOR / 0{originalIndex + 1}</span>
                      <MoveUpRight size={17} />
                    </div>
                    <strong className="sponsor-card__name">{sponsor.name}</strong>
                    <p className="sponsor-card__desc">{sponsor.description}</p>
                  </a>
                );
              })}
            </div>
            <div className="sponsor-marquee-group" aria-hidden="true">
              {sponsorList.map((sponsor, index) => {
                const originalIndex = sponsors.findIndex((s) => s.name === sponsor.name);
                return (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    key={`clone-${sponsor.name}-${index}`}
                    tabIndex={-1}
                    className="sponsor-card"
                  >
                    <div className="sponsor-card__header">
                      <span>SPONSOR / 0{originalIndex + 1}</span>
                      <MoveUpRight size={17} />
                    </div>
                    <strong className="sponsor-card__name">{sponsor.name}</strong>
                    <p className="sponsor-card__desc">{sponsor.description}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      <div className="partner-cloud" aria-label="Community partners">
        {partners.map((partner, index) => (
          <div key={partner} className="partner-node">
            <span>{String(index + 1).padStart(2, "0")}</span>
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}

function SponsorDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorForm>({ resolver: zodResolver(sponsorSchema) });

  const onSubmit = (values: SponsorForm) => {
    const subject = encodeURIComponent(
      `NSoC Winter sponsorship — ${values.company}`,
    );
    const body = encodeURIComponent(
      `Company / community: ${values.company}\nContact: ${values.email}\n\n${values.message}`,
    );
    window.open(
      `mailto:connect.nsoc@gmail.com?subject=${subject}&body=${body}`,
      "_self",
    );
    reset();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary">
          Sponsor this season <Mail size={16} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="sponsor-dialog"
          aria-describedby="sponsor-description"
        >
          <div className="dialog-head">
            <div>
              <span>OPEN A CHANNEL</span>
              <Dialog.Title>Support the winter edition.</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="icon-button"
                aria-label="Close sponsorship form"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description id="sponsor-description">
            Share a little context. Submitting opens a pre-filled email to the
            NSoC team.
          </Dialog.Description>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <label>
              Company or community
              <input placeholder="Your organisation" {...register("company")} />
              {errors.company ? <small>{errors.company.message}</small> : null}
            </label>
            <label>
              Work email
              <input
                type="email"
                placeholder="you@company.com"
                {...register("email")}
              />
              {errors.email ? <small>{errors.email.message}</small> : null}
            </label>
            <label>
              How would you like to collaborate?
              <textarea
                placeholder="Tell the team what you have in mind…"
                {...register("message")}
              />
              {errors.message ? <small>{errors.message.message}</small> : null}
            </label>
            <Button type="submit">
              Compose email <ArrowRight size={16} />
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="final-cta__orb" aria-hidden="true">
        <Image src="/nsoc-logo-dark.webp" alt="" width={74} height={74} />
      </div>
      <span>THE NEXT MERGE COULD BE YOURS</span>
      <h2>
        Close the tutorial.
        <strong>Open an issue.</strong>
      </h2>
      <p>Choose your path, meet the community, and ship work worth showing.</p>
      <div>
        <Button asChild>
          <a href="https://nsoc.in/register">
            Join NSoC Winter <ArrowRight size={17} />
          </a>
        </Button>
        <SponsorDialog />
      </div>
    </section>
  );
}

export function Landing() {
  const shellRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let disposed = false;
    let revert: (() => void) | undefined;

    const initialize = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });
      }, shellRef);
      revert = () => context.revert();
    };

    initialize();
    return () => {
      disposed = true;
      revert?.();
    };
  }, [reduceMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !shellRef.current) return;
    shellRef.current.style.setProperty("--cursor-x", `${event.clientX}px`);
    shellRef.current.style.setProperty("--cursor-y", `${event.clientY}px`);
  };

  return (
    <div
      className="site-shell"
      ref={shellRef}
      onPointerMove={handlePointerMove}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="cursor-light" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="main-content" className="page-shell">
        {/* Hero nav hidden for now — the navbar's placement is still to be decided. */}
        {/* Anchor for "#top" — the hero itself is sticky, so it can't serve as a scroll target. */}
        <div id="top" />
        <ElsewhereHero
          brand="NSoC"
          style={{ position: "sticky", top: 0, zIndex: 0 }}
          showNav={false}
          navCta={{ label: "Join NSoC", href: "https://nsoc.in/register" }}
          headline={`${program.name}.`}
          subline="A 45-day open source program where project maintainers bring real-world projects, and contributors work on solving actual issues, building features, and shipping production-ready code. No toy projects. No filler tasks. Just meaningful work and a community that grows together."
          align="left"
          actions={
            <>
              <Button asChild>
                <Link href="/register">
                  Join now <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="#about">Learn more</a>
              </Button>
            </>
          }
        />
        {/* The hero stays pinned; everything after it scrolls up over it. */}
        <div className="hero-cover">
          <SignalStrip />
          <About />
          <Pathways />
          <Workflow />
          <Rewards />
          <Timeline />
          <PartnerNetwork />
          <FinalCta />
        </div>
      </main>
      <Footer />
    </div>
  );
}
