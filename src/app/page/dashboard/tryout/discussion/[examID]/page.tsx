import { lazy } from 'react';

const Discussion = lazy(
  () => import('@afx/views/dashboard/ujian/disscussion/index.layout')
)

export default function RouteUjian() {
  return <Discussion />
}