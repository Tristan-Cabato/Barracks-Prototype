"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, Terminal } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add real authentication
    router.push("/Display/LandingPage")
  }

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

      {/* Login terminal */}
      <div
        className="relative w-full max-w-md"
        style={{ animation: "fade-in 0.6s ease-out both" }}
      >
        {/* Terminal header */}
        <div className="mb-0 flex items-center gap-3 rounded-t-xl border border-border/40 bg-muted/40 px-6 py-4 dark:border-zinc-800/60 dark:bg-zinc-900/40">
          <Terminal className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <div>
            <h1 className="font-mono text-sm font-semibold tracking-wider text-foreground">
              SYSTEM ACCESS
            </h1>
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Authentication Required
            </p>
          </div>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="rounded-b-xl border border-t-0 border-border/40 bg-card/50 p-8 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/30"
        >
          {/* Username field */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="mb-2 block font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-10 w-full rounded-md border border-border/50 bg-background/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring dark:border-zinc-700/50"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-8">
            <label
              htmlFor="password"
              className="mb-2 block font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10 w-full rounded-md border border-border/50 bg-background/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring dark:border-zinc-700/50"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-md bg-primary px-6 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
          >
            <span className="relative z-10">AUTHENTICATE</span>
          </button>

          {/* Footer note */}
          <p className="mt-5 font-mono text-[10px] leading-relaxed text-muted-foreground/70">
            Authorized personnel only. All access attempts are logged and monitored.
          </p>
        </form>
      </div>
    </div>
  )
}
