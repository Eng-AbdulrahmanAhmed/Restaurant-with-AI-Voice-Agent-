'use client';

/* ============================================================================
   STYLE MOD — new page at /auth/forgot, and the "Forgot password?" link on the
   sign-in card now points here instead of "#".

   It reuses the register/sign-in block set exactly, so it inherits the auth
   layout (logo, back-to-home, doodle pattern) for free — deliberately no
   duplicated header here, matching your earlier decision to hoist that.

   Everything on display is UI only. The submit flips a local `sent` flag and
   shows a confirmation card instead of a dead success page; swap that for your
   real reset request once the API exists. Undo: this file didn't exist before
   today, so deleting it restores the previous 404.
   ============================================================================ */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";

export default function Forgot() {
    const [sent, setSent] = useState(false);

    return (
        <div className="my-auto w-full max-w-md flex flex-col gap-6">
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-4 py-1.5
                                 text-xs font-bold uppercase tracking-widest text-burnt-orange">
                    Fresh • Local • Delicious
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-charcoal">
                    Reset your password
                </h1>
                <p className="text-lg text-muted">
                    Enter the email on your account and we&apos;ll send you a reset link.
                </p>
            </div>

            {sent ? (
                /* Confirmation state — replaces the submit card once sent. */
                <div className="rounded-2xl border border-line/20 bg-white p-5 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <span
                            className="flex h-11 w-11 items-center justify-center rounded-full
                                       bg-orange/15 text-burnt-orange"
                            aria-hidden="true"
                        >
                            <MailCheck size={20} />
                        </span>
                        <h2 className="mt-3 text-sm font-semibold text-charcoal">Check your inbox</h2>
                        <p className="text-sm text-muted">
                            A reset link is on its way. It can take a minute or two to arrive.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="mt-5 flex h-10 w-full items-center justify-center rounded-full
                                       border border-line/30 text-sm font-semibold text-charcoal
                                       transition-colors hover:bg-cream"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSent(true);
                    }}
                    className="rounded-2xl border border-line/20 bg-white p-5 shadow-sm"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-charcoal"
                            >
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
                    </div>

                    <button
                        type="submit"
                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange
                                   text-sm font-semibold text-cream transition-colors duration-300
                                   hover:bg-burnt-orange"
                    >
                        Send reset link <ArrowRight size={18} />
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-muted">
                Remembered it?{" "}
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
