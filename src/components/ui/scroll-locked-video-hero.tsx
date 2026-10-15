"use client"

import { useEffect, useRef, useState } from "react"

// ─────────────────────────────────────────────────────────────
// NEXUS SPRING OF CODE — locked scroll-scrub video hero
// While active, the page cannot move — body is pinned with
// position:fixed (the same technique modal libraries use; plain
// overflow:hidden alone isn't reliable across browsers). Wheel/touch
// input is captured and used purely to drive video.currentTime,
// forward and backward. Once the video reaches the end and the user
// keeps pushing forward, the page unlocks and continues normally —
// and re-locks if they scroll back up to the top. No dependencies,
// system fonts only. As the far train's doors open, a second clip
// (`revealSrc`) is shown through the door gap instead of the city.
// ─────────────────────────────────────────────────────────────

export interface MetroHeroProps {
  videoSrc?: string
  title?: string
  scrollHint?: string
  tagline?: string
  signature?: { name: string; url: string } | false
  /** Total input distance (px) needed to scrub the full video. Tune to taste. */
  scrubDistance?: number
  /** Clip shown through the opening doors (default metro video only). Pass "" to keep the original city. */
  revealSrc?: string
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_VIDEO = "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
// Snowy city street at night (Pexels free license).
const DEFAULT_REVEAL = "https://videos.pexels.com/video-files/11067515/11067515-hd_1280_720_24fps.mp4"
const DEFAULT_SIGNATURE = { name: "guglielmogiannattasio.exe", url: "https://www.guglielmogiannattasio.it" }
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

// Frozen Night palette, dark hero values. The footage is night-time, so
// these stay dark in light mode too.
const COL_BG = "#060b16"
const COL_TEXT = "#f4f8fc"
const COL_SHADOW = "rgba(4,12,28,0.55)"
const COL_HINT = "rgba(220,239,255,0.75)"
const COL_SIGNATURE = "rgba(159,176,200,0.7)"
const COL_SIGNATURE_HOVER = "#a9dbfa"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

// Where the city shows through in the default metro clip, traced by
// hand per frame (24 fps). Each track is [frame, ...rects] with rects as
// [left, right, top, bottom] in % of the 16:9 frame; values in between
// are interpolated. The winter clip is clipped to these shapes.
type Rect = [number, number, number, number]
type Track = { keys: [number, ...Rect[]][]; fillAfter?: boolean; bleed: number }

const METRO_FPS = 24
const REVEAL_TRACKS: Track[] = [
  // Gap between the far train's doors, until it fills the screen.
  {
    bleed: 0.4,
    fillAfter: true,
    keys: [
      [54, [50, 50, 18, 90]],
      [57, [49.4, 50.6, 18, 90]],
      [61, [48.8, 51.2, 18, 90]],
      [64, [48.4, 51.3, 18, 90]],
      [67, [47.7, 52.5, 18, 90]],
      [70, [46.8, 53.1, 17.5, 90]],
      [73, [45.6, 54.4, 18, 90]],
      [76, [44.8, 55.1, 17.5, 90.5]],
      [79, [43.3, 56.7, 16.7, 91]],
      [82, [41.9, 58.3, 16.4, 92]],
      [85, [40.1, 60, 15.7, 92]],
      [88, [38.6, 61.3, 15, 92.5]],
      [91, [37.4, 62.9, 14, 94]],
      [94, [35.6, 64.6, 13.4, 95.5]],
      [97, [34, 65.5, 13, 96.8]],
      [102, [32.8, 66.8, 12.8, 97.7]],
      [108, [31.3, 68, 11.5, 100]],
      [114, [30, 69.3, 9.2, 100]],
      [120, [29.7, 70, 4, 100]],
      [126, [27, 73.5, 0, 100]],
      [132, [23.5, 77.5, 0, 100]],
      [138, [19, 83, 0, 100]],
      [142, [15, 87, 0, 100]],
      [146, [10, 95, 0, 100]],
      [150, [0, 100, 0, 100]],
    ],
  },
  // Windows in the far train's doors, sliding apart.
  {
    bleed: 0,
    keys: [
      [48, [45, 45, 23.4, 60.7], [55, 55, 23.4, 60.7]],
      [52, [43.3, 47, 23.4, 60.7], [53, 56.7, 23.4, 60.7]],
      [57, [40.3, 46.5, 23.4, 60.7], [53.5, 59.7, 23.4, 60.7]],
      [61, [39, 46, 23, 61], [53.5, 61, 23, 61]],
      [67, [37, 45, 23, 61], [55, 62, 23, 61]],
      [73, [35.5, 43, 23, 61], [57, 64.5, 23, 61]],
      [79, [34.5, 40.3, 22.5, 61], [59.7, 65, 22.5, 61]],
      [85, [34.2, 37.6, 21.6, 61], [62.3, 65.7, 21.6, 61]],
      [88, [33.7, 35.8, 21.6, 61], [64.4, 66, 21.6, 61]],
      [91, [33.5, 33.5, 21.6, 61], [66, 66, 21.6, 61]],
    ],
  },
  // Windows in the near train's doors as the camera passes through.
  {
    bleed: 0,
    keys: [
      [111, [21, 21, 16, 70], [78, 78, 16, 70]],
      [114, [20, 26, 16, 70], [73.5, 79, 16, 70]],
      [120, [17.5, 23.5, 13, 68], [77, 82, 13, 68]],
      [126, [13.5, 18, 11, 73], [80, 86, 11, 73]],
      [132, [8, 15.5, 5, 74], [84, 90.5, 5, 74]],
      [138, [0, 8.5, 0, 80], [95, 100, 0, 80]],
      [142, [0, 3, 0, 80], [100, 100, 0, 80]],
    ],
  },
]

const HIDDEN_CLIP = "inset(50% 50% 50% 50%)"

function trackRects({ keys, fillAfter, bleed }: Track, frame: number): Rect[] {
  const first = keys[0]
  const last = keys[keys.length - 1]
  if (frame <= first[0]) return []
  if (frame >= last[0]) return fillAfter ? [[0, 100, 0, 100]] : []
  let i = 1
  while (keys[i][0] < frame) i++
  const a = keys[i - 1]
  const b = keys[i]
  const t = (frame - a[0]) / (b[0] - a[0])
  const rects: Rect[] = []
  for (let k = 1; k < a.length; k++) {
    const ra = a[k] as Rect
    const rb = b[k] as Rect
    const [l, r, top, bottom] = ra.map((v, n) => v + (rb[n] - v) * t)
    if (r - l < 0.05) continue
    rects.push([Math.max(0, l - bleed), Math.min(100, r + bleed), Math.max(0, top - bleed), Math.min(100, bottom + bleed)])
  }
  return rects
}

// Union of rectangles as one polygon: each rect is visited from a shared
// anchor and back, so the connecting segments enclose no area.
function revealClip(frame: number) {
  const rects = REVEAL_TRACKS.flatMap((track) => trackRects(track, frame))
  if (rects.length === 0) return HIDDEN_CLIP
  if (rects.some(([l, r, t, b]) => l <= 0 && r >= 100 && t <= 0 && b >= 100)) return "inset(0)"
  const pts = ["0% 0%"]
  for (const [l, r, t, b] of rects) {
    pts.push(`${l}% ${t}%`, `${r}% ${t}%`, `${r}% ${b}%`, `${l}% ${b}%`, `${l}% ${t}%`, "0% 0%")
  }
  return `polygon(${pts.join(", ")})`
}

export default function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  title = "NEXUS SPRING OF CODE",
  scrollHint = "SCROLL",
  tagline = "Winter Edition · 15 Oct – 30 Dec 2026",
  signature = DEFAULT_SIGNATURE,
  scrubDistance = 3200,
  revealSrc = DEFAULT_REVEAL,
  className,
  style,
}: MetroHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let duration = 0
    let rafId = 0
    let targetProgress = 0
    let currentProgress = 0
    let hasStartedScrolling = false
    let isSeeking = false
    let pendingTime: number | null = null
    let locked = false
    let lockedScrollY = 0
    let touchStartY = 0

    const onLoadedData = () => {
      duration = video.duration || 0
      setReady(true)
      if (reduceMotion) {
        video.currentTime = duration * 0.92
      }
    }
    video.addEventListener("loadeddata", onLoadedData)

    // iOS Safari often won't buffer any video data — even with
    // preload="auto" — until playback actually starts, to save mobile
    // data. Since we only ever seek (never call play() elsewhere), the
    // video can stay permanently blank on iPhone. Force a silent
    // play-then-immediately-pause on mount to kick off real loading.
    const kickstartLoad = () => {
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {})
      } else {
        video.pause()
      }
    }
    kickstartLoad()

    const onSeeked = () => {
      isSeeking = false
      if (pendingTime !== null) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        video.currentTime = t
      }
    }
    video.addEventListener("seeked", onSeeked)

    const seekTo = (t: number) => {
      if (isSeeking) {
        pendingTime = t
        return
      }
      isSeeking = true
      video.currentTime = t
    }

    function engageLock() {
      if (locked || typeof document === "undefined") return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
      b.height = "100%"
      b.overscrollBehavior = "none"
    }

    function releaseLock() {
      if (!locked || typeof document === "undefined") return
      locked = false
      const y = lockedScrollY
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.height = ""
      b.overscrollBehavior = ""
      window.scrollTo(0, y)
    }

    // Only lock when the page starts at the top (e.g. not on a reload
    // mid-page or a deep link to a section further down).
    if (!reduceMotion && window.scrollY <= 1) {
      engageLock()
    } else {
      targetProgress = currentProgress = 1
      hasStartedScrolling = true
    }

    // Returns true when the input was consumed by the scrub (and the
    // native scroll should be prevented).
    function handleDelta(deltaY: number) {
      if (reduceMotion) return false

      if (!locked) {
        // Re-lock when the user pushes back up while at the very top.
        if (deltaY < 0 && window.scrollY <= 1) {
          engageLock()
        } else {
          return false
        }
      }

      // Video finished and the user keeps going forward → hand the
      // scroll back to the page.
      if (deltaY > 0 && targetProgress >= 1 && currentProgress > 0.995) {
        releaseLock()
        return false
      }

      targetProgress = clamp(targetProgress + deltaY / scrubDistance, 0, 1)
      if (targetProgress > 0.001) hasStartedScrolling = true
      return true
    }

    const onWheel = (e: WheelEvent) => {
      if (handleDelta(e.deltaY)) e.preventDefault()
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      touchStartY = y
      if (handleDelta(deltaY)) e.preventDefault()
    }

    // Anchor links (e.g. header nav) can't scroll a pinned body — let
    // them through by releasing the lock first.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!link || !locked) return
      targetProgress = currentProgress = 1
      hasStartedScrolling = true
      releaseLock()
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("click", onClick, true)
    // Also bind directly on the element itself, with capture — on some
    // iOS versions a window-level listener alone can lose the race
    // against the browser's own native scroll handling.
    section.addEventListener("touchstart", onTouchStart, { passive: true, capture: true })
    section.addEventListener("touchmove", onTouchMove, { passive: false, capture: true })

    const frame = () => {
      currentProgress += (targetProgress - currentProgress) * 0.18

      if (duration > 0) {
        seekTo(currentProgress * duration)
      }

      if (stageRef.current) {
        const scale = 1 + currentProgress * 0.06
        stageRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`
      }
      if (revealRef.current) {
        // Follow the frame actually on screen, not the eased target.
        revealRef.current.style.clipPath = revealClip(video.currentTime * METRO_FPS)
      }
      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.35, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
      }
      if (taglineRef.current) {
        // Mirrors the title's blur-focus treatment, timed as the payoff
        // once the reveal is nearly complete — not a background afterthought.
        const t = clamp((currentProgress - 0.82) / 0.18, 0, 1)
        taglineRef.current.style.opacity = String(t)
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentProgress})`
      }

      rafId = requestAnimationFrame(frame)
    }

    if (!reduceMotion) {
      rafId = requestAnimationFrame(frame)
    } else if (revealRef.current) {
      revealRef.current.style.clipPath = "inset(0)"
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData)
      video.removeEventListener("seeked", onSeeked)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("click", onClick, true)
      section.removeEventListener("touchstart", onTouchStart, true)
      section.removeEventListener("touchmove", onTouchMove, true)
      cancelAnimationFrame(rafId)
      releaseLock()
    }
  }, [scrubDistance])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: COL_BG,
        ...style,
      }}
    >
      {/* 16:9 stage sized like object-fit: cover, so the door-gap
          percentages line up with the metro footage at any viewport. */}
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "max(100%, calc(100dvh * 16 / 9))",
          aspectRatio: "16 / 9",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.6s ease",
            touchAction: "none",
          }}
        />
        {revealSrc && videoSrc === DEFAULT_VIDEO && (
          <video
            ref={revealRef}
            src={revealSrc}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              clipPath: HIDDEN_CLIP,
              touchAction: "none",
            }}
          />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,11,22,0.40), rgba(6,11,22,0) 30%, rgba(10,24,44,0.20) 70%, rgba(6,11,22,0.60))",
          pointerEvents: "none",
        }}
      />

      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: "clamp(30px, 7vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: COL_TEXT,
            textShadow: `0 4px 30px ${COL_SHADOW}`,
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {title}
        </span>
      </div>

      {tagline && (
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8%",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "clamp(20px, 3.4vw, 40px)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: COL_TEXT,
              textShadow: `0 4px 24px ${COL_SHADOW}`,
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px, 6vh, 48px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: COL_HINT,
          fontFamily: SANS,
          fontSize: "clamp(10px, 1.4vw, 12px)",
          fontWeight: 600,
          letterSpacing: "0.3em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg width="14" height="18" viewBox="0 0 14 18" style={{ animation: "metro-hero-bounce 1.6s ease-in-out infinite" }}>
          <style>{`
            @keyframes metro-hero-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(5px); opacity: 1; }
            }
          `}</style>
          <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Thin progress line — fills as the video advances. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(169,219,250,0.15)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, rgba(124,196,242,0.6), rgba(220,239,255,0.95))",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {signature && (
        <span
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.01em",
            color: COL_SIGNATURE,
            zIndex: 2,
          }}
        >
          by{" "}
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COL_SIGNATURE,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = COL_SIGNATURE_HOVER
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = COL_SIGNATURE
            }}
          >
            {signature.name}
          </a>
        </span>
      )}
    </div>
  )
}
