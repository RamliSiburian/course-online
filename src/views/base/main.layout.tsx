import { Layout, Flex, theme } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

interface IDashboard {
    children: any
}

export default function Dashboard(props: IDashboard): React.JSX.Element {
    const {
        token: { colorBgContainer }
    } = theme.useToken()


    return (
        <Flex gap="middle" wrap="wrap">
            <Layout className='h-screen'>
                <Header style={{
                    display: 'flex',
                    justifyContent: '',
                    padding: '0px 0px 0px 30px',
                    background: colorBgContainer,
                    borderRight: '1px solid #E2E2E2'
                }} >Header</Header>
                <Layout className=''>
                    <Sider width="25%" style={{ background: colorBgContainer }} >
                        Sider
                    </Sider>
                    <Content style={{ background: colorBgContainer }} >{props.children}</Content>
                </Layout>
                <Footer style={{ background: colorBgContainer }} >Footer</Footer>
            </Layout>


        </Flex>
    )
}