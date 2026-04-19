import { User, Network, Package, UserRound } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="flex flex-row justify-between items-center p-4 bg-gray-800 sticky top-0 z-10">
            <div className="flex flex-row items-center gap-8">
                <Link href="/Display/LandingPage" aria-label="Go to Dashboard">
                    <img src="/barracks1200x700.png" alt="Logo" className="h-10 w-10 rounded-lg brightness-0 invert cursor-pointer" /> {/* Lowk can't make the invert trick work */}
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
                <input type="text" className="px-4 py-2 mx-4 rounded-lg bg-gray-700 text-white text-sm" placeholder="Search" />
                <UserRound style={{color: "white"}} />
            </div>
        </header>
    )
}
