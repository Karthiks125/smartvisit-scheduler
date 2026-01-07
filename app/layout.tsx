import './globals.css'
import { SessionProvider } from './providers'

export const metadata = {
  title: 'SmartVisit Scheduler',
  description: 'AI-powered appointment orchestration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
