import { Checkbox, Col, Form, notification, Row } from 'antd';
import Image from 'next/image';
import Logo from '@lynx/images/logo.png'
import { LynxButtons } from '@afx/components/common/button/button';
import { LynxCards } from '@afx/components/common/card/card';
import { LynxForm, LynxFormItem } from '@afx/components/common/form/form';
import LynxInput from '@afx/components/common/input/input';
import { PhoneFilled, UnlockFilled, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { IReqRegister } from '@afx/interfaces/auth/auth.iface';
import { useState } from 'react';
import { IActionAuth, IStateAuth } from '@lynx/models/auth/auth.model';
import { useLynxStore } from '@lynx/store/core';

export default function LoginPage(): React.JSX.Element {
    const { useActions, isLoading } = useLynxStore<IStateAuth, IActionAuth>('auth')
    const router = useRouter()
    const [forms] = Form.useForm<IReqRegister>()
    const [refresh, onRefresh] = useState(false)
    const [warningPass, setWarningPass] = useState<boolean>(false)

    const handleRegister = () => {
        return forms.validateFields().then(values => {
            useActions<'register'>('register', [values, (status: number) => {
                if (status === 200) {
                    notification.success({
                        message: 'Register is Successfully',
                        description: '',
                        duration: 2
                    })
                    router.replace('/dashboard')
                }
            }], true)
        }).catch(err => {
            notification.warning({
                message: 'Some field is required',
                description: err?.errorFields?.[0]?.errors
            })
        })
    }
    return (
        <div className='bg-[#F8FDFF] h-screen'>
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
                        <LynxButtons onClick={() => router.replace('/auth/login')} title='Masuk' size='large' style={{ borderRadius: '100px', padding: '4px 24px' }} />
                    </div>
                </Col>

                <Col span={24} className='mt-10 flex justify-center'>
                    <LynxCards className='!w-[540px] py-5'>
                        <div className='flex flex-col items-center'>
                            <p className='font-semibold text-[#2D4379] text-[32px]'>Daftar Sekarang</p>
                            <p className='text-sm text-[#4A5C87]'> dan bergabung bersama siswa yang lainnya </p>
                        </div>

                        <LynxForm onFieldsChange={() => onRefresh(!refresh)} form={forms} name='validateOnly' layout='vertical' className='tracking-normal mt-10' autoComplete='off'>
                            <Row gutter={[0, 15]}>
                                <Col span={24}>
                                    <LynxFormItem
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Fields email is required' },
                                            {
                                                type: 'email',
                                                message: 'the input is not valid E-mail'
                                            }
                                        ]}
                                    >
                                        <LynxInput
                                            // prefix={<EyeOutlined className="site-form-item-icon" />}
                                            placeholder="Email"
                                            standart={false}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem hasFeedback name="password" rules={[{ required: true, message: 'Fields password is required' }]} >
                                        <LynxInput
                                            onChange={() => onRefresh(!refresh)}
                                            prefix={<UnlockFilled className="text-[#ED7020] site-form-item-icon" />}
                                            placeholder="Kata Sandi"
                                            standart={false}
                                            type="password"

                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="confirmation_password"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password'
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve()
                                                    }
                                                    return Promise.reject(new Error('The new password that you entered do not match!'))
                                                }
                                            })
                                        ]}
                                    >
                                        <LynxInput
                                            onChange={() => onRefresh(!refresh)}
                                            prefix={<UnlockFilled className="text-[#ED7020] site-form-item-icon" />}
                                            placeholder="Ulangi Kata Sandi"
                                            standart={false}
                                            type="password"
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24} className='mt-4'>
                                    <LynxButtons onClick={handleRegister} title="Daftar" style={{ width: '100%' }} size='large' />
                                </Col>

                                <Col span={24}>
                                    <div className='flex justify-center gap-3 '>
                                        <p>Sudah punya akun ? <span className='text-[#275ECE] cursor-pointer' onClick={() => router.replace('/auth/login')}>Login di sini.</span></p>
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


