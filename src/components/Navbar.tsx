import {getCurrentUserRole} from "@/lib/auth"
import Link from "next/link";
import Image from "next/image";
import burgerLogo from "@/assets/logo-no-background.png";
import AuthButtons from "@/components/AuthButtons";

// ---------------------------------------------------------------------------
// STEP 5 — ADMIN-ONLY DASHBOARD LINK (commented out — learning baseline)
// ---------------------------------------------------------------------------
// The working version made this a client component that read the role:
//
//   "use client";
//   import { useAuth } from "@/context/AuthContext";
//   const baseLinks = [ Home, About, Menu ];
//   export default function Navbar() {
//     const { role } = useAuth();
//     const links = role === "admin"
//       ? [...baseLinks, { label: "Dashboard", href: "/dashboard" }]
//       : baseLinks;
//     ... links.map(...) ...
//   }
//
// To restore: recreate that version when we re-implement Step 5.
// ---------------------------------------------------------------------------

/* REDESIGN — sticky cream header with backdrop blur, Fraunces wordmark
   and the reference nav-link hover (orange underline sweep). Same links,
   same AuthButtons — styling only. */
export default async function Navbar() {
  const role = await getCurrentUserRole()
  return (
    <header className="sticky top-0 z-40 bg-cream/90 shadow-[0_1px_0_0_rgba(36,23,8,0.04)] backdrop-blur-md">
      <div className="mx-auto grid h-[72px] max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 lg:px-10">
        <div className="flex">
          <Link href={"/"} className="flex items-center">
            <Image
              alt={"BurgerHouse logo"}
              className="mr-2"
              src={burgerLogo}
              width={40}
              height={40}
            />
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Burger<span className="text-orange">House.</span>
            </span>
          </Link>
        </div>

        <nav className="flex justify-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm font-medium text-ink/80">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Menu", href: "/menu" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="relative cursor-pointer transition-colors hover:text-orange
                             after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                             after:bg-orange after:transition-all after:duration-300
                             hover:after:w-full"
                >
                  {label}
                </Link>
              </li>
            ))}
            {
              role === "admin" &&
              <li>
                <Link
                  href={"/dashboard"}
                  className="relative cursor-pointer transition-colors hover:text-orange
                  after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                  after:bg-orange after:transition-all after:duration-300
                  hover:after:w-full"
                  >
                  Dashboard
                </Link>
              </li>
            }
          </ul>
        </nav>

        <AuthButtons />
      </div>
    </header>
  );
}
