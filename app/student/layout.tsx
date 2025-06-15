import type { Metadata } from "next";
import "../globals.css";
import { AuthContextInitter, AuthContextProvider } from "@/lib/ctx-auth";
import { RefsContextProvider } from "@/lib/db/use-refs";
import Header from "@/components/student/header";

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
    <AuthContextProvider>
      <RefsContextProvider>
        <AuthContextInitter>
          <HTMLContent>{children}</HTMLContent>
        </AuthContextInitter>
      </RefsContextProvider>
    </AuthContextProvider>
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
    <html lang="en" className="overflow-hidden">
      <body>
        <div className="min-h-screen bg-gray-50 overflow-hidden">
          <div className="flex flex-col h-screen min-h-screen max-h-screen">
            <Header />
            <div className="flex-grow overflow-auto flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
