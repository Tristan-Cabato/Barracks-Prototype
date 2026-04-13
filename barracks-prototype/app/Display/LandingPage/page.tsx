import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="container mx-auto py-10 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href={recordsData.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle>{recordsData.title}</CardTitle>
              <CardDescription>{recordsData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{recordsData.totalLabel}</span>
                  <span className="font-bold text-2xl">{recordsData.total}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{recordsData.recentLabel}</span>{" "}
                  <span>{recordsData.recent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={inventoryData.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle>{inventoryData.title}</CardTitle>
              <CardDescription>{inventoryData.updated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{inventoryData.totalLabel}</span>
                  <span className="font-bold text-2xl">{inventoryData.total}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{inventoryData.recentLabel}</span>{" "}
                  <span>{inventoryData.recent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-muted-foreground">
        <p>Note: These are hardcoded, I will replace them later with live data.</p>
      </div>
    </div>
  )
}
