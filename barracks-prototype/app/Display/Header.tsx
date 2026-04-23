"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, Network, Package, UserRound, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import SearchFilter from "@/app/Records/Search";
import { InventoryItem, StaffMember, useInventoryStorage, useStaffStorage } from "../Records/DataPersistence/Storage";
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

function getUniqueCategories(inventoryItems: InventoryItem[]): string[] {
  const categories = new Set(inventoryItems.map(item => item.category));
  return ["all", ...Array.from(categories).sort()];
}

function getUniqueRoles(staffItems: StaffMember[]): string[] {
  const roles = new Set(staffItems.map(staff => staff.role));
  return ["all", ...Array.from(roles).sort()];
}

export default function Header() {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<any>(null);
    // Bypassing type checking will break if assumed interface is not followed
    const [isAdminUser, setIsAdminUser] = useState(false);

    // Get data from storage hooks
    const { inventoryItems } = useInventoryStorage();
    const { staff } = useStaffStorage();

    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            const user = JSON.parse(stored);
            setCurrentUser(user);
            
            const userRecord = usersData.find((u: any) => u.staffId === user.staffId);
            // Find a matching staffId regardless of type (not really helping)
            setIsAdminUser(userRecord?.isAdmin || false);
        }
    }, []);

    useEffect(() => {
        setSearchQuery("");
        setCategoryFilter("all");
        setSortBy("name-asc");
    }, [pathname]);

    if (pathname === "/") { return null }
    const isDashboard = pathname === "/Display/LandingPage";
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
                categoryOptions: getUniqueRoles(staff),
                categoryLabel: "Role",
            };
        }
        if (isInventoryPage) {
            return {
                placeholder: "Search by item name, category, or ID",
                sortOptions: inventorySortOptions,
                categoryOptions: getUniqueCategories(inventoryItems),
                categoryLabel: "Category",
            };
        }
        return {
            placeholder: "Search",
            sortOptions: [{ value: "name-asc", label: "Sort: A-Z" }],
            categoryOptions: [],
            categoryLabel: "Filter",
        };
    }, [isCustomerRecords, isStaffRecords, isInventoryPage, staff, inventoryItems]);

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

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        setIsAdminUser(false);
        setIsDropdownOpen(false);
        window.location.href = "/";
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
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <UserRound size={18} style={{color: "#10b981"}} />
                                <span className="text-green-400 text-sm">
                                    {currentUser.name}
                                </span>
                                <ChevronDown size={14} style={{color: "#10b981"}} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-500 rounded-md shadow-lg z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/">
                            <span className="text-white text-sm hover:underline">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}