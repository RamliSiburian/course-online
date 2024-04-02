import { Avatar, Col, Popover, Row } from 'antd';
import Image from 'next/image';
import Logo from '@lynx/images/logo.png'
import { UserOutlined } from '@ant-design/icons';
import { Icons } from '@afx/components/common/icons';


function content(): React.JSX.Element {
    return (
        <> test</>
    )
}
function contentNotif(): React.JSX.Element {
    return (
        <> notif</>
    )
}


export default function HeaderLayout(): React.JSX.Element {
    return (
        <Row className=' px-6 sm:px-10 xl:px-16 w-full'>
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
                    <div style={{ marginInlineStart: 80, clear: 'both', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                        <Popover placement="bottomRight" content={content} arrow={false} className='flex items-center' >
                            <span>
                                <Icons type='BellOutlined' size={24} className='text-base-color font-bold' />
                            </span>
                        </Popover>
                        <Popover placement="bottomRight" content={content} arrow={false} >
                            <span>
                                <Avatar size="large" icon={<UserOutlined />} />
                            </span>
                        </Popover>
                    </div>
                </div>
            </Col>
        </Row>
    )
}