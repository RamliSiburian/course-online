import { lazy } from 'react';

const Schedule = lazy(
    () => import('@afx/views/dashboard/ujian/layouts/index.layout')
)

export default function RouteUjian() {
    return <Schedule />
}