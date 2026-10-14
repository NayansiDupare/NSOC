"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
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

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 75%"],
  });

  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["22%", "0%"]);

  const fillClip = useTransform(
    scrollYProgress,
    [0.15, 0.9],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const outlineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["16%", "0%"]);

  const fillClip = useTransform(
    scrollYProgress,
    [0.25, 0.95],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer ref={ref} id="site-footer" className="nsoc-footer">
      {/* dotted atmosphere */}
      <div aria-hidden="true" className="nsoc-footer__dots" />

      {/* giant NSOC */}
      <div aria-hidden="true" className="nsoc-footer__giant">
        <motion.div
          className="relative"
          style={reduceMotion ? undefined : { y: wordmarkY }}
        >
          {/* outline */}
          <motion.span
            style={reduceMotion ? undefined : { opacity: outlineOpacity }}
            className="nsoc-footer__giant-text nsoc-footer__giant-text--outline"
          >
            NSOC
          </motion.span>

          {/* bottom → top fill */}
          <motion.span
            style={reduceMotion ? undefined : { clipPath: fillClip }}
            className="nsoc-footer__giant-text nsoc-footer__giant-text--solid"
          >
            NSOC
          </motion.span>
        </motion.div>
      </div>

      {/* curved horizon */}
      <div aria-hidden="true" className="nsoc-footer__horizon" />

      {/* footer content */}
      <div className="relative z-10 mx-auto flex min-h-full max-w-7xl flex-col px-6">
        <div className="grid gap-12 pt-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
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
                <p className="text-sm font-bold uppercase tracking-[0.18em]">
                  NSoC
                </p>

                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-500">
                  Winter Edition
                </p>
              </div>
            </a>

            <h2 className="mt-7 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
              Real projects.
              <span className="block">Real contributors.</span>
              <span className="block text-cyan-500">Real impact.</span>
            </h2>

            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              A 45-day open source program where project admins bring real
              codebases and contributors work on meaningful issues that ship to
              production.
            </p>
          </div>

          {/* Sections */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">
              Sections
            </p>

            <div className="mt-5 flex flex-col">
              {[
                ["01", "About", "#about"],
                ["02", "Roles", "#roles"],
                ["03", "Timeline", "#timeline"],
                ["04", "Sponsors", "#sponsors"],
              ].map(([number, label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="group flex min-h-11 items-center gap-3 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <span className="w-5 text-[10px] text-muted-foreground/60">
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

          {/* Follow */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">
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
                    className="group flex min-h-11 items-center gap-3 text-sm text-muted-foreground transition hover:text-foreground"
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

        {/* reserves space for giant word */}
        <div className="min-h-[330px] flex-1 sm:min-h-[400px]" />

        {/* bottom bar */}
        <div className="relative z-20 grid min-h-24 items-end gap-4 pb-6 text-xs text-muted-foreground sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <p>© 2026 NSoC. All rights reserved.</p>

          <p className="hidden uppercase tracking-[0.18em] sm:block">
            Open source winter
          </p>

          <button
            type="button"
            onClick={backToTop}
            className="group flex items-center gap-3 justify-self-start sm:justify-self-end"
          >
            <span className="relative">
              Back to top
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition group-hover:border-cyan-400 group-hover:text-cyan-500">
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
