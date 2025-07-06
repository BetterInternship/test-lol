import type { Metadata } from "next";
import "../globals.css";
import { AuthContextProvider } from "./authctx";
import { RefsContextProvider } from "@/lib/db/use-refs";
import { AppContextProvider } from "@/lib/ctx-app";
import Header from "@/components/features/hire/header";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/shared/footer";
import { MoaContextProvider } from "@/lib/db/use-moa";
import { PostHogProvider } from "../posthog-provider";
import TanstackProvider from "../tanstack-provider";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Recruiter Dashboard - BetterInternship",
  description: "Manage applications and candidates",
};

/**
 * Hire root layout
 *
 * @component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RefsContextProvider>
      <MoaContextProvider>
        <HTMLContent>{children}</HTMLContent>
      </MoaContextProvider>
    </RefsContextProvider>
  );
}

/**
 * I don't like overly-nested components lol.
 *
 * @component
 */
const HTMLContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  "use client";

  return (
    <TanstackProvider>
      <AppContextProvider>
        <AuthContextProvider>
          <TooltipProvider>
            <Sonner />
            <PostHogProvider>
              <html lang="en" className="overflow-hidden">
                <Head>
                  <meta name="viewport" content="width=1024, initial-scale=1, maximum-scale=1, user-scalable=no"/>
                </Head>
                <body className="w-[1024px] overflow-x-auto">
                  <div className="h-screen bg-gray-50 overflow-x-auto flex flex-col">
                    <Header />
                    <div className="flex-grow overflow-auto flex">
                      {children}
                    </div>
                    <Footer />
                  </div>
                </body>
              </html>
            </PostHogProvider>
          </TooltipProvider>
        </AuthContextProvider>
      </AppContextProvider>
    </TanstackProvider>
  );
};
