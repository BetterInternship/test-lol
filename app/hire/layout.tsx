import type { Metadata } from "next"
import "../globals.css"
import { AuthContextProvider } from "./authctx"

export const metadata: Metadata = {
  title: "Recruiter Dashboard - BetterInternship",
  description: "Manage applications and candidates",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthContextProvider>
  )
}