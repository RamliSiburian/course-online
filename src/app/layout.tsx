import './globals.css'
import './font.css'
import './style.scss'
import { lazy } from 'react'

const HomePage = lazy(() => import('@afx/views/main.layout'))

export const metadata = {
  title: 'Course Online'
}

export default async function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <HomePage />
      </body>
    </html>
  )
}
