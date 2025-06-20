import type { Metadata } from "next";
import "../globals.css";
import { AuthContextProvider } from "./authctx";
import { RefsContextProvider } from "@/lib/db/use-refs";
import { AppContextProvider } from "@/lib/ctx-app";
import Header from "@/components/hire/header";
import { Footer } from "@/components/shared/footer";

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
          <html lang="en" className="overflow-hidden">
            <body>
              <div className="h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-grow overflow-auto flex">{children}</div>
                <Footer />
              </div>
            </body>
          </html>
        </RefsContextProvider>
      </AuthContextProvider>
    </AppContextProvider>
  );
}
