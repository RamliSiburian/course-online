import { Layout, MenuProps, theme } from 'antd';
import HeaderLayout from './header/header.layout';
import { Icons } from '@afx/components/common/icons';
import SiderMenu from './sider/sider.layout';
import Link from 'next/link';
import { useLynxStore } from '@lynx/store/core';
import { IActionGlobal, IStateGlobal } from '@lynx/models/global.model';
import { WindowWidth } from '@afx/components/common/window-width/window-width';


const { Header, Footer, Content } = Layout;

interface IDashboard {
    children: any
}

const items: MenuProps['items'] = [
    {
        label: <Link href={'/page/dashboard'} >Dashboard </Link>,
        key: 'dashboard',
        icon: <Icons type='AppstoreOutlined' size={16} />
    }

]

export default function Pages(props: IDashboard): React.JSX.Element {
    const windowWidth: number = WindowWidth()
    const {
        token: { colorBgContainer }
    } = theme.useToken()

    const { state } = useLynxStore<IStateGlobal, IActionGlobal>('globalState')

    return (
        <Layout className='h-screen overflow-scroll'>
            {state?.statusMaximize &&
                <Header className='!px-0' style={{
                    height: 'auto',
                    display: 'flex',
                    justifyItems: 'center',
                    background: colorBgContainer,
                    padding: 'none',
                    boxShadow: '0px 3px 6px rgb(151 169 204/10%)',
                    zIndex: 2
                }} ><HeaderLayout /> </Header>
            }
            <Layout className=''>
                {windowWidth > 768 && state?.statusMaximize &&
                    <SiderMenu items={items} />
                }
                <Content
                    style={{
                        // height:
                        //     state?.statusMaximize ? '100vh' : '93vh',
                        background: colorBgContainer,
                        overflowX: 'hidden',
                        overflowY: 'scroll'
                    }}>
                    {props.children}
                </Content>
            </Layout>
            {/* <Footer style={{ background: '#303030' }} >Footer</Footer> */}
        </Layout >
    )
}


