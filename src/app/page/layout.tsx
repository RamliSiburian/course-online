'use client'
import LynxStorages from '@afx/utils/storage.util';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { lazy, useLayoutEffect } from 'react'

const BasePortal = lazy(
    () => import('@afx/views/base/index.layout')
)
export default function DashboardLayout({ children }: any): React.JSX.Element {
    const { data: session } = useSession();
    const token = LynxStorages.getItem('ADZKIA@UTOKEN').data

    useLayoutEffect(() => {
        if ((session === null || session === undefined) && token[0] === null) {
            redirect('/auth/login')
        }
    }, [token, session])




    return (
        <div>
            <BasePortal>{children}</BasePortal>
        </div>
    )
}