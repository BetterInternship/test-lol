import type { Metadata } from "next";
import "../globals.css";
import { AuthContextProvider } from "@/lib/ctx-auth";
import { RefsContextProvider } from "@/lib/db/use-refs";
import Header from "@/components/features/student/header";
import { AppContextProvider } from "@/lib/ctx-app";
import { Footer } from "@/components/shared/footer";
import { MoaContextProvider } from "@/lib/db/use-moa";
import { PostHogProvider } from "../posthog-provider";
import TanstackProvider from "../tanstack-provider";

export const metadata: Metadata = {
  title: "BetterInternship",
  description: "Better Internships Start Here.",
  icons: {
    icon: "/BetterInternshipLogo.ico",
  },
};

/**
 * A template for all pages on the site.
 *
 * @component
 */
export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <RefsContextProvider>
      <MoaContextProvider>
        <PostHogProvider>
          <HTMLContent>{children}</HTMLContent>
        </PostHogProvider>
      </MoaContextProvider>
    </RefsContextProvider>
  );
};

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
  return (
    <TanstackProvider>
      <AppContextProvider>
        <AuthContextProvider>
          <html lang="en">
            <body>
              <div className="h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-grow overflow-auto flex flex-col">
                  {children}
                </div>
                <Footer />
              </div>
            </body>
          </html>
        </AuthContextProvider>
      </AppContextProvider>
    </TanstackProvider>
  );
};

export default RootLayout;
