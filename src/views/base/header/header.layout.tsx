import { Avatar, Col, Divider, notification, Popover, Row } from 'antd';
import Image from 'next/image';
import Logo from '@lynx/images/logo.png'
import { UserOutlined } from '@ant-design/icons';
import { Icons } from '@afx/components/common/icons';
import { useLynxStore } from '@lynx/store/core';
import { IActionAuth, IStateAuth } from '@lynx/models/user-model/auth/auth.model';
import { signOut } from 'next-auth/react';
import LynxStorages from '@afx/utils/storage.util';
import { useEffect, useState } from 'react';

const tempMenus = ['Dashboard', 'Profil']


function content(): React.JSX.Element {
    const { useActions } = useLynxStore<IStateAuth, IActionAuth>('auth')
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
        <div>
            <ul>
                {tempMenus?.map((item, idx) =>
                    <li className='text-[#97999F] hover:text-base-color cursor-pointer' key={idx}>{item}</li>
                )}
                <li className='text-[#97999F] hover:text-base-color cursor-pointer' onClick={handleLogout} >Keluar</li>
            </ul>
        </div>
    )
}
function contentNotif(): React.JSX.Element {
    return (
        <> notif</>
    )
}


export default function HeaderLayout(): React.JSX.Element {
    const [profile, setProfile] = useState<any>(null)
    useEffect(() => {
        const tempData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0]
        setProfile(tempData)
    }, [])

    return (
        <Row className=' px-6 sm:px-10 xl:px-16 w-full py-4' >
            <Col span={24} >
                <div className='flex justify-between  w-full'>
                    <div className='flex gap-2 items-center text-base font-semibold text-[#ED7020] '>
                        <Image
                            src={Logo}
                            alt="Adzkia"
                            className="mr-2"
                            width={46}
                            height={46}
                        />
                        <p>Klik Adzkia</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Popover placement="bottomRight" title={<div className='flex items-center justify-between'>
                            <p className='text-base-color text-base'>Notifikasi</p>
                            <p className='text-base-color text-xs'>Lihat semua</p>
                        </div>} content={contentNotif} arrow={false} className='flex items-center' >
                            <span>
                                <Icons type='BellOutlined' size={24} className='text-base-color font-bold' />
                            </span>
                        </Popover>
                        <Popover placement="bottomRight" title={<div className='text-base-color text-base'>Menu</div>} content={content} arrow={false} className='flex items-center gap-2'>
                            <span className='text-base-color'>{profile?.name}</span>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Popover>
                    </div>
                </div>
            </Col>
        </Row>
    )
}