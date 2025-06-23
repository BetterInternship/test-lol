"use client";

import { useAuthContext } from "./authctx";

export default function HomePage() {
  const { redirect_if_not_logged_in, redirect_if_logged_in } = useAuthContext();

  redirect_if_not_logged_in();
  redirect_if_logged_in();

  // Show a loading state while redirecting
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
