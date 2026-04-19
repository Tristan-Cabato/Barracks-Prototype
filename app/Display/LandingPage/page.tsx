"use client";

import Card, { SmallCard } from "../Card";
import Header from "../Header";
import { User, Network, Package, TrendingUp } from 'lucide-react';
import { useCustomerStorage } from "@/app/Records/DataPersistence/Storage";
import { useStaffStorage } from "@/app/Records/DataPersistence/Storage";
import { useInventoryStorage } from "@/app/Records/DataPersistence/Storage";

interface CardData {
    title: string;
    totalLabel: string;
    total: string;
    recentLabel: string;
    recent: string;
    updated: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}

interface SmallCardsData {
    title: string
    icon: React.ReactNode
    value: string
    color: string
}

interface LandingPageProps {
    cardsData?: CardData[];
    smallCardsData?: SmallCardsData[];
}

export default function LandingPage({
    cardsData,
    smallCardsData
}: LandingPageProps) {
    const { customers } = useCustomerStorage();
    const { staff } = useStaffStorage();
    const { inventoryItems } = useInventoryStorage();

    const mostRecentCustomer = customers[0];
    const mostRecentStaff = staff[0];
    const mostRecentInventory = inventoryItems[0];

    const defaultCardsData: CardData[] = [
        {
            title: "Customer Records",
            totalLabel: "Total Records",
            total: customers.length.toLocaleString(),
            recentLabel: "Recent:",
            recent: mostRecentCustomer
                ? `#${mostRecentCustomer.id} - ${mostRecentCustomer.name}`
                : "No records yet",
            updated: mostRecentCustomer
                ? `Updated: ${new Date(mostRecentCustomer.createdAt).toLocaleString()}`
                : "No data",
            href: "/Records/CustomerRecords",
            icon: <User size={20} />,
            color: "yellow"
        },
        {
            title: "Staff Records",
            totalLabel: "Total Staff:",
            total: staff.length.toLocaleString(),
            recentLabel: "Recent:",
            recent: mostRecentStaff
                ? `#${mostRecentStaff.id} - ${mostRecentStaff.name} (${mostRecentStaff.role})`
                : "No records yet",
            updated: mostRecentStaff
                ? `Updated: ${new Date(mostRecentStaff.createdAt).toLocaleString()}`
                : "No data",
            href: "/Records/StaffRecords",
            icon: <Network size={20} />,
            color: "green"
        },
        {
            title: "Inventory",
            totalLabel: "Total Items:",
            total: inventoryItems.length.toLocaleString(),
            recentLabel: "Recent:",
            recent: mostRecentInventory
                ? `#${mostRecentInventory.itemID} - ${mostRecentInventory.itemName}`
                : "No records yet",
            updated: mostRecentInventory
                ? `Updated: ${new Date(mostRecentInventory.updatedAt).toLocaleString()}`
                : "No data",
            href: "/Records/InventoryPage",
            icon: <Package size={20} />,
            color: "pink"
        }
    ];

    const defaultSmallCardsData: SmallCardsData[] = [
        { title: "CUSTOMERS", icon: <User size={16} />, value: customers.length.toLocaleString(), color: "yellow" },
        { title: "STAFF", icon: <Network size={16} />, value: staff.length.toLocaleString(), color: "green" },
        { title: "PRODUCTS", icon: <Package size={16} />, value: inventoryItems.length.toLocaleString(), color: "pink" },
        {
            title: "LATEST ENTRY",
            icon: <Package size={16} />,
            value: mostRecentCustomer
                ? `#${mostRecentCustomer.id} - ${mostRecentCustomer.name}`
                : "No data",
            color: "blue"
        },
        { title: "SYNC", icon: <TrendingUp size={16} />, value: "LIVE", color: "purple" }
    ];

    const finalCardsData = cardsData ?? defaultCardsData;
    const finalSmallCardsData = smallCardsData ?? defaultSmallCardsData; 
    return (
        <>
            <Header />
            <div className="relative">
                <img 
                src="https://avatar.setmore.com/files/img/fnQDGUanIxuY/87d76986-7faa-4cf4-840e-4bcff5ed6256.jpeg?crop=2048;689;0;148" 
                alt="Barracks Logo" 
                className="fixed inset-0 w-full h-full object-cover -z-10" 
                />
                <div className="fixed inset-0 bg-black/50 -z-10"></div>
            </div>
            
            <h1 className="text-7xl font-bold text-center text-white mt-12 z-10 drop-shadow-2xl"> Dashboard </h1>
            <p className="text-center text-white mt-2 z-10 text-lg drop-shadow-lg"> Records management command center. Navigate to any module below. </p>
            <div className="flex flex-row gap-8 justify-center mt-8">
                {finalSmallCardsData.map((card, index) => (
                    <SmallCard key={index} {...card} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                {finalCardsData.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
        </>
    )
}