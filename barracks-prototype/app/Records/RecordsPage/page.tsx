import { FolderOpen } from "lucide-react"

export default function RecordsPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-background">
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

      {/* Under construction terminal */}
      <div
        className="relative w-full max-w-md text-center"
        style={{ animation: "fade-in 0.6s ease-out both" }}
      >
        <FolderOpen className="mx-auto mb-6 h-16 w-16 text-sky-500/60 dark:text-sky-400/60" />
        <h1 className="font-mono text-2xl font-bold tracking-wider text-foreground md:text-3xl">
          RECORDS MODULE
        </h1>
        <p className="mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          Under Construction
        </p>
        <div className="mx-auto mt-6 h-px w-24 bg-border/50" />
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
          This module is being built. Check back soon for general records management.
        </p>
      </div>
    </div>
  )
}
