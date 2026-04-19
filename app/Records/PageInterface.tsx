"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/app/Display/Header";
import { Plus, Search, ChevronDown } from "lucide-react";

interface RecordItem {
  id: string;
  name: string;
  subtitle1?: string;
  subtitle2?: string;
}

interface PageInterfaceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  records: RecordItem[];
  totalLabel: string;
  onAdd?: () => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    'white': 'text-white',
    'yellow': 'text-yellow-500',
    'green': 'text-teal-400',
    'pink': 'text-pink-500',
    'blue': 'text-sky-400',
    'purple': 'text-purple-500'
  };
  return colorMap[color] || 'text-white';
};

const getBgClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    'white': 'bg-white',
    'yellow': 'bg-yellow-500',
    'green': 'bg-teal-400',
    'pink': 'bg-pink-500',
    'blue': 'bg-sky-400',
    'purple': 'bg-purple-500'
  };
  return colorMap[color] || 'bg-white';
};

const getBorderClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    'white': 'border-white',
    'yellow': 'border-yellow-500',
    'green': 'border-teal-400',
    'pink': 'border-pink-500',
    'blue': 'border-sky-400',
    'purple': 'border-purple-500'
  };
  return colorMap[color] || 'border-white';
};

export default function PageInterface({
  title,
  description,
  icon,
  color,
  records,
  totalLabel,
  onAdd,
  onView,
  onEdit,
  onDelete
}: PageInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "recent">("name-asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const colorClass = getColorClass(color);
  const bgClass = getBgClass(color);
  const borderClass = getBorderClass(color);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const visible = records.filter((record) =>
      record.name.toLowerCase().includes(normalizedQuery)
    );

    return visible.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return b.id.localeCompare(a.id);
    });
  }, [records, searchQuery, sortBy]);

  const selectedRecord = records.find((r) => r.id === selectedId) || filteredRecords[0] || null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Icon with square bg */}
              <div className={`w-12 h-12 ${bgClass}/80 bg-opacity-20 ${borderClass} border rounded-lg flex items-center justify-center ${colorClass}`}>
                {icon}
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
            </div>
            {/* Add Button */}
            <button
              onClick={onAdd}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bgClass}/80 bg-opacity-20 ${borderClass} border ${colorClass} hover:bg-opacity-30 transition-all`}
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name-asc" | "name-desc" | "recent")}
                className="appearance-none px-4 py-3 pr-10 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="recent">Recently Added</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Record Count */}
          <p className="text-gray-400">
            {totalLabel}: <span className="text-white font-semibold">{filteredRecords.length}</span>
          </p>

          {/* Records List */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedId(record.id)}
                className={`flex justify-between items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedId === record.id
                    ? 'border-gray-400 bg-gray-800'
                    : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">{record.name}</span>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    {record.subtitle1 && (
                      <span className="flex items-center gap-1">
                        {record.subtitle1}
                      </span>
                    )}
                    {record.subtitle2 && (
                      <span className="flex items-center gap-1">
                        {record.subtitle2}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(record.id);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                >
                  View
                </button>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No records found matching your search.
              </p>
            )}
          </div>

          {/* Warning Note */}
          <p className="bg-gray-900/80 text-yellow-400 p-5 rounded-lg border border-yellow-500/30">
            ○ Note: These are hardcoded, I will replace them later with live data.
          </p>

          {/* Back Link */}
          <Link href="/Display/LandingPage" className="text-sm text-gray-400 hover:text-white inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}

/* ============ Holding the Prototypes ================= */

/* ===================
Customer Records

// NEW UNIFIED INTERFACE - PeerReview branch implementation
import PageInterface from "../PageInterface";
import { Network } from "lucide-react";

const sampleCustomers = [
  {
    "id": "cust-1001",
    "name": "Alyssa Rivera",
    "email": "alyssa.rivera@email.com",
    "contactNumber": "+63 917 555 0111",
    "createdAt": "2026-01-18T10:22:00.000Z"
  },
  {
    "id": "cust-1002",
    "name": "Marc Tan",
    "email": "marc.tan@email.com",
    "contactNumber": "+63 917 555 0142",
    "createdAt": "2026-02-04T13:45:00.000Z"
  },
  {
    "id": "cust-1003",
    "name": "Jessa Lim",
    "email": "jessa.lim@email.com",
    "contactNumber": "+63 917 555 0188",
    "createdAt": "2026-03-01T08:10:00.000Z"
  }
];

export default function CustomerRecordsPage() {
  return (
    <PageInterface
      title="Customer Records"
      description="Browse, search, and manage all customer records"
      icon={<Network size={24} />}
      color="pink"
      records={sampleCustomers}
      totalLabel="All Items"
      onAdd={() => console.log("Add item")}
      onView={(id) => console.log("View item", id)}
      onEdit={(id) => console.log("Edit item", id)}
      onDelete={(id) => console.log("Delete item", id)}
    />
  );
} ===================
*/

/* 
================ 
Staff Records 
// NEW UNIFIED INTERFACE - PeerReview branch implementation
import PageInterface from "../PageInterface";
import { Network } from "lucide-react";

const sampleStaff = [
  { id: "1", name: "Daniel Cruz", subtitle1: "Barber", subtitle2: "daniel@barracks.com" },
  { id: "2", name: "Maria Santos", subtitle1: "Cashier", subtitle2: "maria@barracks.com" },
  { id: "3", name: "John Reyes", subtitle1: "Manager", subtitle2: "john@barracks.com" },
];

export default function StaffRecordsPage() {
  return (
    <PageInterface
      title="Staff"
      description="Browse, search, and manage all staff records"
      icon={<Network size={24} />}
      color="green"
      records={sampleStaff}
      totalLabel="All Staff"
      onAdd={() => console.log("Add staff")}
      onView={(id) => console.log("View staff", id)}
      onEdit={(id) => console.log("Edit staff", id)}
      onDelete={(id) => console.log("Delete staff", id)}
    />
  );
} ==================
*/

