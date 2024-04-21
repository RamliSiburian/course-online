import { lazy } from 'react';

const Schedule = lazy(
    () => import('@afx/views/dashboard/ujian/schedule/index.layout')
)

export default function RouteUjian() {
    return <Schedule />
}