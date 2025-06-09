import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/db/old-types";
import { createFetch } from "@/lib/db/cache";

export async function supabaseServer() {
  const cookieStore = await cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
      global: {
        fetch: createFetch({
          cache: "no-store",
        }),
      },
    }
  );
}
