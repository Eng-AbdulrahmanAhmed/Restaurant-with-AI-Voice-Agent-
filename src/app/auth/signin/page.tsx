'use client';

/* ============================================================================
   STYLE MOD — rewritten to match the reference design.
   Every change is tagged "STYLE MOD". Your previous version is preserved
   verbatim in the comment block at the bottom of this file.

   1. 'use client' so the password eye can toggle (needs React state)
   2. max-w-md column: badge / heading / subtext / card / footer, left-aligned
   3. white card + orange-tinted inputs + focus rings
   4. password show/hide eye button
   5. full-width orange pill submit with arrow
   6. "Don't have an account? Register" footer
   ============================================================================ */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        // STYLE MOD #2 — the column that holds the inputs. max-w-md caps the card
        // so it stays a neat block; the auth layout's flex-1 wrapper keeps it
        // centred on the page. (undo: restore the block at the bottom)
        <div className="my-auto w-full max-w-md flex flex-col gap-7">
            {/* STYLE MOD #2 — badge + heading + subtext */}
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-4 py-1.5
                                 text-xs font-bold uppercase tracking-widest text-burnt-orange">
                    Fresh • Local • Delicious
                </span>
                <h1 className="text-5xl font-bold tracking-tight text-charcoal">Welcome back!</h1>
                <p className="text-lg text-muted">Sign in to continue your delicious journey.</p>
            </div>

            {/* STYLE MOD #3 — white card holding the inputs */}
            <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-2xl border border-line/20 bg-white p-6 shadow-sm"
            >
                <div className="space-y-5">
                    {/* STYLE MOD #3 — field + input */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-charcoal">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="h-11 w-full rounded-xl border border-line/25 bg-cream px-4 text-sm
                                       text-charcoal placeholder:text-muted/70 outline-none transition
                                       focus:border-orange focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

                    {/* STYLE MOD #3 + #4 — password field with show/hide eye */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-charcoal">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="h-11 w-full rounded-xl border border-line/25 bg-cream pl-4 pr-11 text-sm
                                           text-charcoal placeholder:text-muted/70 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70
                                           transition-colors hover:text-charcoal"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* STYLE MOD #3 — forgot password */}
                    <Link
                        href="/auth/forgot"
                        className="text-xs font-semibold text-burnt-orange underline underline-offset-2
                                   transition-colors hover:text-orange"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* STYLE MOD #5 — full-width orange pill submit.
                    TODO STYLE MOD: drop the preventDefault once your sign-in API exists. */}
                <button
                    type="submit"
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange
                               text-sm font-semibold text-cream transition-colors duration-300
                               hover:bg-burnt-orange"
                >
                    Sign in <ArrowRight size={18} />
                </button>
            </form>

            {/* STYLE MOD #6 — footer switch link */}
            <p className="text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link
                    href="/auth/register"
                    className="font-semibold text-burnt-orange underline underline-offset-2
                               transition-colors hover:text-orange"
                >
                    Register
                </Link>
            </p>
        </div>
    );
}

/* ===================== PREVIOUS VERSION — undo copy =====================
export default function Signin(){
    return(
        <div className="flex justify-center items-center">
            <h1>Welcome Back!</h1>
            <p className="">Sign in to continue you'r delicious journey</p>
            <div className="bg-white"></div>
        </div>
    )
}
===================== end previous version ===================== */
