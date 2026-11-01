
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
            grid grid-cols-[1fr_auto_1fr]
            items-center
            h-[76px]
            px-6 lg:px-10
            bg-cream
        ">

            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        alt="BurgerHouse Logo"
                        className="mr-2"
                        src={burgerLogo}
                        width={48}
                        height={48}
                    />

                    <span className="text-lg font-semibold text-charcoal">
                        Burger
                        <span className="text-orange">House.</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="
                flex items-center justify-center
                rounded-full
                bg-white/70
                border border-[#EDE7DD]
                p-1.5
                shadow-sm
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
                                            ? "bg-orange text-cream shadow-[0_3px_10px_-3px_rgba(249,115,22,0.45)]"
                                            : "text-charcoal/65 hover:text-orange hover:bg-orange/5"
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
                        text-xs
                        bg-orange px-6
                        text-sm font-semibold text-cream
                        shadow-[0_0_12px_-4px_rgba(249,115,22,0.3)]
                        hover:-translate-y-0.5
                        hover:bg-deep-burnt
                        hover:shadow-[0_0_24px_-4px_rgba(194,65,12,0.45)]
                        active:translate-y-0
                        transition-all duration-300
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-orange
                    "
                >
                    + Add New Item
                </Link>

                <span className="h-7 w-px bg-[#E6E1D8]" />

                <button
                    type="button"
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="
                        w-10 h-10
                        flex items-center justify-center
                        rounded-full
                        bg-white
                        border border-[#E6E1D8]
                        text-stone-600
                        hover:text-red-600
                        hover:bg-red-50
                        hover:border-red-200
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
