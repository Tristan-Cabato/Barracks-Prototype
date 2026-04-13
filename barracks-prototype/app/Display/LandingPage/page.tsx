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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your records management system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordsData.total}</div>
            <p className="text-xs text-muted-foreground">
              {recordsData.updated}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.total}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryData.updated}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{recordsData.recent}</div>
            <p className="text-xs text-muted-foreground">
              Latest customer added
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">System Online</div>
            <p className="text-xs text-muted-foreground">
              Last sync: Just now
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href={recordsData.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {recordsData.title}
              </CardTitle>
              <CardDescription>{recordsData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{recordsData.totalLabel}</span>
                  <span className="font-bold text-2xl">{recordsData.total}</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-muted-foreground">{recordsData.recentLabel}</span>{" "}
                  <span className="text-sm font-medium">{recordsData.recent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={inventoryData.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {inventoryData.title}
              </CardTitle>
              <CardDescription>{inventoryData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{inventoryData.totalLabel}</span>
                  <span className="font-bold text-2xl">{inventoryData.total}</span>
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

      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-muted-foreground text-sm">
        <p>Note: These are hardcoded, I will replace them later with live data.</p>
      </div>
    </div>
  )
}
