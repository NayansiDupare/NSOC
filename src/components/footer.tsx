"use client";

import { MoveUpRight } from "lucide-react";
import Image from "next/image";
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
    label: "Discord",
    url: "https://discord.gg/bZ47fac2jn",
    icon: FaDiscord,
  },
  {
    label: "Instagram",
    url: "https://instagram.com/nsoc.in",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/company/nso-code",
    icon: FaLinkedinIn,
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@nsoc-in",
    icon: FaYoutube,
  },
  {
    label: "WhatsApp",
    url: "https://chat.whatsapp.com/Cs6bcCYUD5zLXmElzX9HOq",
    icon: FaWhatsapp,
  },
  {
    label: "GitHub",
    url: "https://github.com/deepanshu-prajapati01",
    icon: FaGithub,
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        {/* Brand */}
        <a className="wordmark" href="#top" aria-label="NSoC Winter home">
          <span className="wordmark__mark">
            <Image
              className="logo-image logo-image--dark"
              src="/nsoc-logo-dark.webp"
              alt="Official NSoC Winter logo"
              width={44}
              height={44}
            />

            <Image
              className="logo-image logo-image--light"
              src="/nsoc-logo-light.webp"
              alt=""
              width={44}
              height={44}
            />
          </span>

          <span className="wordmark__copy">
            <strong>NSoC</strong>
            <small>WINTER EDITION</small>
          </span>
        </a>

        {/* Description */}
        <p>
          A 45-day open source program where project admins bring real codebases
          and contributors work on meaningful issues that ship to production.
        </p>

        {/* Social links */}
        <div className="footer-socials">
          {socialLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <Icon size={14} />
                {link.label}
                <MoveUpRight size={12} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <span>© 2026 NSoC. All rights reserved.</span>

        <span>BUILT FOR THE OPEN-SOURCE WINTER</span>

        <a href="mailto:connect.nsoc@gmail.com">connect.nsoc@gmail.com</a>
      </div>
    </footer>
  );
}
