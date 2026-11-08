// ===========================================================================
// STEP 1 — AUTHORIZATION: ROLE HELPERS  (commented out — learning baseline)
// ---------------------------------------------------------------------------
// Server-side "who is this user?" helpers for the 2-role scheme
// (admin / customer) backed by the public.profiles table.
//
// Disabled on purpose so you can re-implement the flow step by step.
// To restore: remove the block-comment markers around the code below.
// ===========================================================================

/*
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "customer";

export async function getCurrentRole(): Promise<AppRole | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return null;

  const role = (data as { role?: string | null } | null)?.role;
  return role === "admin" ? "admin" : "customer";
}

export async function isAdmin(): Promise<boolean> {
  return (await getCurrentRole()) === "admin";
}
*/

export {};

// Import the existing Supabase server createClient.
// Define a TypeScript Role type containing our two current roles.
// Create an asynchronous function named getCurrentUserRole.

// Specify that it returns either a valid Role or null.

// Initialize the Supabase server client.

// Ask Supabase Auth for the currently authenticated user.

// If authentication fails or there is no user, return null.

// Query profiles using the authenticated user's ID. Retrieve only role.

// If the query fails or no profile exists, return null.

// Validate that the returned role is one of our two allowed roles.
// Return the validated role.
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "customer"

export async function getCurrentUserRole(): Promise<Role | null> {
  const supabase = await createClient()
  const {data: user , error: authErr } = await supabase.auth.getClaims()
  if(authErr) return null
  const claims = user?.claims;

  if (!claims?.sub) return null;

  const sub = claims.sub;
  if(!sub) return null
  
  const { data, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", sub)
  .maybeSingle();
  if (error) {
    console.log(error)
    return null
  }
  if(!data) return null
  if (data.role === "admin" ||data.role ===  "customer") {
    return data.role
  }
  else{
    return null
  }

}