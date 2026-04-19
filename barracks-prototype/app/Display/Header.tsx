"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, Network, Package, UserRound } from 'lucide-react'
import Link from 'next/link'
import SearchFilter from "@/app/Records/Search";
import seedInventory from "@/app/data/inventory.json";
import seedStaff from "@/app/data/staff.json";
import usersData from "@/app/data/users.json";

const customerSortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "name-desc", label: "Sort: Name Z-A" },
  { value: "recent", label: "Sort: Recently Added" },
];

const staffSortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "salary-high", label: "Sort: Salary High-Low" },
  { value: "salary-low", label: "Sort: Salary Low-High" },
];

const inventorySortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "quantity-low", label: "Sort: Quantity Low-High" },
  { value: "quantity-high", label: "Sort: Quantity High-Low" },
  { value: "value-high", label: "Sort: Value High-Low" },
  { value: "recent", label: "Sort: Recently Updated" },
];

function getUniqueCategories(): string[] {
  const categories = new Set(seedInventory.map(item => item.category));
  return ["all", ...Array.from(categories).sort()];
}

function getUniqueRoles(): string[] {
  const roles = new Set(seedStaff.map(staff => staff.role));
  return ["all", ...Array.from(roles).sort()];
}

export default function Header() {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdminUser, setIsAdminUser] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");

    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            const user = JSON.parse(stored);
            setCurrentUser(user);
            
            // Check if user is admin from users.json by staffId
            const userRecord = usersData.find((u: any) => u.staffId === user.staffId);
            setIsAdminUser(userRecord?.isAdmin || false);
        }
    }, []);

    useEffect(() => {
        setSearchQuery("");
        setCategoryFilter("all");
        setSortBy("name-asc");
    }, [pathname]);

    const isDashboard = pathname === "/Display/LandingPage" || pathname === "/";
    const isCustomerRecords = pathname?.startsWith("/Records/CustomerRecords");
    const isStaffRecords = pathname?.startsWith("/Records/StaffRecords");
    const isInventoryPage = pathname?.startsWith("/Records/InventoryPage");

    const searchConfig = useMemo(() => {
        if (isCustomerRecords) {
            return {
                placeholder: "Search customers by name",
                sortOptions: customerSortOptions,
                categoryOptions: [],
                categoryLabel: "Filter",
            };
        }
        if (isStaffRecords) {
            return {
                placeholder: "Search staff by name",
                sortOptions: staffSortOptions,
                categoryOptions: getUniqueRoles(),
                categoryLabel: "Role",
            };
        }
        if (isInventoryPage) {
            return {
                placeholder: "Search by item name, category, or ID",
                sortOptions: inventorySortOptions,
                categoryOptions: getUniqueCategories(),
                categoryLabel: "Category",
            };
        }
        return {
            placeholder: "Search",
            sortOptions: [{ value: "name-asc", label: "Sort: A-Z" }],
            categoryOptions: [],
            categoryLabel: "Filter",
        };
    }, [isCustomerRecords, isStaffRecords, isInventoryPage]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        window.dispatchEvent(new CustomEvent("headerSearch", { detail: value }));
    };

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        window.dispatchEvent(new CustomEvent("headerCategoryFilter", { detail: value }));
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        window.dispatchEvent(new CustomEvent("headerSort", { detail: value }));
    };

    return (
        <header className="flex flex-row justify-between items-center p-4 bg-gray-800 sticky top-0 z-10">
            <div className="flex flex-row items-center gap-8">
                <Link href="/Display/LandingPage" aria-label="Go to Dashboard">
                    <img src="/barracks1200x700.png" alt="Logo" className="h-10 w-10 rounded-lg brightness-0 invert cursor-pointer" />
                </Link>
                <Link href="/Records/CustomerRecords" className="flex flex-row gap-2">
                    <User style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Customer Records
                    </h2>
                </Link>
                <Link href="/Records/StaffRecords" className="flex flex-row gap-2">
                    <Network style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Staff Records
                    </h2>
                </Link>

                <Link href="/Records/InventoryPage" className="flex flex-row gap-2">
                    <Package style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Inventory
                    </h2>
                </Link>
            </div>

            <div className="flex flex-row items-center gap-2">
                <SearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder={searchConfig.placeholder}
                    categoryFilter={categoryFilter}
                    onCategoryChange={searchConfig.categoryOptions.length > 0 ? handleCategoryChange : undefined}
                    categoryOptions={searchConfig.categoryOptions}
                    categoryLabel={searchConfig.categoryLabel}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    sortOptions={searchConfig.sortOptions}
                    disabled={isDashboard}
                    disabledMessage="Nothing to search"
                />
                <div className="flex items-center gap-3">
                    {currentUser ? (
                        <div className="flex items-center gap-2">
                            <UserRound size={18} style={{color: "#10b981"}} />
                            <span className="text-green-400 text-sm">
                                {currentUser.name}
                            </span>
                        </div>
                    ) : (
                        <Link href="/Display/LoginPage">
                            <span className="text-white text-sm hover:underline">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}