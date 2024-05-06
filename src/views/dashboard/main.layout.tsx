import LynxStorages from '@afx/utils/storage.util';
import { Menu, MenuProps, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IDashboard {
    children: any
}


export default function Dashboard(props: IDashboard): React.JSX.Element {
    const {
        token: { colorBgContainer }
    } = theme.useToken()
    const menus = LynxStorages.getItem('ADZKIA@MENUS', true, true).data[0]
    const [listMenus, setListMenus] = useState<Array<any>>([])

    useEffect(() => {
        const tempMenu = menus?.map((item: any) => {
            return (
                {
                    label: <Link href={`/page/dashboard/${item?.slug}`} >{item?.name}</Link>,
                    key: item?.slug,
                    icon: null
                }
            )
        })
        setListMenus(tempMenu)
    }, [])
    return (
        <>
            {listMenus?.length !== 0 &&
                <Menu items={listMenus} mode='horizontal' style={{
                    border: 'none',
                    padding: '10px',
                    background: '#FEFEFE'
                }}
                    className='shadow-md'
                />
            }
            <div className='px-[22px] pt-10'>
                {props.children}
            </div>
        </>
    )
}