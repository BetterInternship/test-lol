import type { Metadata } from "next"
import "../globals.css"

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}