'use client';

import Link from "next/link";
import { useState , type FormEvent} from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { useRouter } from "next/navigation";
import {
    signUpWithEmail,
    signInWithGoogle
} from "@/lib/supabase/auth";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await signUpWithEmail(email, password, name);

            if (data.session) {
                router.push("/");
                router.refresh();
            } else {
                setError(
                    "Account created, but no session was returned. Check your email confirmation settings."
                );
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

        <div className="my-auto w-full max-w-md flex flex-col gap-6 mt-2">
            <div className="space-y-2">
                <h1 className="font-display text-4xl font-black tracking-tight text-ink">
                    Create your account!
                </h1>
                <p className="text-md text-brown">
                    Fill in your details and start your delicious journey.
                </p>
            </div>


            <div className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(36,23,8,0.25)]">
            <form onSubmit={handleRegister}>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-ink">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Your name"
                            className="h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-sm
                                       text-ink placeholder:text-brown/50 outline-none transition
                                       focus:border-orange focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

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
                            className="h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-sm
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

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)]
                            text-sm font-semibold text-cream transition-colors duration-300
                            hover:bg-orange-deep disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight size={18} />}
                </button>
                {error && (
                    <p className="mt-3 text-sm text-tomato">
                        {error}
                    </p>
                )}
                
            </form>

            <div className="mt-5 flex items-center gap-4" role="separator">
                <span className="h-px flex-1 bg-ink/10" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brown/70">
                    or continue with
                </span>
                <span className="h-px flex-1 bg-ink/10" />
            </div>
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-full border
                           border-ink/10 bg-white text-sm font-semibold text-ink
                           transition-colors duration-300 hover:bg-cream
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
                <GoogleIcon />
                Continue with Google
            </button>
            </div>

            <p className="text-center text-sm text-brown">
                Already have an account?{" "}
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