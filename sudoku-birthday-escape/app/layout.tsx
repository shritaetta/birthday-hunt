import { Analytics } from '@vercel/analytics/next'
import { Nunito, Quicksand } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' })

export const metadata: Metadata = {
  title: 'A Little Number Magic | Birthday Escape Room',
  description: 'Solve a sweet little Sudoku puzzle to unlock the next birthday escape room clue.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbe9ee',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${nunito.variable} ${quicksand.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
