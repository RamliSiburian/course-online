import { IActionAuth, IStateAuth } from '@lynx/models/auth/auth.model';
import { useLynxStore } from '@lynx/store/core'
import { Button } from 'antd';
import { useEffect } from 'react';

export default function Bimbel(): React.JSX.Element {
    const { state, useActions } = useLynxStore<IStateAuth, IActionAuth>('auth')

    const handleClick = () => {
        console.log('sdf');
        useActions<'login'>('login', [{ username: 'test001@example.com', password: 'secret' }], true)

    }
    return (
        <>
            <Button onClick={handleClick}>test bimbel</Button>
        </>
    )
}