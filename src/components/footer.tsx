"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";

import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/bZ47fac2jn",
    icon: FaDiscord,
  },
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/Cs6bcCYUD5zLXmElzX9HOq",
    icon: FaWhatsapp,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/nsoc.in",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/nso-code",
    icon: FaLinkedinIn,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@nsoc-in",
    icon: FaYoutube,
  },
  {
    name: "GitHub",
    href: "https://github.com/deepanshu-prajapati01",
    icon: FaGithub,
  },
];

const footerSections = [
  ["01", "About", "#about"],
  ["02", "Roles", "#roles"],
  ["03", "Timeline", "#timeline"],
  ["04", "Sponsors", "#sponsors"],
] as const;

const HIDDEN_PCT = 22;
const RISE_PCT = 14;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const ramp = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / Math.max(0.0001, to - from));

type FooterArrival = {
  fill: MotionValue<number>;
  flow: boolean;
};

/**
 * Tracks how much of the sticky footer has actually been uncovered by the page.
 *
 * Important: this intentionally uses the global scrollY instead of
 * useScroll({ target: footerRef }). Sticky positioning changes offsetTop, which
 * makes target-based progress jump ahead and breaks the curtain animation.
 */
function useFooterArrival(
  footerRef: RefObject<HTMLElement | null>,
  giantRef: RefObject<HTMLDivElement | null>,
): FooterArrival {
  const { scrollY } = useScroll();
  const start = useMotionValue(Number.POSITIVE_INFINITY);
  const length = useMotionValue(1);
  const fillFrom = useMotionValue(0.3);
  const fillTo = useMotionValue(0.97);
  const [flow, setFlow] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const measure = () => {
      const footerHeight = Math.max(1, footer.offsetHeight);
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth < 900;
      const tooTall = isMobile && footerHeight > viewportHeight;

      setFlow(tooTall);

      const curtain =
        !tooTall &&
        getComputedStyle(footer).getPropertyValue("--footer-curtain").trim() ===
          "1";

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - viewportHeight,
      );

      if (maxScroll <= 0) {
        start.set(-1);
        length.set(1);
        fillFrom.set(0);
        fillTo.set(0.5);
        return;
      }

      const from = Math.max(0, maxScroll - footerHeight);
      start.set(from);
      length.set(Math.max(1, maxScroll - from));

      const giant = giantRef.current;
      const giantTop = giant ? giant.offsetTop : footerHeight;
      const giantBottom = giant
        ? giant.offsetTop + giant.offsetHeight * (1 - HIDDEN_PCT / 100)
        : footerHeight;

      if (curtain) {
        const uncoverStart = (footerHeight - giantBottom) / footerHeight;
        const uncoverEnd = (footerHeight - giantTop) / footerHeight;

        fillFrom.set(
          Math.min(0.7, uncoverStart + 0.35 * (uncoverEnd - uncoverStart)),
        );
        fillTo.set(0.97);
      } else {
        fillFrom.set(Math.min(0.8, giantTop / footerHeight + 0.06));
        fillTo.set(0.985);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    resizeObserver.observe(footer);

    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [footerRef, giantRef, start, length, fillFrom, fillTo]);

  const progress = useTransform(
    [scrollY, start, length],
    ([scroll, from, distance]: number[]) => clamp01((scroll - from) / distance),
  );

  const fill = useTransform(
    [progress, fillFrom, fillTo],
    ([value, from, to]: number[]) => ramp(value, from, to),
  );

  return { fill, flow };
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { fill, flow } = useFooterArrival(ref, giantRef);

  const fillClip = useTransform(
    fill,
    (value) =>
      `inset(${((1 - value) * (100 - HIDDEN_PCT)).toFixed(2)}% 0% 0% 0%)`,
  );

  const wordmarkY = useTransform(
    fill,
    (value) => `${((1 - value) * RISE_PCT).toFixed(2)}%`,
  );

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer
      ref={ref}
      id="site-footer"
      className={flow ? "nsoc-footer nsoc-footer--flow" : "nsoc-footer"}
    >
      <div aria-hidden="true" className="nsoc-footer__dots" />

      <div className="nsoc-footer__inner mx-auto max-w-7xl px-6">
        <div className="grid gap-12 pt-14 pb-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-3">
              <Image
                src="/nsoc-logo-light.webp"
                alt="NSoC logo"
                width={152}
                height={152}
                className="h-10 w-10 object-contain dark:hidden"
              />
              <Image
                src="/nsoc-logo-dark.webp"
                alt="NSoC logo"
                width={152}
                height={152}
                className="hidden h-10 w-10 object-contain dark:block"
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  NSoC
                </p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-400">
                  Winter Edition
                </p>
              </div>
            </a>

            <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Real projects.
              <span className="block">Real contributors.</span>
              <span className="block text-cyan-400">Real impact.</span>
            </h2>

            <p className="mt-4 max-w-md leading-7 text-slate-300/75">
              A 45-day open source program where project admins bring real
              codebases and contributors work on meaningful issues that ship to
              production.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Sections
            </p>
            <div className="mt-5 flex flex-col">
              {footerSections.map(([number, label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="group flex min-h-11 items-center gap-3 text-sm text-slate-300/75 transition hover:text-white"
                >
                  <span className="w-5 text-[10px] text-slate-400/60">
                    {number}
                  </span>
                  <span className="relative">
                    {label}
                    <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </a>
              ))}
            </div>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Follow
            </p>
            <div className="mt-5 flex flex-col">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-11 items-center gap-3 text-sm text-slate-300/75 transition hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="relative">
                      {social.name}
                      <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sky reserved for the rising wordmark. */}
        <div className="nsoc-footer__gap" aria-hidden="true" />

        {/* Bottom bar sits on the dark planet below the glowing rim. */}
        <div className="nsoc-footer__ground">
          <div className="nsoc-footer__bar">
            <p>© 2026 NSoC. All rights reserved.</p>

            <p className="hidden uppercase tracking-[0.18em] sm:block">
              Open source winter
            </p>

            <button
              type="button"
              onClick={backToTop}
              className="group flex items-center gap-3 justify-self-start transition hover:text-white sm:justify-self-end"
            >
              <span className="relative">
                Back to top
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition group-hover:border-cyan-400 group-hover:text-cyan-400">
                <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div ref={giantRef} aria-hidden="true" className="nsoc-footer__giant">
        <motion.div
          className="nsoc-footer__giant-rise"
          style={reduceMotion ? undefined : { y: wordmarkY }}
        >
          <Image
            src="/outline3.png"
            alt=""
            fill
            sizes="(max-width: 768px) 70vw, 46vw"
            className="nsoc-footer__giant-image nsoc-footer__giant-image--outline"
          />

          <motion.div
            className="nsoc-footer__giant-fill-mask"
            style={reduceMotion ? undefined : { clipPath: fillClip }}
          >
            <Image
              src="/outline2.png"
              alt=""
              fill
              sizes="(max-width: 768px) 70vw, 46vw"
              className="nsoc-footer__giant-image nsoc-footer__giant-image--solid"
            />
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="nsoc-footer__horizon" />
    </footer>
  );
}
