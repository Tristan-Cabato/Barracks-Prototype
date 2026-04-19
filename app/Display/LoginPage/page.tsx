"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    // Note: Though the demos show sample passwords, there's no verification process, just put fuckall bro

    // Trinidad Part
    const searchParams = useSearchParams();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        setTimeout(() => {
            window.location.assign("/Display/LandingPage");
        }, 500);
    }

    return (
        <div className="w-full max-w-md rounded-lg bg-blue-900 p-8 shadow-lg">
            <h1 className="mb-6 text-center text-3xl font-bold text-white">Login</h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    autoComplete="username"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    autoComplete="current-password"
                />

                {error ? <p className="text-sm text-red-200">{error}</p> : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-950 px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="w-full rounded-lg bg-gray-950 px-4 py-2 mt-2 flex justify-center font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70">
                <Link href="/Display/LandingPage">
                    Proceed without Logging In
                </Link>
            </p>
            <p className="mt-4 text-center text-xs text-gray-200">
                Demo account: <span className="font-semibold">admin</span> / <span className="font-semibold">barracks123</span>
            </p>

        </div>
    );
}