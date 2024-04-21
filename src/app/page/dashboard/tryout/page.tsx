import { lazy } from 'react';

const Ujian = lazy(
    () => import('@afx/views/dashboard/ujian/index.layout')
)

export default function RouteUjian() {
    return <Ujian />
}