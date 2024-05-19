import { lazy } from 'react';

const ResultExam = lazy(
    () => import('@afx/views/dashboard/ujian/result/index.layout')
)

export default function RouteUjian() {
    return <ResultExam />
}