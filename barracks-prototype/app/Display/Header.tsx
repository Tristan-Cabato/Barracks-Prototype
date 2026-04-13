"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, UserCheck, Database } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  
  // Don't show header on login page
  if (pathname === "/" || pathname === "/Display/LoginPage") {
    return null
  }

  const navItems = [
    { href: "/Display/LandingPage", label: "Dashboard", icon: LayoutDashboard },
    { href: "/Records/CustomerRecords", label: "Customers", icon: Users },
    { href: "/Records/StaffRecords", label: "Staff", icon: UserCheck },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-4">
          <Link href="/Display/LandingPage" className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span className="font-bold">Barracks</span>
          </Link>
          
          <nav className="flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Records Management
          </span>
        </div>
      </div>
    </header>
  )
}
