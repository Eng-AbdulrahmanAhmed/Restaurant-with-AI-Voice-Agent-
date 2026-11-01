'use client';

import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
    signInWithEmail,
    signInWithGoogle,
} from "@/lib/supabase/auth";

/* REDESIGN — same sign-in logic and fields, restyled with the reference
   look: Fraunces display heading, soft white card, cream inputs with
   orange focus, pill submit button. */
export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSignIn(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const data = await signInWithEmail(email, password);

            if (data.session) {
                router.push("/");
                router.refresh();
            }
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
    async function handleGoogleSignIn() {
        setError("");

        try {
            await signInWithGoogle();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Google sign-in failed. Please try again."
            );
        }
    }

    return (
        <div className="my-auto w-full max-w-md flex flex-col gap-7 py-6">
            <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5
                                 text-xs font-semibold uppercase tracking-[0.18em] text-orange-deep">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden="true" />
                    Fresh · Local · Delicious
                </span>
                <h1 className="font-display text-5xl font-black tracking-tight text-ink">
                    Welcome <span className="italic text-orange">back!</span>
                </h1>
                <p className="text-lg text-brown">Sign in to continue your delicious journey.</p>
            </div>

            <div className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(36,23,8,0.25)]">
            <form onSubmit={handleSignIn}>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-ink">
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
                            className="h-11 w-full rounded-xl border border-ink/10 bg-cream px-4 text-sm
                                       text-ink placeholder:text-brown/50 outline-none transition
                                       focus:border-orange focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

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
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="h-11 w-full rounded-xl border border-ink/10 bg-cream pl-4 pr-11 text-sm
                                           text-ink placeholder:text-brown/50 outline-none transition
                                           focus:border-orange focus:ring-2 focus:ring-orange/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/50
                                           transition-colors hover:text-ink"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Link
                        href="/auth/forgot"
                        className="text-xs font-semibold text-orange-deep underline underline-offset-2
                                   transition-colors hover:text-orange"
                    >
                        Forgot password?
                    </Link>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange
                               text-sm font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)]
                               transition-colors duration-300 hover:bg-orange-deep"
                >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ArrowRight size={18} />}
                </button>
                {error && (
                    <p className="mt-3 text-sm text-tomato">
                        {error}
                    </p>
                )}
            </form>


            <div className="mt-6 flex items-center gap-4" role="separator">
                <span className="h-px flex-1 bg-ink/10" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brown/60">
                    or continue with
                </span>
                <span className="h-px flex-1 bg-ink/10" />
            </div>

            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-full border
                           border-ink/10 bg-white text-sm font-semibold text-ink
                           transition-colors duration-300 hover:bg-cream
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
                <GoogleIcon />
                Continue with Google
            </button>
            </div>
            <p className="text-center text-sm text-brown">
                Don&apos;t have an account?{" "}
                <Link
                    href="/auth/register"
                    className="font-semibold text-orange-deep underline underline-offset-2
                               transition-colors hover:text-orange"
                >
                    Register
                </Link>

            </p>

        </div>
    );
}
