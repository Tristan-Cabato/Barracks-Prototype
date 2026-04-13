import Link from "next/link"
import { Users, UserCheck, ArrowUpRight, Zap, Activity } from "lucide-react"

interface CardData {
  title: string
  totalLabel: string
  total: string
  recentLabel: string
  recent: string
  updated: string
  href: string
}

interface LandingPageProps {
  recordsData?: CardData
  inventoryData?: CardData
}

export default function LandingPage({
  recordsData = {
    title: "Customer Records",
    totalLabel: "TOTAL RECORDS",
    total: "1,247",
    recentLabel: "LATEST",
    recent: "#6767 — Customer Real",
    updated: "UPDATED 14:15",
    href: "/Records/CustomerRecords",
  },
  inventoryData = {
    title: "Staff Records",
    totalLabel: "TOTAL STAFF",
    total: "42",
    recentLabel: "LATEST",
    recent: "Daniel Cruz — Barber",
    updated: "UPDATED 11:30",
    href: "/Records/StaffRecords",
  },
}: LandingPageProps) {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background dark:bg-[#08090a]">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline effect (dark mode only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.015] dark:block"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* ─── Header Zone ─── */}
        <header
          className="mb-12"
          style={{ animation: "fade-in 0.6s ease-out both" }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground dark:text-white md:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Dashboard
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            Records management command center. Navigate to any module below.
          </p>
        </header>

        {/* ─── Stat Ticker ─── */}
        <div
          className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4"
          style={{ animation: "fade-in 0.6s 0.15s ease-out both" }}
        >
          {[
            { label: "Customers", value: recordsData.total, icon: Users, color: "text-amber-600 dark:text-amber-400" },
            { label: "Staff", value: inventoryData.total, icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Latest Entry", value: recordsData.recent, icon: Activity, color: "text-sky-600 dark:text-sky-400" },
            { label: "Sync", value: "NOW", icon: Zap, color: "text-violet-600 dark:text-violet-400" },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-lg border border-border/40 dark:border-zinc-800/80 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-sm dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70"
                style={{ animation: `fade-in 0.5s ${0.2 + i * 0.06}s ease-out both` }}
              >
                <div className="mb-2 flex items-center justify-between px-4 pt-4">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    {stat.label}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${stat.color} opacity-60 transition-opacity group-hover:opacity-100`} />
                </div>
                <div className={`px-4 pb-4 text-xl font-extrabold tracking-tight ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── Module Cards ─── */}
        <div
          className="grid gap-5 md:grid-cols-2"
          style={{ animation: "fade-in 0.6s 0.4s ease-out both" }}
        >
          <ModuleCard
            data={recordsData}
            accent="amber"
            index={0}
          />
          <ModuleCard
            data={inventoryData}
            accent="emerald"
            index={1}
          />
        </div>

        {/* ─── Footer Note ─── */}
        <div
          className="mt-10 rounded-lg border border-border/30 bg-muted/30 px-5 py-4"
          style={{ animation: "fade-in 0.5s 0.6s ease-out both" }}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Placeholder Data
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                All values shown here are hardcoded for layout purposes. Once the backend is connected, these cards will pull live data from the database — including real counts, the most recent entries, and last-updated timestamps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Module Card Sub-component ─── */
interface ModuleCardProps {
  data: CardData
  accent: "amber" | "emerald"
  index: number
}

const accentMap = {
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bgSoft: "bg-amber-500/5 dark:bg-amber-400/5",
    border: "border-amber-500/20 dark:border-amber-400/20",
    borderHover: "hover:border-amber-500/40 dark:hover:border-amber-400/40",
    titleHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    arrowHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    iconBorder: "border-amber-500/20 dark:border-amber-400/20",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    bgSoft: "bg-emerald-500/5 dark:bg-emerald-400/5",
    border: "border-amber-500/20 dark:border-emerald-400/20",
    borderHover: "hover:border-emerald-500/40 dark:hover:border-emerald-400/40",
    titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    arrowHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    iconBorder: "border-emerald-500/20 dark:border-emerald-400/20",
  },
}

function ModuleCard({ data, accent, index }: ModuleCardProps) {
  const a = accentMap[accent]
  const Icon = accent === "amber" ? Users : UserCheck

  return (
    <Link href={data.href} className="group" style={{ animation: `fade-in 0.5s ${0.45 + index * 0.1}s ease-out both` }}>
      <article
        className={`relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/30 ${a.border} ${a.borderHover}`}
      >
        {/* Top row: icon + title + timestamp */}
        <div className="mb-6 flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-110 ${a.iconBorder} ${a.bgSoft}`}>
              <Icon className={`h-5 w-5 ${a.text}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold tracking-tight text-card-foreground transition-colors duration-300 ${a.titleHover}`}>
                {data.title}
              </h2>
              <p className="font-mono text-[11px] tracking-wider text-muted-foreground">{data.updated}</p>
            </div>
          </div>
          <ArrowUpRight className={`h-5 w-5 text-muted-foreground transition-all duration-300 ${a.arrowHover} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
        </div>

        {/* Big number */}
        <div className="mb-5 px-6">
          <span className="text-6xl font-black tracking-tighter text-foreground dark:text-white md:text-7xl">
            {data.total}
          </span>
        </div>
        <div className={`mx-6 mb-5 inline-block rounded-md px-3 py-1 ${a.bgSoft}`}>
          <span className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            {data.totalLabel}
          </span>
        </div>

        {/* Bottom row: latest entry */}
        <div className="border-t border-border/30 dark:border-zinc-800/30 px-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {data.recentLabel}{" "}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{data.recent}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
