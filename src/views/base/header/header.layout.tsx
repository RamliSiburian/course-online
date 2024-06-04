import { Avatar, Col, Collapse, CollapseProps, Divider, Dropdown, MenuProps, notification, Popover, Row, Spin } from 'antd';
import Image from 'next/image';
import Logo from '@lynx/images/logo.png'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Icons } from '@afx/components/common/icons';
import { useLynxStore } from '@lynx/store/core';
import { IActionAuth, IStateAuth } from '@lynx/models/user-model/auth/auth.model';
import { signOut } from 'next-auth/react';
import LynxStorages from '@afx/utils/storage.util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowWidth } from '@afx/components/common/window-width/window-width';
import { LynxModal } from '@afx/components/common/modals/modal.layout';

function content(role: any): React.JSX.Element {
    const router = useRouter()
    const { useActions } = useLynxStore<IStateAuth, IActionAuth>('auth')
    const activeAccount = LynxStorages.getItem('ADZKIA@ACTIVEACCOUNT', true, true).data[0]

    const handleLogout = () => {
        useActions<'logout'>('logout', [(status: number) => {
            if (status === 200) {
                // signOut({ callbackUrl: '/auth/login' })
                notification.success({
                    message: 'Logout successfull',
                    duration: 1
                })
                LynxStorages.dropAll()
                router.replace('/auth/login')
            }
        }], true)
    }

    const switchAccount = (id: string) => {
        useActions<'swicthAccount'>('swicthAccount', [{ accountID: id }, (status: number) => {
            if (status === 200) {
                notification.success({
                    message: 'Switch account successfull',
                    duration: 1
                })
                router.replace('/page')
            }
        }], true)
    }


    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Account',
            children: <div className='text-[#97999F] p-0 -mt-4'>
                <div>
                    {
                        role?.length !== 0 &&
                        role?.map((item: any, idx: number) => (
                            <div key={idx} className='flex items-center justify-between mb-1'>
                                <div className='flex items-center gap-2' onClick={() => switchAccount(item?.id)}>
                                    {
                                        activeAccount === null ? (
                                            item?.is_default &&
                                            <div className='w-4 h-4 flex items-center justify-center bg-[#ED7020] rounded-full' ><Icons type='CheckOutlined' size={10} className='text-white' /> </div>
                                        ) : activeAccount?.accountID === item?.id &&
                                        <div className='w-4 h-4 flex items-center justify-center bg-[#ED7020] rounded-full' ><Icons type='CheckOutlined' size={10} className='text-white' /> </div>
                                    }
                                    <p className='' >{item?.types}</p>
                                </div>
                                {
                                    item?.is_default &&
                                    <p className='border border-[#ED7020] rounded-2xl font-medium text-[10px] px-3 py-[1px] text-[#ED7020]' >Default</p>
                                }
                            </div>
                        ))
                    }
                </div>
                <Divider className='m-0 mt-4' />
                <div className='flex items-center justify-between hover:text-base-color' onClick={handleLogout}>
                    <p>LogOut</p>
                    <LogoutOutlined />
                </div>
            </div >,
            extra: <SettingOutlined />,
            showArrow: false,
            className: 'text-[#97999F] hover:text-base-color'
        }
    ];
    return (
        <div className=' max-w-[200px]'>
            <ul>
                <li className='text-[#97999F] hover:text-base-color cursor-pointer py-1 px-4' onClick={() => router.replace('/page/dashboard')} >Dashboard</li>
                <li className='text-[#97999F] hover:text-base-color cursor-pointer py-1 px-4' >Profile</li>
            </ul>
            <Collapse
                ghost
                items={items}
                className='text-[#97999F] hover:text-base-color cursor-pointer -mt-2'
            />
        </div>
    )
}
function contentNotif(): React.JSX.Element {
    return (
        <> notif</>
    )
}


export default function HeaderLayout(): React.JSX.Element {
    const { isLoading } = useLynxStore<IStateAuth, IActionAuth>('auth')
    const loadingSwitch = isLoading('swicthAccount') || false
    const windowWidth: number = WindowWidth()
    const [profile, setProfile] = useState<any>(null)
    const [role, setRole] = useState<any>(null)
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    useEffect(() => {
        const tempData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0]
        const tempRole = LynxStorages.getItem('ADZKIA@UROLE', true, true).data[0]
        setProfile(tempData)
        setRole(tempRole)
    }, [])


    useEffect(() => {
        loadingSwitch && setOpenMenu(false)
    }, [loadingSwitch])
    return (
        <>
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
                            {windowWidth > 768 &&
                                <p>Klik Adzkia</p>
                            }
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
                            <Popover onOpenChange={() => setOpenMenu(!openMenu)} open={openMenu} placement="bottomRight" title={<div className='text-base-color text-base ms-4'>Menu</div>} content={content(role)} arrow={false} className='flex items-center gap-2'>
                                <span className='text-base-color'>{profile?.name}</span>
                                <Avatar size="large" icon={<UserOutlined />} />
                            </Popover>
                        </div>
                    </div>
                </Col>
            </Row>
            <LynxModal className='!z-[1000]' open={loadingSwitch} closeIcon={false} onCancel={() => { }} content={
                <div className='flex items-center justify-center'>
                    <Spin spinning={loadingSwitch} size='large' />
                </div>
            } />
        </>
    )
}