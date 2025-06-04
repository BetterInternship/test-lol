import type { Metadata } from 'next'
import '../globals.css'
import { AuthContextProvider } from './authctx'

export const metadata: Metadata = {
  title: 'Better Internship',
  description: 'The Best College Careers Website for Students.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthContextProvider>
  )
}
