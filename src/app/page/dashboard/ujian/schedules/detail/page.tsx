import { lazy } from 'react';

const DetailSchedule = lazy(
    () => import('@afx/views/dashboard/ujian/schedule/detail/index.layout')
)

export default function RouteUjian() {
    return <DetailSchedule />
}