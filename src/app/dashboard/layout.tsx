import { lazy } from 'react'

const BasePortal = lazy(
    () => import('@afx/views/base/index.layout')
)
export default function DashboardLayout({children}: any):React.JSX.Element{
    return (
        <div>
            <BasePortal>{children}</BasePortal>
        </div>
    )
}