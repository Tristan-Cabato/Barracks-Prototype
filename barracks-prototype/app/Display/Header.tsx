"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Moon, Sun } from "lucide-react"
import barracksLogo from "../../barracks1200x700.png"

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show header on login page
  if (pathname === "/" || pathname === "/Display/LoginPage") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-14 items-center px-8">
        <nav className="flex items-center space-x-2 lg:space-x-4">
          {/* Dashboard logo button */}
          <Link href="/Display/LandingPage"
            className="flex items-center rounded-md p-1 transition-opacity duration-200 hover:opacity-60"
          >
            <img
              src={barracksLogo.src}
              alt="Dashboard"
              className="h-8 w-auto dark:invert"
            />
          </Link>
          <Link href="/Records/CustomerRecords">
            <Button
              variant={pathname === "/Records/CustomerRecords" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${
                pathname === "/Records/CustomerRecords"
                  ? "!bg-muted/50 dark:!bg-zinc-800/40 !text-foreground hover:!bg-muted/40 dark:hover:!bg-zinc-800/30"
                  : "hover:bg-muted/40 dark:hover:bg-zinc-800/30 !text-foreground/80 hover:!text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Customers
            </Button>
          </Link>
          <Link href="/Records/StaffRecords">
            <Button
              variant={pathname === "/Records/StaffRecords" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${
                pathname === "/Records/StaffRecords"
                  ? "!bg-muted/50 dark:!bg-zinc-800/40 !text-foreground hover:!bg-muted/40 dark:hover:!bg-zinc-800/30"
                  : "hover:bg-muted/40 dark:hover:bg-zinc-800/30 !text-foreground/80 hover:!text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Staff
            </Button>
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Records Management
          </span>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 !text-foreground/80 hover:bg-muted/40 dark:hover:bg-zinc-800/30 hover:!text-foreground transition-all duration-200"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
