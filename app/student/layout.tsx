import type { Metadata } from "next";
import "../globals.css";
import { AuthContextProvider } from "./authctx";
import { RefsContextProvider } from "@/lib/db/use-refs";

export const metadata: Metadata = {
  title: "BetterInternship",
  description: "Better Internships Start Here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <RefsContextProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </RefsContextProvider>
    </AuthContextProvider>
  );
}
