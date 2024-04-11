'use client'
import { lazy, useLayoutEffect } from 'react'

const Dashboard = lazy(
    () => import('@afx/views/dashboard/index.layout')
)
export default function DashboardLayout({ children }: any): React.JSX.Element {

    return (
        <div>
            <Dashboard>{children}</Dashboard>
        </div>
    )
}