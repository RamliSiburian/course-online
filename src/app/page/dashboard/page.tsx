'use client'
import { lazy } from 'react'

const MainDashboard = lazy(
    () => import('@afx/views/dashboard/index.layout')
)
export default function RouteDashboard(): React.JSX.Element {
    return (
        <>dashboard</>
    )
}