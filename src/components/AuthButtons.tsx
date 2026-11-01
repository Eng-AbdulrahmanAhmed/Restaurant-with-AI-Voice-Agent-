"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* REDESIGN — reference-style pill actions: ghost text link + solid ink
   pill that flips to orange on hover (same links, same logic). */
export default function AuthButtons() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex justify-end gap-6" />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-end gap-5">
        <Link
          href="/auth/register"
          className="relative hidden cursor-pointer text-sm font-medium text-ink/80 transition-colors hover:text-orange
                     after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                     after:bg-orange after:transition-all after:duration-300
                     hover:after:w-full sm:block"
        >
          Register
        </Link>

        <Link
          href="/auth/signin"
          className="flex h-11 items-center justify-center rounded-full bg-ink px-5
              text-sm font-semibold text-cream
              shadow-[0_10px_24px_-10px_rgba(36,23,8,0.5)]
              hover:-translate-y-0.5 hover:bg-orange
              hover:shadow-[0_14px_28px_-10px_rgba(242,105,13,0.6)]
              active:translate-y-0
              motion-reduce:hover:translate-y-0
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange
              transition-all duration-300"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-5">
      <Link
        href="/profile"
        className="relative hidden cursor-pointer text-sm font-medium text-ink/80 transition-colors hover:text-orange
                   after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                   after:bg-orange after:transition-all after:duration-300
                   hover:after:w-full sm:block"
      >
        Profile
      </Link>

      <button
        onClick={() => signOut()}
        className="flex h-11 items-center justify-center rounded-full bg-ink px-5
            text-sm font-semibold text-cream transition-all duration-300
            hover:-translate-y-0.5 hover:bg-orange motion-reduce:hover:translate-y-0"
      >
        Sign out
      </button>
    </div>
  );
}
