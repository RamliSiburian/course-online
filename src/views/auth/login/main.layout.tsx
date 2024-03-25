import { Col, Divider, Form, notification, Row } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Logo from '@lynx/images/logo.png'
import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import { LynxForm, LynxFormItem } from '@afx/components/common/form/form'
import LynxInput from '@afx/components/common/input/input'
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { Icons } from '@afx/components/common/icons'
import { useLynxStore } from '@lynx/store/core'
import { IActionAuth, IStateAuth } from '@lynx/models/auth/auth.model'
import { IReqLogin } from '@afx/interfaces/auth/auth.iface'
import { useState } from 'react'

export default function LoginPage(): React.JSX.Element {
    const router = useRouter()
    const { useActions, isLoading } = useLynxStore<IStateAuth, IActionAuth>('auth')
    const [typePass, setTypePass] = useState<string>('password')

    const [forms] = Form.useForm<IReqLogin>()

    const loading = isLoading('login') || false


    const handleLogin = () => {
        return forms.validateFields().then(values => {
            useActions<'login'>('login', [values, (status: number, user: string) => {
                if (status == 200) {
                    notification.success({
                        description: `Wellcome ${user}`,
                        message: 'Login berhasil',
                        duration: 2
                    })
                }
            }], true)
        }).catch(err => {
            // notification.warning({
            //     description: 'Some field is required ',
            //     message: err?.errorFields?.[0]?.errors
            // })
        })
    }
    return (
        <div className='bg-[#FFF] h-screen'>
            <Row className='px-6 sm:px-10 xl:px-24 py-5 '>
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
                        <LynxButtons onClick={() => router.replace('/auth/register')} title='Daftar' size='large' style={{ borderRadius: '100px', padding: '4px 24px' }} />
                    </div>
                </Col>

                <Col span={0} sm={0} md={0} xl={12} xxl={16} className='mt-[140px]'>
                    <p className='text-[22px] font-bold text-[#2D4379]'>Masuk Sekarang</p>
                    <p className='text-lg font-normal text-[#4A5C87]'> Kamu sudah punya akun? kalau belum, yuk daftar dulu <span className='font-bold'>di sini !</span> </p>
                </Col>
                <Col sm={24} md={24} xl={12} xxl={8} className='mt-10 flex justify-center'>
                    <LynxCards className='!w-[440px] py-5'>
                        <div className='flex flex-col items-center'>
                            <p className='font-semibold text-[#2D4379] text-[32px]'>Masuk</p>
                            <p className='text-sm text-[#4A5C87]'> Ayo bergabung bersama siswa yang lainnya </p>
                        </div>

                        <LynxForm name='validateOnly' layout='vertical' className='tracking-normal mt-10' autoComplete='off' form={forms}>
                            <Row gutter={[0, 15]}>
                                <Col span={24}>
                                    <LynxFormItem name="username" rules={[{ required: true, message: 'username is required' }]}>
                                        <LynxInput
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder="Username"
                                            standart={false}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="password" rules={[{ required: true, message: 'password is required' }]} >
                                        <LynxInput
                                            prefix={typePass === 'password' ? <EyeOutlined className="site-form-item-icon" onClick={() => setTypePass('text')} /> : <EyeInvisibleOutlined className="site-form-item-icon" onClick={() => setTypePass('password')} />}
                                            placeholder="Password"
                                            standart={false}
                                            type={typePass}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24} className='mt-4'>
                                    <LynxButtons disabled={loading} onClick={handleLogin} title="masuk" style={{ width: '100%' }} size='large' />
                                </Col>
                                <Col span={24}>
                                    <Divider><p className='text-[#888FA5] text-xs'>atau masuk dengan</p></Divider>
                                </Col>
                                <Col span={24}>
                                    <div className='flex justify-center items-center gap-8'>
                                        <div className='w-11 h-11 bg-[#FFF] rounded-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_5px_0px_rgba(237,112,32,1)] cursor-pointer flex justify-center items-center'>
                                            <Image
                                                src={Logo}
                                                alt="Adzkia"
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                        <div className='w-11 h-11 bg-[#FFF] rounded-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_5px_0px_rgba(0,0,255,1)] cursor-pointer flex justify-center items-center'>
                                            <Icons size={20} type='FacebookFilled' />
                                        </div>
                                        <div className='w-11 h-11 bg-[#FFF] rounded-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.1)] hover:shadow-blue-300 cursor-pointer flex justify-center items-center' onClick={() => signIn('google')}>
                                            <Icons size={20} type='GoogleOutlined' />
                                        </div>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div className='flex flex-col items-center gap-3 mt-5'>
                                        <p>Lupa <span className='text-[#ED7020] cursor-pointer'>Kata Sandi ?</span></p>
                                        <p>Belum punya akun ? <span className='text-[#275ECE] cursor-pointer' onClick={() => router.replace('/auth/register')}>Daftar di sini.</span></p>
                                    </div>
                                </Col>
                            </Row>
                        </LynxForm>
                    </LynxCards>
                </Col>
            </Row>
        </div>
    )
}


