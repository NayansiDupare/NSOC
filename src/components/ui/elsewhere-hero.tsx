"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"

/**
 * Elsewhere — a full hero block, winter edition.
 * Winter day and night loop videos that cross-fade, a navigation bar and a headline.
 * Day / night follows the site's light / dark theme (next-themes), switched from the site header.
 */

export interface ElsewhereLink {
  label: string
  href: string
}

export interface ElsewhereHeroProps {
  /** Light-theme background: a looping video (.mp4/.webm, optionally "#t=start,end" to loop a range) or a photo */
  daySrc?: string
  /** Dark-theme background, same formats as daySrc */
  nightSrc?: string
  /** Brand shown top-left */
  brand?: string
  /** Navigation links (hidden on small screens) */
  links?: ElsewhereLink[]
  /** Call to action in the navigation bar */
  navCta?: ElsewhereLink | false
  /** Set to false to hide the whole navigation bar */
  showNav?: boolean
  headline?: string
  subline?: string
  /** Where the headline and subline sit */
  align?: "center" | "left" | "right"
  /** Buttons shown under the subline */
  actions?: ReactNode
  signature?: { name: string; url: string } | false
  objectPosition?: string
  id?: string
  className?: string
  style?: CSSProperties
}

// Winter scene, served from /public. Day = light theme (seconds 3–7 of day-animate.mp4,
// looped), night = dark theme (seconds 3–7 of night-animate.mp4, looped).
const DEFAULT_DAY = "/day-animate-3-7s.mp4"
const DEFAULT_NIGHT = "/night-animate.mp4#t=3,7"

const DEFAULT_SIGNATURE = {
  name: "guglielmogiannattasio.exe",
  url: "https://www.guglielmogiannattasio.it",
}

const DEFAULT_LINKS: ElsewhereLink[] = [
  { label: "Soundscapes", href: "#soundscapes" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
]

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export default function ElsewhereHero({
  daySrc = DEFAULT_DAY,
  nightSrc = DEFAULT_NIGHT,
  brand = "Elsewhere",
  links = DEFAULT_LINKS,
  navCta = { label: "Get the app", href: "#get" },
  showNav = true,
  headline = "Work from somewhere else.",
  subline = "Ambient soundscapes that follow the day — keys by morning, wind and ice by night.",
  align = "center",
  actions,
  signature = DEFAULT_SIGNATURE,
  objectPosition = "42% 50%",
  id,
  className,
  style,
}: ElsewhereHeroProps) {
  const [shown, setShown] = useState(false)
  // Lets the hidden photo sit under the visible one, so theme changes cross-fade.
  // Off for the first load, so the page doesn't open on the wrong footage.
  const [crossfade, setCrossfade] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    const timer = setTimeout(() => setCrossfade(true), 1300)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  // Each line of the headline area rises in, a beat after the one before.
  const rise = (i: number): CSSProperties => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(14px)",
    transition: `opacity 1s ease ${0.15 + i * 0.12}s, transform 1s cubic-bezier(.2,.7,.2,1) ${0.15 + i * 0.12}s`,
  })

  return (
    <section
      id={id}
      className={className ? `ew-root ${className}` : "ew-root"}
      aria-label={brand}
      data-crossfade={crossfade || undefined}
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: 560,
        width: "100%",
        overflow: "hidden",
        background: "var(--ew-bg)",
        fontFamily: SANS,
        color: "var(--ew-text)",
        ...style,
      }}
    >
      <style>{css}</style>

      {/* DAY (light theme) — looping video, or a photo */}
      <HeroMedia src={daySrc} className="ew-media ew-media--day" objectPosition={objectPosition} />

      {/* NIGHT (dark theme) — looping video, or a photo */}
      <HeroMedia src={nightSrc} className="ew-media ew-media--night" objectPosition={objectPosition} />

      {/* CINEMATIC OVERLAY — a little deeper at the top, so the headline reads on the sky */}
      <div className="ew-overlay" aria-hidden="true" />

      {/* NAVIGATION */}
      {showNav && (
        <header className="ew-nav" style={{ ...rise(0) }}>
          <a href="#" className="ew-brand">
            {brand}
          </a>
          <nav aria-label={brand} className="ew-links">
            {links.map((l) => (
              <a key={l.href + l.label} href={l.href} className="ew-link">
                {l.label}
              </a>
            ))}
          </nav>
          {navCta && (
            <a href={navCta.href} className="ew-glass ew-pill ew-small">
              {navCta.label}
            </a>
          )}
        </header>
      )}

      {/* HEADLINE */}
      <div className={align === "center" ? "ew-copy" : `ew-copy ew-copy--${align}`}>
        <h1 className="ew-title" style={rise(1)}>
          {headline}
        </h1>
        <p className="ew-sub" style={rise(2)}>
          {subline}
        </p>
        {actions && (
          <div className="ew-actions" style={rise(3)}>
            {actions}
          </div>
        )}
      </div>

      {/* SIGNATURE */}
      {signature && (
        <span className="ew-signature">
          by{" "}
          <a href={signature.url} target="_blank" rel="noopener noreferrer">
            {signature.name}
          </a>
        </span>
      )}
    </section>
  )
}

/**
 * A looping video (.mp4/.webm) or a photo. A video src may end in a media fragment,
 * e.g. "/clip.mp4#t=3,7", to loop only that range (in seconds).
 */
function HeroMedia({ src, className, objectPosition }: { src: string; className: string; objectPosition: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [file, fragment] = src.split("#")
  const isVideo = /\.(mp4|webm)$/i.test(file)
  const range = fragment?.match(/^t=([\d.]+)(?:,([\d.]+))?$/)
  const start = range ? Number(range[1]) : 0
  const end = range?.[2] ? Number(range[2]) : Infinity

  useEffect(() => {
    const video = videoRef.current
    if (!video || !range) return

    let frame = 0
    const restart = () => {
      video.currentTime = start
      video.play().catch(() => {})
    }
    // Checked every frame rather than on timeupdate (~4Hz), so the loop doesn't overshoot the end.
    const watch = () => {
      if (video.currentTime >= end || video.ended) restart()
      frame = requestAnimationFrame(watch)
    }

    if (video.readyState >= 1) restart()
    else video.addEventListener("loadedmetadata", restart, { once: true })
    frame = requestAnimationFrame(watch)

    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener("loadedmetadata", restart)
    }
  }, [file, start, end]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVideo) {
    return (
      <Image src={src} alt="" fill priority sizes="100vw" aria-hidden="true" className={className} style={{ objectPosition }} />
    )
  }

  return (
    <video
      ref={videoRef}
      src={file}
      autoPlay
      loop={!range}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={className}
      style={{ objectPosition }}
    />
  )
}

/*
 * Scoped to class names starting with "ew-".
 * Palette: Frozen Night. Night (dark theme) is the default; `html.light` switches to the winter day.
 * Cross-fades use animations rather than transitions, so next-themes' disableTransitionOnChange
 * doesn't cancel them.
 */
const css = `
.ew-root{--ew-bg:#060b16;--ew-text:#f4f8fc;--ew-sub:rgba(220,239,255,.88);--ew-dim:rgba(220,239,255,.72);--ew-faint:rgba(159,176,200,.75);--ew-shadow:rgba(4,12,28,.45);
  --ew-glass-bg:rgba(244,248,252,.10);--ew-glass-bg-hover:rgba(244,248,252,.18);--ew-glass-line:rgba(244,248,252,.22);--ew-glass-line-hover:rgba(244,248,252,.34);
  --ew-overlay:linear-gradient(180deg,rgba(6,11,22,.5),rgba(6,11,22,.2) 38%,rgba(6,11,22,0) 62%,rgba(6,11,22,.42))}
:root.light .ew-root{--ew-bg:#0a1424;--ew-shadow:rgba(10,28,56,.35);
  --ew-overlay:linear-gradient(180deg,rgba(10,28,56,.42),rgba(10,28,56,.16) 38%,rgba(10,28,56,0) 62%,rgba(10,28,56,.3))}
.ew-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0}
.ew-root[data-crossfade] .ew-media{opacity:1}
.ew-media--night,:root.light .ew-media--day{z-index:1;opacity:1;animation:ew-fade-in 1.2s ease both}
:root.light .ew-media--night{z-index:0;animation:none}
:root.light .ew-root:not([data-crossfade]) .ew-media--night{opacity:0}
.ew-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;background:var(--ew-overlay)}
@keyframes ew-fade-in{from{opacity:0}to{opacity:1}}
.ew-nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:clamp(14px,3vh,24px) clamp(14px,3vw,28px)}
.ew-brand{font-weight:500;font-size:clamp(11px,1.6vw,13px);letter-spacing:.35em;text-transform:uppercase;color:var(--ew-dim);text-decoration:none}
.ew-links{display:flex;gap:clamp(18px,2.6vw,32px)}
.ew-link{position:relative;font-size:14px;color:var(--ew-sub);text-decoration:none;transition:color .3s}
.ew-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.ew-link:hover,.ew-link:focus-visible{color:var(--ew-text)}
.ew-link:hover::after,.ew-link:focus-visible::after{transform:scaleX(1)}
.ew-copy{position:absolute;left:0;right:0;top:clamp(84px,12vh,140px);z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 20px}
.ew-title{margin:0;max-width:14ch;font-weight:500;font-size:clamp(40px,7.2vw,104px);line-height:.96;letter-spacing:-.04em;color:var(--ew-text);text-shadow:0 2px 30px var(--ew-shadow);text-wrap:balance}
.ew-sub{margin:clamp(14px,2.2vh,22px) 0 0;max-width:40ch;font-size:clamp(15px,1.5vw,18px);line-height:1.5;color:var(--ew-sub);text-shadow:0 1px 16px var(--ew-shadow);text-wrap:pretty}
.ew-copy--left{align-items:flex-start;text-align:left;padding:0 clamp(20px,5vw,80px)}
.ew-copy--right{align-items:flex-end;text-align:right;padding:0 clamp(20px,5vw,80px)}
.ew-copy--left .ew-sub,.ew-copy--right .ew-sub{max-width:52ch}
.ew-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:clamp(20px,3vh,30px)}
.ew-copy--right .ew-actions{justify-content:flex-end}
.ew-copy--left .ew-actions{justify-content:flex-start}
.ew-copy:not(.ew-copy--left):not(.ew-copy--right) .ew-actions{justify-content:center}
.ew-pill{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 22px;border-radius:999px;font:inherit;font-size:15px;font-weight:500;text-decoration:none;cursor:pointer;transition:transform .25s ease,background .3s ease,border-color .3s ease}
.ew-pill:active{transform:scale(.97)}
.ew-small{height:38px;padding:0 16px;font-size:13px}
.ew-glass{color:var(--ew-text);border:1px solid var(--ew-glass-line);background:var(--ew-glass-bg);backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%)}
.ew-glass:hover{background:var(--ew-glass-bg-hover);border-color:var(--ew-glass-line-hover)}
.ew-signature{position:absolute;right:clamp(12px,2.5vw,24px);bottom:clamp(10px,2vw,18px);z-index:2;font-weight:500;font-size:clamp(11px,1.4vw,13px);letter-spacing:.01em;color:var(--ew-faint)}
.ew-signature a{color:inherit;text-decoration:none}
.ew-signature a:hover{color:var(--ew-text)}
.ew-nav a:focus-visible,.ew-pill:focus-visible{outline:2px solid var(--ew-text);outline-offset:3px}
@media (max-width:720px){.ew-links{display:none}}
@media (prefers-reduced-motion:reduce){.ew-link::after,.ew-pill{transition:none}.ew-media{animation:none!important}}
`
