import { Checkbox, Col, Row } from 'antd';
import Image from 'next/image';
import Logo from '@lynx/images/logo.png'
import { LynxButtons } from '@afx/components/common/button/button';
import { LynxCards } from '@afx/components/common/card/card';
import { LynxForm, LynxFormItem } from '@afx/components/common/form/form';
import LynxInput from '@afx/components/common/input/input';
import { PhoneFilled, UnlockFilled, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function LoginPage(): React.JSX.Element {
    const router = useRouter()
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

                        <LynxForm name='validateOnly' layout='vertical' className='tracking-normal mt-10' autoComplete='off'>
                            <Row gutter={[0, 15]}>
                                <Col span={24}>
                                    <LynxFormItem name="usename" >
                                        <LynxInput
                                            prefix={<UserOutlined className="text-[#ED7020] site-form-item-icon" />}
                                            placeholder="Nama Lengkap"
                                            standart={false}
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="Email" >
                                        <LynxInput
                                            // prefix={<EyeOutlined className="site-form-item-icon" />}
                                            placeholder="Email"
                                            standart={false}
                                            type="email"
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="no_hp" >
                                        <LynxInput
                                            prefix={<PhoneFilled className="site-form-item-icon text-[#ED7020] " style={{ transform: 'rotate(0.3turn)' }} />}
                                            placeholder="No Handphone"
                                            standart={false}
                                            type="number"
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="password" >
                                        <LynxInput
                                            prefix={<UnlockFilled className="text-[#ED7020] site-form-item-icon" />}
                                            placeholder="Kata Sandi"
                                            standart={false}
                                            type="password"
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="re_password" >
                                        <LynxInput
                                            prefix={<UserOutlined className="text-[#ED7020] site-form-item-icon" />}
                                            placeholder="Ulangi Kata Sandi"
                                            standart={false}
                                            type="password"
                                        />
                                    </LynxFormItem>
                                </Col>
                                <Col span={24}>
                                    <LynxFormItem name="aggrement">
                                        <Checkbox onChange={(e) => console.log({ value: e.target.checked })} className='text-left text-[#4A5C87] text-xs'>Saya sudah menyetujui <span className='font-semibold'>syarat dan ketentuan</span> yang berlaku</Checkbox>
                                    </LynxFormItem>
                                </Col>
                                <Col span={24} className='mt-4'>
                                    <LynxButtons onClick={() => { }} title="Daftar" style={{ width: '100%' }} size='large' />
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


