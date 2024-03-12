import { lazy } from 'react';

const Test = lazy(
    () => import('@afx/views/index.layout')
)

export default function TestPortal() {
    return <Test />
}