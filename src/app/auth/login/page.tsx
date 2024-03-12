import { lazy } from 'react';

const Login = lazy(
    () => import('@afx/views/auth/login/index.layout')
    )

export default async function LoginPage(){
    return <Login />
}