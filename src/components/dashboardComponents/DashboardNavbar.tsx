'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    ShoppingBag,
    ChartNoAxesCombined,
    LogOut
} from "lucide-react";

import burgerLogo from "@/assets/logo-no-background.png";

/* REDESIGN — reference styling: sticky cream bar with blur, Fraunces
   wordmark, segmented pill nav (active = ink), orange pill CTA.
   Same links, same active-route logic, same sign-out button. */

const navLinks = [
    { label: "Menu Items", href: "/dashboard", icon: LayoutGrid },
    { label: "Orders", href: "/dashboard/live-orders", icon: ShoppingBag },
    { label: "Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
];

export default function DashboardNavbar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard" || pathname.startsWith("/dashboard/items");
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header className="
            sticky top-0 z-40
            grid grid-cols-[1fr_auto_1fr]
            items-center
            h-[76px]
            px-6 lg:px-10
            bg-cream/90
            border-b border-ink/[0.06]
            backdrop-blur-md
        ">

            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        alt="BurgerHouse Logo"
                        className="mr-2"
                        src={burgerLogo}
                        width={40}
                        height={40}
                    />

                    <span className="font-display text-xl font-bold tracking-tight text-ink">
                        Burger
                        <span className="text-orange">House.</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="
                flex items-center justify-center
                rounded-full
                bg-white
                border border-ink/10
                p-1.5
                shadow-[0_10px_24px_-18px_rgba(36,23,8,0.35)]
            ">
                <ul className="flex items-center gap-1">
                    {navLinks.map(({ label, href, icon: Icon }) => (
                        <li key={label}>
                            <Link
                                href={href}
                                aria-current={isActive(href) ? "page" : undefined}
                                className={`
                                    flex items-center justify-center
                                    gap-2
                                    px-5 py-2.5
                                    rounded-full
                                    text-xs font-semibold
                                    whitespace-nowrap
                                    transition-all duration-300 ease-out
                                    ${
                                        isActive(href)
                                            ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                                            : "text-ink/65 hover:text-orange hover:bg-orange/10"
                                    }
                                `}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={2}
                                />
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-5">

                <Link
                    href="/dashboard/new"
                    className="
                        flex h-[42px] items-center justify-center
                        rounded-full
                        bg-orange px-6
                        text-sm font-semibold text-cream
                        shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)]
                        hover:-translate-y-0.5
                        hover:bg-orange-deep
                        hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)]
                        active:translate-y-0
                        transition-all duration-300
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-orange
                    "
                >
                    + Add New Item
                </Link>

                <span className="h-7 w-px bg-ink/10" />

                <button
                    type="button"
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="
                        w-10 h-10
                        flex items-center justify-center
                        rounded-full
                        bg-white
                        border border-ink/10
                        text-brown
                        hover:text-tomato
                        hover:bg-tomato/10
                        hover:border-tomato/30
                        transition-all duration-200
                        shadow-sm
                    "
                >
                    <LogOut size={19} strokeWidth={2} />
                </button>

            </div>
        </header>
    );
}
