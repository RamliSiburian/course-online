'use client'
import './globals.css'
import './font.css'
import './style.scss'
import { lazy } from 'react'
import { SessionProvider } from 'next-auth/react'

const ValidationView = lazy(
  () => import('@afx/views/auth/validation/index.layout')
)

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <ValidationView>{children}</ValidationView>
        </body>
      </html>
    </SessionProvider>
  )
}
