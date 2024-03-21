import { lazy } from 'react'

const Bimbel = lazy(
    () => import('@afx/views/dashboard/bimbel/index.layout')
)
export default function RouteDashboard(): React.JSX.Element {
    return <Bimbel />
}