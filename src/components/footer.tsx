"use client";

import { motion, useScroll, useTransform } from "motion/react";
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end end"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -20]);

  return (
    <footer ref={ref} className="relative overflow-hidden px-6 pb-8 pt-24">
      {/* Giant background word */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-x-0 top-8 flex justify-center select-none"
      >
        {/* blurred glow */}
        <span
          aria-hidden="true"
          className="absolute font-display text-[27vw] leading-none text-transparent opacity-30 blur-[10px] sm:text-[22vw] lg:text-[16vw]"
          style={{
            WebkitTextStroke: "3px rgba(34, 211, 238, 0.45)",
          }}
        >
          NSOC
        </span>

        {/* outline */}
        <span
          aria-hidden="true"
          className="outline-glow font-display text-[27vw] leading-none text-transparent opacity-40 sm:text-[22vw] lg:text-[16vw]"
          style={{
            WebkitTextStroke: "1.5px rgba(34, 211, 238, 0.5)",
          }}
        >
          NSOC
        </span>

        {/* scroll-revealed fill */}
        <motion.span
          aria-hidden="true"
          style={{ clipPath }}
          className="shine-text absolute font-display text-[27vw] leading-none opacity-25 sm:text-[22vw] lg:text-[16vw]"
        >
          NSOC
        </motion.span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-sky-500/10 bg-background/55 p-7 shadow-[0_30px_100px_rgba(14,165,233,0.08)] backdrop-blur-2xl sm:p-10">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="#top" className="inline-flex items-center gap-3">
                <Image
                  src="/nsoc-logo-dark.webp"
                  alt="NSoC logo"
                  width={44}
                  height={44}
                  className="hidden h-11 w-11 object-contain dark:block"
                />

                <Image
                  src="/nsoc-logo-light.webp"
                  alt="NSoC logo"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain dark:hidden"
                />

                <div>
                  <p className="text-xl font-bold tracking-tight">
                    NSoC&apos;26
                  </p>

                  <p className="text-[10px] font-semibold tracking-[0.24em] text-cyan-500">
                    WINTER EDITION
                  </p>
                </div>
              </a>

              <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                A 45-day open source program where project admins bring real
                codebases and contributors close issues that ship to production.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className="group flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/40 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-cyan-500">
                NAVIGATION
              </p>

              <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground">
                <a
                  href="#top"
                  className="w-fit transition hover:translate-x-1 hover:text-foreground"
                >
                  Home
                </a>

                <a
                  href="/leaderboard"
                  className="w-fit transition hover:translate-x-1 hover:text-foreground"
                >
                  Leaderboard
                </a>

                <a
                  href="/projects"
                  className="w-fit transition hover:translate-x-1 hover:text-foreground"
                >
                  Projects
                </a>
              </div>
            </div>

            {/* Organization */}
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-cyan-500">
                ORGANIZATION
              </p>

              <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground">
                <a
                  href="#sponsors"
                  className="w-fit transition hover:translate-x-1 hover:text-foreground"
                >
                  Sponsors
                </a>

                <a
                  href="/team"
                  className="w-fit transition hover:translate-x-1 hover:text-foreground"
                >
                  Team
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© 2026 NSoC. All rights reserved.</p>

            <p>
              Built with <span className="text-cyan-500">♥</span> by Humayra
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
