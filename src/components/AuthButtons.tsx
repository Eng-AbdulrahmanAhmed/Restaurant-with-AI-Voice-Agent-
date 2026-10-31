
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthButtons() {
    const { user, loading, signOut } = useAuth();

    if (loading) {
        return <div className="flex justify-end gap-6" />;
    }

    if (!user) {
        return (
            <div className="flex items-center justify-end gap-6">
                <Link
                    href="/auth/register"
                    className="relative text-charcoal cursor-pointer
                        after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                        after:bg-orange after:transition-all after:duration-300
                        hover:after:w-full"
                >
                    Register
                </Link>

                <Link
                    href="/auth/signin"
                    className="flex h-[40px] items-center justify-center rounded-[10px] bg-orange px-5
                        text-sm font-semibold text-cream
                        shadow-[0_0_12px_-4px_rgba(249,115,22,0.3)]
                        hover:-translate-y-0.5 hover:bg-deep-burnt
                        hover:shadow-[0_0_24px_-4px_rgba(194,65,12,0.45)]
                        active:translate-y-0 active:shadow-[0_0_10px_-4px_rgba(154,52,18,0.3)]
                        motion-reduce:hover:translate-y-0
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange
                        transition-[background-color,box-shadow,transform] duration-300"
                >
                    Sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end gap-6">
            <Link
                href="/profile"
                className="relative text-charcoal cursor-pointer
                    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                    after:bg-orange after:transition-all after:duration-300
                    hover:after:w-full"
            >
                Profile
            </Link>

            <button
                onClick={() => signOut()}
                className="flex h-[40px] items-center justify-center rounded-[10px] bg-orange px-5
                    text-sm font-semibold text-cream transition-colors duration-300
                    hover:bg-deep-burnt"
            >
                Sign out
            </button>
        </div>
    );
}
