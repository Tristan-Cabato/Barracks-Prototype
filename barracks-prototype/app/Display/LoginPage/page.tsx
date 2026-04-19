"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import usersData from "@/app/data/users.json";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const user = usersData.find(
            (u: any) => u.username === username && u.password === password
        );

        if (!user) {
            setError("Invalid username or password");
            setIsSubmitting(false);
            return;
        }

        // Save user to localStorage
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                username: user.username,
                role: user.role,
                name: user.name,
                staffId: user.staffId
            })
        );

        // Redirect to landing page
        window.location.href = "/Display/LandingPage";
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                />

                {error && <p className="text-sm text-red-200">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-950 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="w-full rounded-lg bg-gray-950 px-4 py-2 mt-2 flex justify-center text-white">
                <Link href="/Display/LandingPage">Proceed without Logging In</Link>
            </p>

            <p className="mt-4 text-center text-xs text-gray-200">
                Demo: <b>admin</b> / <b>barracks123</b>
            </p>
        </div>
    );
}