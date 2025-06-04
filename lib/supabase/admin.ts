import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";
import { createFetch } from "@/lib/supabase/cache";

interface Props {
  url?: string;
  key?: string;
}

export const supabaseAdmin = async (data?: Props) => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? data?.url!,
    process.env.SUPABASE_ADMIN_KEY ?? data?.key!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
      global: {
        fetch: createFetch({
          cache: "no-store",
        }),
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ADMIN_KEY ?? data?.key!}`,
        },
      },
    },
  );
};
