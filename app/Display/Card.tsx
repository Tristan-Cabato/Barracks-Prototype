import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface CardProps {
    title: string
    totalLabel: string
    total: string
    recentLabel: string
    recent: string
    updated: string
    href: string
    icon: React.ReactNode
    color: string
}

interface SmallCardProps {
    title: string
    icon: React.ReactNode
    value: string
    color?: string
}

const getColorClass = (color: string | undefined) => {
    const colorMap: { [key: string]: string } = {
        'white': 'text-white',
        'yellow': 'text-yellow-500',
        'green': 'text-teal-400',
        'pink': 'text-pink-500',
        'blue': 'text-sky-400',
        'purple': 'text-purple-500'
    };
    return colorMap[color || 'white'] || 'text-white';
};

export default function Card({ title, totalLabel, total, recentLabel, recent, updated, href, icon, color }: CardProps) {
    const colorClass = getColorClass(color);
    const borderClass = colorClass.replace('text-', 'border-');
    let bgClass = colorClass.replace('text-', 'bg-');
    bgClass = bgClass + '/80';
    
    return (
        <Link href={href}>
            <div className="backdrop-blur-md bg-gray-900/70 border border-gray-600 rounded-2xl p-6 h-64 flex flex-col justify-between hover:bg-gray-800/80 hover:border-gray-500 transition-all cursor-pointer text-white">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        {/* Icon with square bg */}
                        <div className={`w-10 h-10 ${bgClass} ${borderClass} border rounded-lg flex items-center justify-center ${colorClass}`}>
                            {icon}
                        </div> {/* I'll figure out the BG thing later */}
                        {/* Title and Updated Time */}
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold">{title}</h2>
                            <p className="text-xs text-gray-400">{updated}</p>
                        </div>
                    </div>
                    <ArrowUpRight className="text-white w-5 h-5" />
                </div>
                
                {/* Middle Section */}
                <div className="flex flex-col">
                    <span className={`text-4xl font-bold ${colorClass}`}>{total}</span>
                    <span className="text-sm text-gray-400 mt-1">{totalLabel}</span>
                </div>
                
                {/* Bottom Section */}
                <div className="border-t border-gray-700 pt-3">
                    <p className="text-sm text-gray-300">
                        <span className="text-gray-500">{recentLabel} </span>
                        <span>{recent}</span>
                    </p>
                </div>
            </div>
        </Link>
    )
}

export function SmallCard({ title, icon, value, color }: SmallCardProps) {
    const getColorClass = (color: string | undefined) => {
        const colorMap: { [key: string]: string } = {
            'white': 'text-white',
            'yellow': 'text-yellow-500',
            'green': 'text-teal-400',
            'pink': 'text-pink-500',
            'blue': 'text-sky-400',
            'purple': 'text-purple-500'
        };
        return colorMap[color || 'white'] || 'text-white';
    };

    return (
        <div className="backdrop-blur-md bg-gray-900/70 border border-gray-600 rounded-xl p-4 flex flex-col justify-between hover:bg-gray-800/80 hover:border-gray-500 transition-all cursor-pointer text-white min-w-[250px] h-24">
            <div className="flex justify-between items-center">
                <h6 className="text-xs font-medium text-gray-300">{title}</h6>
                <div className={`${getColorClass(color)}`}>{icon}</div>
            </div>
            <h1 className={`text-xl font-bold ${getColorClass(color)}`}>{value}</h1>
        </div>
    )
}