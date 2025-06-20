import type { Metadata } from "next";
import "../globals.css";
import { AuthContextInitter, AuthContextProvider } from "@/lib/ctx-auth";
import { RefsContextProvider } from "@/lib/db/use-refs";
import Header from "@/components/student/header";
import { AppContextProvider } from "@/lib/ctx-app";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "BetterInternship",
  description: "Better Internships Start Here.",
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
    <AppContextProvider>
      <AuthContextProvider>
        <RefsContextProvider>
          <AuthContextInitter>
            <HTMLContent>{children}</HTMLContent>
          </AuthContextInitter>
        </RefsContextProvider>
      </AuthContextProvider>
    </AppContextProvider>
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
  );
};

export default RootLayout;
