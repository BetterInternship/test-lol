import type { Metadata } from "next";
import "../globals.css";
import { AuthContextProvider } from "./authctx";
import { RefsContextProvider } from "@/lib/db/use-refs";
import { AppContextProvider } from "@/lib/ctx-app";

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
          <html lang="en">
            <body>{children}</body>
          </html>
        </RefsContextProvider>
      </AuthContextProvider>
    </AppContextProvider>
  );
}
