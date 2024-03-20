import { IActionAuth, IStateAuth } from '@lynx/models/auth/auth.model';
import { useLynxStore } from '@lynx/store/core'
import { Button } from 'antd';
import { useEffect } from 'react';

export default function Bimbel(): React.JSX.Element {
    const { state, useActions } = useLynxStore<IStateAuth, IActionAuth>('auth')

    const handleClick = () => {
        console.log('sdf');
        useActions<'validation'>('validation', [], true)

    }

    const handleClickToken = () => {
        localStorage.setItem('ADZKIA@UTOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cGUiOiJKV1QifQ.eyJpZCI6IjliOTcwMzU1LTVhNGMtNDc5Mi04OTVjLTI0NDE2NzQ0NmI4MCIsInVzZXJuYW1lIjoidGVzdDAwMV8xNzEwNzI4OTgyIiwiY29tbXVuaXR5X2lkIjpudWxsLCJjb21tdW5pdHlfZ3JvdXBfaWQiOm51bGwsImNvbW11bml0eV9tZW1iZXJfaWQiOm51bGwsInJvbGUiOiJjb21tb24iLCJpYXQiOjE3MTA4OTg1MjEsImV4cCI6MTc0MjQzNDUyMX0.UawPGNrFBxap-awNAwLljPVBN027GPWrEykUS6xGCM_zHU53NuHTH3olRGlSljHgyyctrrmpb5cR2hJfHBMMqAaievT1z0EhrKWgTVRiIdBKVpfxhGvMk_e9s6zKEjoJMojkOp13DKFImJJNl2uZVULQn-N-LXqeRhF6ZYG_mis')

    }
    return (
        <>
            <Button onClick={handleClick}>test bimbel</Button>
            <div onClick={handleClickToken}>set token</div>
        </>
    )
}