'use client';

/* ============================================================================
   STYLE MOD — rewritten to mirror the sign-in page's reference design.
   Same building blocks: badge / heading / subtext / white card / pill button /
   footer switch link. Undo copy of your previous version is at the bottom.
   ============================================================================ */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        // STYLE MOD — my-auto replaces the layout's items-center: with items-centre
        // the content overflows BOTH directions on short screens and you cannot
        // scroll back up; auto margins collapse to 0 instead, so it scrolls
        // normally. (undo: delete "my-auto")
        <div className="my-auto w-full max-w-md flex flex-col gap-6">
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-4 py-1.5
                                 text-xs font-bold uppercase tracking-widest text-burnt-orange">
                    Fresh • Local • Delicious
                </span>
                {/* STYLE MOD — h1 stepped down from text-5xl to text-4xl so the
                    five-field form fits without scrolling (undo: text-5xl) */}
                <h1 className="text-4xl font-bold tracking-tight text-charcoal">
                    Create your account!
                </h1>
                <p className="text-lg text-muted">
                    Fill in your details and start your delicious journey.
                </p>
            </div>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-2xl border border-line/20 bg-white p-5 shadow-sm"
            >
                {/* STYLE MOD — space-y-5 -> space-y-4 to save vertical room (undo: space-y-5) */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-charcoal">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Your name"
                            className="h-10 w-full rounded-xl border border-line/25 bg-cream px-4 text-sm
                                       text-charcoal placeholder:text-muted/70 outline-none transition
                                       focus:border-orange focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

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
                            className="h-10 w-full rounded-xl border border-line/25 bg-cream px-4 text-sm
                                       text-charcoal placeholder:text-muted/70 outline-none transition
                                       focus:border-orange focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

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
                                minLength={8}
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                className="h-10 w-full rounded-xl border border-line/25 bg-cream pl-4 pr-11 text-sm
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

                    <div className="space-y-2">
                        <label htmlFor="confirm" className="block text-sm font-semibold text-charcoal">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm"
                                name="confirm"
                                type={showConfirm ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                className="h-10 w-full rounded-xl border border-line/25 bg-cream pl-4 pr-11 text-sm
                                           text-charcoal placeholder:text-muted/70 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70
                                           transition-colors hover:text-charcoal"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* TODO STYLE MOD: drop the preventDefault once your register API exists. */}
                {/* STYLE MOD — button tightened mt-6/h-12 -> mt-5/h-11 so the form fits
                    on screen (undo: mt-6 h-12) */}
                <button
                    type="submit"
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange
                               text-sm font-semibold text-cream transition-colors duration-300
                               hover:bg-burnt-orange"
                >
                    Create account <ArrowRight size={18} />
                </button>
            </form>

            <p className="text-center text-sm text-muted">
                Already have an account?{" "}
                <Link
                    href="/auth/signin"
                    className="font-semibold text-burnt-orange underline underline-offset-2
                               transition-colors hover:text-orange"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}

/* ===================== PREVIOUS VERSION — undo copy =====================
export default function Register(){
    return(
        <div className="">
            this is register 
        </div>
    )
}
===================== end previous version ===================== */
