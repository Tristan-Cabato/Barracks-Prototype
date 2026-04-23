import Card, { SmallCard } from "../Card";
import { User, Network, Package, TrendingUp } from 'lucide-react';

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
    cardsData = [
        { /* Customer */
            title: "Customer Records",
            totalLabel: "Total Records",
            total: "1,247",
            recentLabel: "Recent:",
            recent: "#6767 - Customer Real",
            updated: "Updated: Today, 2:15 PM",
            href: "/Records/CustomerRecords",
            icon: <User size={20} />,
            color: "yellow"
        },
        { /* Staff */
            title: "Staff Records",
            totalLabel: "Total Staff:",
            total: "42",
            recentLabel: "Recent:",
            recent: "#28 - Daniel Cruz (Barber)",
            updated: "Updated: Today, 11:30 AM",
            href: "/Records/StaffRecords",
            icon: <Network size={20} />,
            color: "green"
        }, 
        { /* Inventory */
            title: "Inventory",
            totalLabel: "Total Items:",
            total: "67",
            recentLabel: "Recent:",
            recent: "#3 - $19 Fortnite Card",
            updated: "Updated: Just now",
            href: "/Records/InventoryPage",
            icon: <Package size={20} />,
            color: "pink"
        }
    ],
    smallCardsData = [
        { title: "CUSTOMERS", icon: <User size={16} />, value: "1,247", color: "yellow" },
        { title: "STAFF", icon: <Network size={16} />, value: "42", color: "green" },
        { title: "PRODUCTS", icon: <Package size={16} />, value: "67", color: "pink" },
        { title: "LATEST ENTRY", icon: <Package size={16} />, value: "#6767 - Customer Real", color: "blue" },
        { title: "SYNC", icon: <TrendingUp size={16} />, value: "NOW", color: "purple" }
    ]
}: LandingPageProps) {
    return (
        <>
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
                {smallCardsData.map((card, index) => (
                    <SmallCard key={index} {...card} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                {cardsData.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
        </>
    )
}