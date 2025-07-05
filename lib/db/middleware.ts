import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const path = request.nextURL.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && path.startsWith("/dashboard/overview")) {
    const url = request.nextURL.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && path === "/") {
    const url = request.nextURL.clone();
    url.pathname = "/dashboard/overview";
    return NextResponse.redirect(url);
  }

  if (user && path === "/dashboard") {
    const url = request.nextURL.clone();
    url.pathname = "/dashboard/overview";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
