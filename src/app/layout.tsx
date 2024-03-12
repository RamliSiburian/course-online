import './globals.css'
import './font.css'
import './style.scss'
import { lazy } from 'react'

const ValidationView = lazy(
  () => import('@afx/views/auth/validation/index.layout')
)

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
        <ValidationView>{children}</ValidationView>
      </body>
    </html>
  )
}
