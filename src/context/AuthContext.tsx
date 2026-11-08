"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// STEP 4 — CLIENT ROLE (commented out — learning baseline)
// Adds a "role" value ("admin" | "customer" | null) so UI can hide admin
// links. To restore: uncomment the role field, the role state, the lookup
// effect, and the provider value below.
// ---------------------------------------------------------------------------

type AuthContextType = {
    user: User | null;
    // role: "admin" | "customer" | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const supabase = useMemo(() => createClient(), []);

    const [user, setUser] = useState<User | null>(null);
    // const [role, setRole] = useState<"admin" | "customer" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    /*
    useEffect(() => {
        if (!user) {
            setRole(null);
            return;
        }

        let cancelled = false;

        supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
                if (cancelled) return;
                setRole(data?.role === "admin" ? "admin" : "customer");
            });

        return () => {
            cancelled = true;
        };
    }, [user, supabase]);
    */

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}
