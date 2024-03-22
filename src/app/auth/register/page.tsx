import { lazy } from 'react';

const Regis = lazy(
    () => import('@afx/views/auth/register/index.layout')
)

export default async function LoginPage() {
    return <Regis />
}