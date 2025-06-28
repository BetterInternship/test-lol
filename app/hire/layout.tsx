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

export const metadata: Metadata = {
  title: "Recruiter Dashboard - BetterInternship",
  description: "Manage applications and candidates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppContextProvider>
      <AuthContextProvider>
        <RefsContextProvider>
          <MoaContextProvider>
            <TooltipProvider>
              <Sonner />
              <PostHogProvider>
                <html lang="en" className="overflow-hidden">
                  <body>
                    <div className="h-screen bg-gray-50 flex flex-col">
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
          </MoaContextProvider>
        </RefsContextProvider>
      </AuthContextProvider>
    </AppContextProvider>
  );
}
