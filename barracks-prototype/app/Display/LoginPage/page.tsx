import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center p-20 rounded-lg bg-blue-900 gap-4">
            <h1 className="text-4xl font-bold text-white">Login</h1>
            <input type="text" placeholder="Username" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="password" placeholder="Password" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <Link href="/Display/LandingPage" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go to LandingPage
            </Link>
        </div>
    );
}