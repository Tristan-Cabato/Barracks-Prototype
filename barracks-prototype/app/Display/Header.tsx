"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, Network, Package, UserRound, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import SearchContainer from "@/app/Records/Search";
import usersData from "@/app/data/users.json";

export default function Header() {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<any>(null);
    // Bypassing type checking will break if assumed interface is not followed
    const [isAdminUser, setIsAdminUser] = useState(false);

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


    if (pathname === "/") { return null }

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
                <SearchContainer />
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