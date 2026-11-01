
import { createClient } from "@/lib/supabase/client";

// 1. Sign in using email and password
export async function signInWithEmail(
    email: string,
    password: string
) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return data;
}

// 2. Register using email and password
export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string
) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;

    return data;
}

// 3. Sign in or register using Google
export async function signInWithGoogle() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                prompt: "select_account",
            },
        },
    });

    if (error) throw error;

    return data;
}

// 4. Sign out
export async function signOut() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut({
        scope: "local",
    });

    if (error) throw error;
}

// 5. Send password reset email
export async function resetPassword(email: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
            redirectTo: `${window.location.origin}/auth/update-password`,
        }
    );

    if (error) throw error;

    return data;
}

// 6. Update the user's password
export async function updatePassword(password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
        password,
    });

    if (error) throw error;

    return data;
}
