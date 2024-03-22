import { Button, Col, Row } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Logo from '@lynx/images/logo.png'
import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import { LynxForm, LynxFormItem } from '@afx/components/common/form/form'
import LynxInput from '@afx/components/common/input/input'
import { EyeOutlined, UserOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'

export default function LoginPage(): React.JSX.Element {
    const router = useRouter()
    const handleLogin = () => {
        localStorage.setItem('ADZKIA@UTOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cGUiOiJKV1QifQ.eyJpZCI6IjliOTcwMzU1LTVhNGMtNDc5Mi04OTVjLTI0NDE2NzQ0NmI4MCIsInVzZXJuYW1lIjoidGVzdDAwMV8xNzEwNzI4OTgyIiwiY29tbXVuaXR5X2lkIjpudWxsLCJjb21tdW5pdHlfZ3JvdXBfaWQiOm51bGwsImNvbW11bml0eV9tZW1iZXJfaWQiOm51bGwsInJvbGUiOiJjb21tb24iLCJpYXQiOjE3MTEwMTA4MDEsImV4cCI6MTc0MjU0NjgwMX0.B2gzmHUYN5b_YRwEw_0fVQl3p0JXy636tZ7gFUF76pjaF4sUr_EMeQNsWwSnoAxknSXXTcSPlIyLZGlbaq_1933_cw3DXL9kr5hsn5NBu87sIs0_qitmYZos1qr7mOKf7jjv-T1AAlnc1O_i-ffLsiXxZSFcgE-wbEPbsgkQS6c')
        router.push('/dashboard')
    }
    return (
        <div className='bg-[#FFF] h-screen'>
            <Row className='px-24 py-5 '>
                <Col span={24} >
                    <div className='flex justify-between'>
                        <div className='flex gap-2 items-center text-base text-[#ED7020]'>
                            <Image
                                src={Logo}
                                alt="Adzkia"
                                className="mr-2"
                                width={46}
                                height={46}
                            />
                            <p>Klik Adzkia</p>
                        </div>
                        <LynxButtons title='Daftar' size='large' style={{ borderRadius: '100px', padding: '4px 24px' }} />
                    </div>
                </Col>

                <Col xl={16} className='mt-[140px]'>
                    <p className='text-[22px] font-bold text-[#2D4379]'>Masuk Sekarang</p>
                    <p className='text-lg font-normal text-[#4A5C87]'> Kamu sudah punya akun? kalau belum, yuk daftar dulu <span className='font-bold'>di sini !</span> </p>
                </Col>
                <Col xl={8} className='mt-10'>
                    <LynxCards className='!w-[440px]'>
                        <div className='flex flex-col items-center'>
                            <p className='font-semibold text-[#2D4379] text-[32px]'>Masuk</p>
                            <p className='text-sm text-[#4A5C87]'> Ayo bergabung bersama siswa yang lainnya </p>
                        </div>

                        <LynxForm name='validateOnly' layout='vertical' className='tracking-normal mt-10' autoComplete='off'>
                            <Row gutter={[0, 10]}>
                                <Col span={24}>
                                    <LynxFormItem name="usename" >
                                        <LynxInput
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder="Username"
                                            standart={false}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="password" >
                                        <LynxInput
                                            prefix={<EyeOutlined className="site-form-item-icon" />}
                                            placeholder="Password"
                                            standart={false}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxButtons onClick={() => signIn()} title="masuk" style={{ width: '100%' }} size='large' />
                                </Col>
                            </Row>
                        </LynxForm>
                    </LynxCards>
                </Col>
            </Row>
        </div>
    )
}


