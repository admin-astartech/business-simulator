import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import CronInitializer from '@/components/CronInitializer'
import LocalCronManager from '@/components/LocalCronManager'
import AutoResponseNotificationInitializer from '@/components/AutoResponseNotificationInitializer'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business Simulator',
  description: 'A simple Next.js app with Tailwind CSS',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <CronInitializer />
        <LocalCronManager />
        <AutoResponseNotificationInitializer />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-50 pl-[280px]">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
