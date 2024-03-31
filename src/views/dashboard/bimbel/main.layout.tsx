import LynxStorages from '@afx/utils/storage.util';
import { IActionAuth, IStateAuth } from '@lynx/models/auth/auth.model';
import { useLynxStore } from '@lynx/store/core'
import { Button, notification } from 'antd';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Bimbel(): React.JSX.Element {
    const { useActions } = useLynxStore<IStateAuth, IActionAuth>('auth')
    const router = useRouter()


    const handleLogout = () => {
        useActions<'logout'>('logout', [(status: number) => {
            if (status === 200) {
                signOut({ callbackUrl: 'http://localhost:3000/auth/login' })
                notification.success({
                    message: 'Logout successfull',
                    duration: 1
                })
                LynxStorages.dropItem('ADZKIA@UTOKEN')
            }
        }], true)

    }
    return (
        <>
            <Button onClick={handleLogout}>Logout</Button>
        </>
    )
}