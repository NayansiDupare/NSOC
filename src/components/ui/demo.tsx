import ElsewhereHero from "@/components/ui/elsewhere-hero"

const settings = {
  daySrc: "/day-animate-3-7s.mp4",
  nightSrc: "/night-animate.mp4#t=3,7",
  objectPosition: "42% 50%",
  headline: "Work from somewhere else.",
  subline: "Ambient soundscapes that follow the day — keys by morning, wind and ice by night.",
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props }

  return (
    <ElsewhereHero
      daySrc={s.daySrc}
      nightSrc={s.nightSrc}
      objectPosition={s.objectPosition}
      headline={s.headline}
      subline={s.subline}
      signature={{
        name: "guglielmogiannattasio.exe",
        url: "https://www.guglielmogiannattasio.it",
      }}
    />
  )
}
