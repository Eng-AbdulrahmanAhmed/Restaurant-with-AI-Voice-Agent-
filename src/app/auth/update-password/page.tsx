'use client';

/* ============================================================================
   STYLE MOD — new page at /auth/update-password (dashboard Redirect URLs must
   include this path so Supabase's emailed recovery link actually lands here).

   Styling only by request: no auth call, no session check. When you wire it up,
   getUser()/updateUser({ password }) belongs exactly where this file's other
   STYLE MOD comments say. Until then the submit just re-renders.

   Reuses the register/forgot block set: badge / h1 / subtext / white card /
   pill submit / footer switch link, so it also inherits the auth layout
   (logo, back-to-home, doodle pattern) for free — no duplicated header here,
   matching your earlier decision to hoist that.

   Undo: this file didn't exist before today, so deleting it restores the 404.
   ============================================================================ */

import Link from "next/link";
import { useState, useEffect , useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionChecked, setSessionChecked] = useState(false);
    const [validSession, setValidSession] = useState(false);
    
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" && session?.user) {
                setValidSession(true);
                setError("");
                setSessionChecked(true);
            }

            if (event === "INITIAL_SESSION") {
                setSessionChecked(true);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    async function handleUpdatePassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!sessionChecked || !validSession) {
            setError(
                "Your password reset session is invalid or expired. Please request a new reset link."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            router.push("/auth/signin");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        // STYLE MOD — my-auto (not the layout's items-center) so short screens scroll
        // naturally instead of clipping the form at both ends. (undo: delete "my-auto")
        <div className="my-auto w-full max-w-md flex flex-col gap-6">
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5
                                 text-xs font-semibold uppercase tracking-[0.18em] text-orange-deep">
                    Fresh • Local • Delicious
                </span>
                <h1 className="font-display text-4xl font-black tracking-tight text-ink">
                    Set a new password
                </h1>
                <p className="text-lg text-brown">
                    Choose a new password for your account.
                </p>
            </div>

            {/* STYLE MOD — card. preventDefault only; when real auth lands, call
                supabase.auth.updateUser({ password }) here and the styled slot above
                already exists. (undo: swap onSubmit for nothing) */}
            <form 
                onSubmit={handleUpdatePassword}
                className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(36,23,8,0.25)]"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-ink">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="new-password"
                                placeholder="At least 6 characters"
                                className="h-10 w-full rounded-xl border border-ink/10 bg-cream pl-4 pr-11 text-sm
                                           text-ink placeholder:text-brown/50 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/70
                                           transition-colors hover:text-ink"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm" className="block text-sm font-semibold text-ink">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm"
                                name="confirm"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                className="h-10 w-full rounded-xl border border-ink/10 bg-cream pl-4 pr-11 text-sm
                                           text-ink placeholder:text-brown/50 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/70
                                           transition-colors hover:text-ink"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* STYLE MOD — error slot, deliberately empty for now. It is hidden here
                    (no text = no visible box) but pre-styled to match the auth pages' red.
                    Drop authError.message into it once updateUser() is wired.
                    (undo: delete this whole block) */}
                {error && (
                    <div
                        className="mt-3 text-sm text-tomato"
                        role="alert"
                    >
                        {error}
                    </div>
                )}
                
                {!sessionChecked && (
                    <p className="mt-3 text-sm text-brown" role="status">
                        Checking your password reset link...
                    </p>
                )}

                {sessionChecked && !validSession && (
                    <div className="mt-3 text-sm text-tomato" role="alert">
                        This password reset link is invalid or has expired.
                        Please request a new password reset link.
                        <Link
                            href="/auth/forgot"
                            className="ml-1 font-semibold underline underline-offset-2"
                        >
                            Request a new link
                        </Link>
                    </div>
                )}


                {/* STYLE MOD — submit pill, same rhythm as the other auth cards
                    (undo: mt-5 h-11 -> mt-6 h-12 to match the original signin) */}
                <button
                    type="submit"
                    disabled={!sessionChecked || !validSession || loading}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)]
                               text-sm font-semibold text-cream transition-colors duration-300
                               hover:bg-orange-deep"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>

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
