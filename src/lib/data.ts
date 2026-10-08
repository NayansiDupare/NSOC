import {
  BookOpenCheck,
  Boxes,
  CircleDotDashed,
  Code2,
  Crown,
  GitMerge,
  GraduationCap,
  Medal,
  Network,
  Orbit,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

export const stats = [
  { value: "45", label: "days of building", suffix: "DAY SPRINT" },
  { value: "10K+", label: "expected participants", suffix: "BUILDERS" },
  { value: "300+", label: "expected projects", suffix: "PROJECTS" },
] as const;

export const values = [
  {
    icon: Boxes,
    tag: "01 / BUILD",
    title: "Real projects",
    body: "Contribute to production-minded open-source work, not throwaway demos.",
  },
  {
    icon: GitMerge,
    tag: "02 / LEARN",
    title: "Structured guidance",
    body: "Curated issues, code review, and clear paths from first commit to merge.",
  },
  {
    icon: Trophy,
    tag: "03 / EARN",
    title: "Earned recognition",
    body: "Move up the leaderboard through meaningful, reviewed contributions.",
  },
  {
    icon: Network,
    tag: "04 / BELONG",
    title: "A real community",
    body: "Build alongside maintainers, contributors, mentors, and campus leaders.",
  },
] as const;

export const roles = [
  {
    id: "contributor",
    index: "ROLE_01",
    title: "Contributor",
    icon: Code2,
    summary: "Choose a track, solve open issues, and turn pull requests into proof of work.",
    points: [
      "Pick a track that matches your stack",
      "Browse curated open issues from real projects",
      "Submit PRs, get reviewed, and earn points per merge",
      "Climb the leaderboard and claim prizes",
    ],
    cta: "Join as contributor",
  },
  {
    id: "kernel",
    index: "ROLE_02",
    title: "Project Kernel",
    icon: Orbit,
    summary: "Bring your project, mentor contributors, and create someone’s first merge.",
    points: [
      "Submit your open-source project for the program",
      "Curate issues for contributors of every level",
      "Review PRs and mentor contributors through the codebase",
      "Get meaningful contributions and give someone their first merge",
    ],
    cta: "Submit a project",
  },
  {
    id: "ambassador",
    index: "ROLE_03",
    title: "Campus Ambassador",
    icon: GraduationCap,
    summary: "Represent NSoC on campus and turn local curiosity into an active cohort.",
    points: [
      "Represent NSoC on campus",
      "Onboard and mentor student peers",
      "Drive registrations, build cohorts, and host meetups",
      "Earn swag, leadership certificates, and perks",
    ],
    cta: "Represent your campus",
  },
] as const;

export const workflow = [
  {
    step: "01",
    title: "Register",
    body: "Create your profile and choose how you want to take part.",
    icon: CircleDotDashed,
  },
  {
    step: "02",
    title: "Explore",
    body: "Find a project, track, and issue that fit your current skills.",
    icon: BookOpenCheck,
  },
  {
    step: "03",
    title: "Contribute",
    body: "Open a PR, work through review, and ship a meaningful merge.",
    icon: GitMerge,
  },
  {
    step: "04",
    title: "Win",
    body: "Earn points, rise through the ranks, and unlock recognition.",
    icon: Sparkles,
  },
] as const;

export const rewards = [
  {
    rank: "Rank 01",
    title: "Winner",
    icon: Crown,
    featured: true,
    items: [
      "NSoC T-shirt",
      "Unstop T-shirt",
      "NSoC cap",
      "Diary, bookmark & pen",
      "NSoC hard-copy certificate",
      ".xyz domain",
      "Social media recognition",
    ],
  },
  {
    rank: "Top 03",
    title: "Podium",
    icon: Trophy,
    featured: false,
    items: [
      "NSoC T-shirt",
      "Unstop T-shirt",
      "NSoC cap",
      "Diary, bookmark & pen",
      "NSoC hard-copy certificate",
      ".xyz domain",
      "Social media recognition",
    ],
  },
  {
    rank: "Top 05",
    title: "Top five",
    icon: Medal,
    featured: false,
    items: [
      "NSoC T-shirt",
      "NSoC cap",
      "Diary, bookmark & pen",
      "NSoC hard-copy certificate",
      ".xyz domain",
      "Social media recognition",
    ],
  },
  {
    rank: "Top 10",
    title: "Top ten",
    icon: ShieldCheck,
    featured: false,
    items: [
      "NSoC cap",
      "Diary, bookmark & pen",
      "NSoC hard-copy certificate",
      "NSoC digital certificate",
      ".xyz domain",
      "Social media recognition",
    ],
  },
] as const;

export const timeline = [
  { date: "OCT 01", title: "Registration opens", state: "OPEN" },
  { date: "OCT 12", title: "Projects announced", state: "DISCOVER" },
  { date: "OCT 15", title: "Contribution period begins", state: "BUILD" },
  { date: "TBD", title: "Registrations close", state: "LOCK" },
  { date: "DEC 30", title: "Program ends", state: "SHIP" },
] as const;

export const sponsors = [
  { name: "Unstop", url: "https://unstop.com/p/open-source-program-nexus-spring-of-code-1661333" },
  { name: "Arkham Experience", url: "https://arkhamarchives.net/" },
  { name: "Extension Shield", url: "https://extensionshield.com/" },
] as const;

export const partners = [
  "Indian Society for Technical Education",
  "Microsoft Learn Community GGITS",
  "Enginow",
  "Oz Lunara",
  "HackDays",
  "Celtrix",
  "AlgoZenith",
  "Kanpur AI Space",
  "Aarambh Network",
  "WETEAMRK7",
  "GFG Campus Body KNU",
  "SphereX",
  "Amogha AI",
  "Sotercare",
  "The Event Wallah",
] as const;

export const socialLinks = [
  { label: "Discord", url: "https://discord.gg/bZ47fac2jn" },
  { label: "Instagram", url: "https://instagram.com/nsoc.in" },
  { label: "LinkedIn", url: "https://linkedin.com/company/nso-code" },
  { label: "YouTube", url: "https://youtube.com/@nsoc-in" },
  { label: "WhatsApp", url: "https://chat.whatsapp.com/Cs6bcCYUD5zLXmElzX9HOq" },
] as const;
