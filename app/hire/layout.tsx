import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Recruiter Dashboard - Intern's Launchpad",
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