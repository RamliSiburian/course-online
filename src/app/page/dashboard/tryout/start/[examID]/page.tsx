import { lazy } from 'react';

const StartExam = lazy(
    () => import('@afx/views/dashboard/ujian/start/index.layout')
)

export default function RouteUjian() {
    return <StartExam />
}