import { Layout, Flex, theme } from 'antd';
import HeaderLayout from './header/header.layout';

const { Header, Footer, Sider, Content } = Layout;

interface IDashboard {
    children: any
}

export default function Dashboard(props: IDashboard): React.JSX.Element {
    const {
        token: { colorBgContainer }
    } = theme.useToken()


    return (
        <Layout className='h-screen overflow-hidden'>
            <Header className='!px-0' style={{
                height: 'auto',
                display: 'flex',
                justifyItems: 'center',
                background: colorBgContainer,
                padding: 'none',
                boxShadow: '0px 3px 6px rgb(151 169 204/10%)',
                zIndex: 2
            }} ><HeaderLayout /> </Header>
            <Layout className=''>
                <Sider width="25%" style={{ background: colorBgContainer }} >
                    Sider
                </Sider>
                <Content style={{ background: colorBgContainer }} >{props.children}</Content>
            </Layout>
            <Footer style={{ background: colorBgContainer }} >Footer</Footer>
        </Layout>
    )
}