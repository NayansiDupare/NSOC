"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  ArrowDown,
  ArrowRight,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  partners,
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

const navLinks = [
  ["About", "#about"],
  ["Paths", "#paths"],
  ["Rewards", "#rewards"],
  ["Timeline", "#timeline"],
  ["Partners", "#partners"],
] as const;

const heroSnow = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 37 + 5) % 100}%`,
  delay: -((index * 0.73) % 8),
  duration: 7 + (index % 6) * 0.9,
  drift: index % 2 ? 22 : -18,
  size: 2 + (index % 4),
}));

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="NSoC Winter home">
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

function ThemePull() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="theme-pull"
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="theme-pull__line" />
      <span className="theme-pull__knob">
        <Sun className="theme-icon theme-icon--sun" size={14} />
        <Moon className="theme-icon theme-icon--moon" size={14} />
      </span>
    </button>
  );
}

function Snowfall() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="hero-snow" aria-hidden="true">
      {heroSnow.map((flake, index) => (
        <motion.span
          key={`${flake.left}-${index}`}
          style={{ left: flake.left, width: flake.size, height: flake.size }}
          initial={{ y: -30, x: 0, opacity: 0 }}
          animate={{
            y: [0, 980],
            x: [0, flake.drift, flake.drift * 0.45],
            rotate: [0, 180, 360],
            opacity: [0, 0.75, 0.5, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const navigateToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: (typeof navLinks)[number][1],
  ) => {
    event.preventDefault();
    setOpen(false);

    window.setTimeout(
      () => {
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        window.history.pushState(null, "", href);
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      open ? 120 : 0,
    );
  };

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(event) => navigateToSection(event, href)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="login-link" href="https://nsoc.in/login">
            Log in
          </a>
          <Button asChild size="sm">
            <a href="https://nsoc.in/register">
              Join NSoC <ArrowRight size={15} />
            </a>
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
                  {navLinks.map(([label, href], index) => (
                    <Dialog.Close asChild key={href}>
                      <a
                        href={href}
                        onClick={(event) => navigateToSection(event, href)}
                      >
                        <span>0{index + 1}</span>
                        {label}
                        <ArrowRight size={18} />
                      </a>
                    </Dialog.Close>
                  ))}
                </nav>
                <Button asChild>
                  <a href="https://nsoc.in/register">Join the winter edition</a>
                </Button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function BorealisCore() {
  const reduceMotion = useReducedMotion();
  const [isWaving, setIsWaving] = useState(false);

  return (
    <motion.div
      className="borealis-stage"
      aria-label="Animated winter developer penguin"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.015, rotate: 0.4 }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="stage-grid" aria-hidden="true" />
      <motion.div
        className="aurora aurora--one"
        animate={
          reduceMotion
            ? undefined
            : { rotate: [0, 8, -4, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="aurora aurora--two"
        animate={
          reduceMotion
            ? undefined
            : { rotate: [0, -12, 5, 0], scale: [1, 0.93, 1.1, 1] }
        }
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="orbit orbit--outer" aria-hidden="true">
        <span className="satellite satellite--one" />
      </div>
      <div className="orbit orbit--middle" aria-hidden="true">
        <span className="satellite satellite--two" />
      </div>
      <div className="orbit orbit--inner" aria-hidden="true" />
      <motion.div
        className="mascot-core"
        animate={
          reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, -1.5, 1, 0] }
        }
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="mascot-interaction"
          onHoverStart={() => setIsWaving(true)}
          onHoverEnd={() => setIsWaving(false)}
          onTap={() => setIsWaving((current) => !current)}
          whileHover={reduceMotion ? undefined : { scale: 1.045, y: -4 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 220, damping: 19 }}
        >
          <motion.div
            className="mascot-pose"
            animate={
              isWaving
                ? { opacity: 0, scale: 0.95, y: 5, rotate: -1.5 }
                : { opacity: 1, scale: 1, y: 0, rotate: 0 }
            }
            transition={{ duration: 0.34, ease: [0.22, 0.8, 0.2, 1] }}
          >
            <Image
              className="mascot-image"
              src="/winter-penguin.webp"
              alt="Winter penguin coding on a laptop"
              width={900}
              height={900}
              priority
              sizes="(max-width: 820px) 55vw, 25vw"
            />
          </motion.div>
          <motion.div
            className="mascot-pose mascot-pose--wave"
            initial={false}
            animate={
              isWaving
                ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
                : { opacity: 0, scale: 0.95, y: 5, rotate: 1.5 }
            }
            transition={{ duration: 0.34, ease: [0.22, 0.8, 0.2, 1] }}
            aria-hidden="true"
          >
            <Image
              className="mascot-image"
              src="/winter-penguin-wave.webp"
              alt=""
              width={900}
              height={900}
              priority
              sizes="(max-width: 820px) 55vw, 25vw"
            />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        className="mascot-note mascot-note--issue"
        animate={reduceMotion ? undefined : { x: [0, 7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="status-dot" /> ISSUE PICKED
      </motion.div>
      <motion.div
        className="mascot-note mascot-note--merge"
        animate={reduceMotion ? undefined : { x: [0, -7, 0], y: [0, -4, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <GitMerge size={14} /> READY TO MERGE
      </motion.div>
      <div className="stage-label stage-label--top">
        <span>HOVER TO SAY HI</span>
        <span>OPEN SOURCE / ACTIVE</span>
      </div>
      <div className="stage-label stage-label--bottom">
        <Snowflake size={12} /> BUILT FOR THE COLD
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Snowfall />
      <div className="hero-copy">
        <div className="eyebrow">
          <Snowflake size={14} />
          Applications open · Winter edition
        </div>
        <h1>
          Stop watching.
          <span>Start contributing.</span>
        </h1>
        <p>
          This winter, trade one tutorial tab for a real codebase. Pick an
          issue, meet the people behind it, and learn what it feels like to get
          your work merged.
        </p>
        <div className="hero-actions">
          <Button asChild>
            <a href="https://nsoc.in/register">
              Enter the program <ArrowRight size={17} />
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href="#paths">
              Choose your path <ArrowDown size={17} />
            </a>
          </Button>
        </div>
        <div className="hero-meta" aria-label="Program dates">
          <span>OCT 15</span>
          <span className="meta-line" />
          <span>DEC 30</span>
          <small>CONTRIBUTION WINDOW</small>
        </div>
      </div>
      <BorealisCore />
      <a
        className="scroll-cue"
        href="#signal"
        aria-label="Scroll to program snapshot"
      >
        <span>SEE HOW THE SEASON WORKS</span>
        <ArrowDown size={14} />
      </a>
    </section>
  );
}

function SignalStrip() {
  const [programStats, setProgramStats] = useState<Stat[]>([...stats]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<{ stats: Stat[] }>("/api/program", { signal: controller.signal })
      .then(({ data }) => setProgramStats(data.stats))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <section className="signal-strip" id="signal" aria-label="Program snapshot">
      <div className="signal-intro">
        <span className="status-dot" />
        <p>ONE SEASON · A LOT OF FIRSTS</p>
      </div>
      {programStats.map((stat) => (
        <div className="signal-stat" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          <small>{stat.suffix}</small>
        </div>
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
      colors: ["#20d5ff", "#8274ff", "#8fffd0", "#ffffff"],
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
  return (
    <section className="section timeline-section">
      <SectionHeading
        id="timeline"
        index="04"
        kicker="WINTER BUILD LOG"
        title={
          <>
            Put these dates
            <span>somewhere warm.</span>
          </>
        }
        copy="Keep the important dates in view and leave enough room for iteration, review, and the final merge."
      />
      <div className="timeline-console reveal-line">
        <div className="timeline-console__head">
          <span>NSoC Winter · season schedule</span>
          <span>● ● ●</span>
        </div>
        <ol>
          {timeline.map((item, index) => (
            <li key={item.title}>
              <div className="timeline-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="timeline-marker">
                <span />
              </div>
              <time>{item.date}</time>
              <h3>{item.title}</h3>
              <span className="timeline-state">{item.state}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PartnerNetwork() {
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
      <div className="sponsor-grid">
        {sponsors.map((sponsor, index) => (
          <a
            href={sponsor.url}
            target="_blank"
            rel="noreferrer"
            key={sponsor.name}
          >
            <span>SPONSOR / 0{index + 1}</span>
            <strong>{sponsor.name}</strong>
            <MoveUpRight size={17} />
          </a>
        ))}
      </div>
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
      <ThemePull />
      <main id="main-content" className="page-shell">
        <Hero />
        <SignalStrip />
        <About />
        <Pathways />
        <Workflow />
        <Rewards />
        <Timeline />
        <PartnerNetwork />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
