"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

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

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.45,
  });

  const wordmarkY = useTransform(smoothProgress, [0, 1], ["18%", "0%"]);

  const outlineOpacity = useTransform(smoothProgress, [0, 0.22], [0.15, 1]);

  const fillClip = useTransform(
    smoothProgress,
    [0.18, 0.92],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const glowOpacity = useTransform(smoothProgress, [0.15, 0.8], [0.1, 0.95]);

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer ref={ref} id="site-footer" className="nsoc-footer">
      <div aria-hidden="true" className="nsoc-footer__dots" />

      <div className="relative z-10 mx-auto flex min-h-full max-w-7xl flex-col px-6">
        <div className="grid gap-12 pt-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-3">
              <Image
                src="/nsoc-logo-light.webp"
                alt="NSoC logo"
                width={42}
                height={42}
                className="h-10 w-10 object-contain dark:hidden"
              />
              <Image
                src="/nsoc-logo-dark.webp"
                alt="NSoC logo"
                width={42}
                height={42}
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

            <h2 className="mt-7 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Real projects.
              <span className="block">Real contributors.</span>
              <span className="block text-cyan-400">Real impact.</span>
            </h2>

            <p className="mt-5 max-w-md leading-7 text-slate-300/75">
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

        {/* This space belongs to the footer only and is where the wordmark reveal lives. */}
        <div className="min-h-[300px] flex-1 sm:min-h-[390px]" />

        <div className="relative z-20 grid min-h-24 items-end gap-4 pb-6 text-xs text-slate-400 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
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

      {/* Wordmark is inside the footer, clipped by the footer, and cannot leak into the page. */}
      <div aria-hidden="true" className="nsoc-footer__giant">
        <motion.div
          className="relative"
          style={reduceMotion ? undefined : { y: wordmarkY }}
        >
          {/* Outline */}
          <motion.span
            style={reduceMotion ? undefined : { opacity: outlineOpacity }}
            className="nsoc-footer__giant-text nsoc-footer__giant-text--outline"
          >
            NSOC
          </motion.span>

          {/* Bottom → top fill */}
          <motion.span
            style={
              reduceMotion
                ? undefined
                : {
                    clipPath: fillClip,
                    opacity: glowOpacity,
                  }
            }
            className="nsoc-footer__giant-text nsoc-footer__giant-text--solid"
          >
            NSOC
          </motion.span>
        </motion.div>
      </div>

      <div aria-hidden="true" className="nsoc-footer__horizon" />
    </footer>
  );
}
