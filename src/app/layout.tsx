import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from "../components/navbar";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wallet',
  description: 'Secure your future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <br />
        <br />
        {children}
      </body>
    </html>
  )
}
