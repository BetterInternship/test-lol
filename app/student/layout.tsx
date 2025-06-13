import type { Metadata } from 'next'
import '../globals.css'
import { AuthContextProvider } from './authctx'
import { MockModeToggle } from '@/components/mock-mode-toggle'

export const metadata: Metadata = {
  title: 'BetterInternship',
  description: 'Better Internships Start Here.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body>
          {children}
          <MockModeToggle />
        </body>
      </html>
    </AuthContextProvider>
  )
}
