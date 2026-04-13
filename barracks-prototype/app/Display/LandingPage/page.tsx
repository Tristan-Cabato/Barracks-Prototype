import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, TrendingUp, Clock } from "lucide-react"

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
    totalLabel: "Total Records",
    total: "1,247",
    recentLabel: "Recent:",
    recent: "#6767 - Customer Real",
    updated: "Updated: Today, 2:15 PM",
    href: "/Records/CustomerRecords",
  },
  inventoryData = {
    title: "Staff Records",
    totalLabel: "Total Staff:",
    total: "42",
    recentLabel: "Recent:",
    recent: "Daniel Cruz - Barber",
    updated: "Updated: Today, 11:30 AM",
    href: "/Records/StaffRecords",
  },
}: LandingPageProps) {
  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl">
      {/* Welcome Section with Gradient */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent to-primary/5 dark:from-primary/5 dark:via-accent dark:to-primary/10 p-8 border border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your records management system.
          </p>
        </div>
      </div>

      {/* Stat Cards with Staggered Animation */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" style={{ animation: 'scale-in 0.3s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordsData.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recordsData.updated}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" style={{ animation: 'scale-in 0.3s ease-out 0.05s backwards' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventoryData.updated}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" style={{ animation: 'scale-in 0.3s ease-out 0.1s backwards' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">{recordsData.recent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Latest customer added
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" style={{ animation: 'scale-in 0.3s ease-out 0.15s backwards' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">System Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last sync: Just now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Record Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link href={recordsData.href} className="group">
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Users className="h-5 w-5" />
                {recordsData.title}
              </CardTitle>
              <CardDescription>{recordsData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="text-muted-foreground">{recordsData.totalLabel}</span>
                  <span className="font-bold text-2xl text-primary">{recordsData.total}</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-muted-foreground">{recordsData.recentLabel}</span>{" "}
                  <span className="text-sm font-medium">{recordsData.recent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={inventoryData.href} className="group">
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                <UserCheck className="h-5 w-5" />
                {inventoryData.title}
              </CardTitle>
              <CardDescription>{inventoryData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10">
                  <span className="text-muted-foreground">{inventoryData.totalLabel}</span>
                  <span className="font-bold text-2xl text-emerald-500">{inventoryData.total}</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-muted-foreground">{inventoryData.recentLabel}</span>{" "}
                  <span className="text-sm font-medium">{inventoryData.recent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Hardcoded Note */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-muted-foreground text-sm border-l-2 border-muted-foreground/20">
        <p>Note: These are hardcoded, I will replace them later with live data.</p>
      </div>
    </div>
  )
}
