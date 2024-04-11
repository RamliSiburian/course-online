import { Layout, Menu, MenuProps, theme } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

interface IPropsMenus {
    collapsed?: boolean
    items: MenuProps['items']
}
export default function SiderMenu(props: IPropsMenus): React.JSX.Element {
    const {
        token: { colorBgContainer }
    } = theme.useToken()
    return (
        <Sider width="20%" style={{ background: colorBgContainer }} >
            <Menu
                mode='inline'
                style={{
                    minHeight: '100%',
                    borderRight: '1px solid #E2E2E2'
                }}
                items={props.items}
            />
        </Sider>
    )
}