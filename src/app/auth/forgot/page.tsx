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
import { createClient } from "@/lib/supabase/client";

export default function Forgot() {
    const [sent, setSent] = useState(false);
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleReset(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setLoading(true)

        const {error: resetError} = await supabase.auth.resetPasswordForEmail(email , {
            redirectTo: `${window.location.origin}/auth/update-password`,
        })
        if (resetError) {
            setError(resetError.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    }

    return (
        <div className="my-auto w-full max-w-md flex flex-col gap-6">
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5
                                 text-xs font-semibold uppercase tracking-[0.18em] text-orange-deep">
                    Fresh • Local • Delicious
                </span>
                <h1 className="font-display text-4xl font-black tracking-tight text-ink">
                    Reset your password
                </h1>
                <p className="text-lg text-brown">
                    Enter the email on your account and we&apos;ll send you a reset link.
                </p>
            </div>

            {sent ? (
                /* Confirmation state — replaces the submit card once sent. */
                <div className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(36,23,8,0.25)]">
                    <div className="flex flex-col items-center text-center">
                        <span
                            className="flex h-11 w-11 items-center justify-center rounded-full
                                       bg-orange/10 text-orange-deep"
                            aria-hidden="true"
                        >
                            <MailCheck size={20} />
                        </span>
                        <h2 className="mt-3 text-sm font-semibold text-ink">Check your inbox</h2>
                        <p className="text-sm text-brown">
                            A reset link is on its way — it opens a page to set your new
                            password. It can take a minute or two to arrive.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="mt-5 flex h-10 w-full items-center justify-center rounded-full
                                       border border-line/30 text-sm font-semibold text-ink
                                       transition-colors hover:bg-cream"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleReset}
                    className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(36,23,8,0.25)]"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-ink"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-sm
                                           text-ink placeholder:text-brown/50 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)]
                                   text-sm font-semibold text-cream transition-colors duration-300
                                   hover:bg-orange-deep"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                    {error && (
                        <p className="mt-3 text-sm text-tomato" role="alert">
                            {error}
                        </p>
                    )}
                </form>
            )}

            <p className="text-center text-sm text-brown">
                Remembered it?{" "}
                <Link
                    href="/auth/signin"
                    className="font-semibold text-orange-deep underline underline-offset-2
                               transition-colors hover:text-orange"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
