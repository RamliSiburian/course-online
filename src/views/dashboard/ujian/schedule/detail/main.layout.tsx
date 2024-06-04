import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import { ModalConfirm } from '@afx/components/common/modals/modal-confirm.layout';
import LynxStorages from '@afx/utils/storage.util';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import { Col, Image, Row, Skeleton, Space } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Order from '@lynx/images/order.png'
import { IActionPayment, IStatePayment } from '@lynx/models/payment/client/payment.model';
import { SuccessNotif } from '@afx/components/common/notification/success';
import LynxCurrency from '@afx/components/common/typography/currency.layout';
import getPath from '@lynx/const/router.path';
import { WindowWidth } from '@afx/components/common/window-width/window-width';

export function DetailSchedule(): React.JSX.Element {
    const windowWidth: number = WindowWidth()
    const router = useRouter()
    const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { useActions: claimExam, isLoading } = useLynxStore<IStatePayment, IActionPayment>('payment')
    const { scheduleID: params }: { scheduleID: string } = useParams() as any
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const roleUser = LynxStorages.getItem('ADZKIA@UROLE', true, true).data[0]
    const claimLoading = isLoading('claimExam') || false
    const loading = scheduleloading('getDetailExam') || scheduleloading('getFormRegister') || false

    useEffect(() => {
        schedules<'getDetailExam'>('getDetailExam', [params], true)
        schedules<'getFormRegister'>('getFormRegister', [params], true)
    }, [])

    const freeRegister = () => {
        try {
            var paramsToClaim = new FormData()
            paramsToClaim.set('id', state?.detailSchedule?.id)
            paramsToClaim.set('name', state?.detailSchedule?.title)
            paramsToClaim.set('type', 'tryout')
            paramsToClaim.set('user_id', roleUser?.user_id)

            claimExam<'claimExam'>('claimExam', [paramsToClaim, (status: number) => {
                if (status === 200) {
                    SuccessNotif({ key: 'CLAIM', message: 'Succes to load data', description: 'Exam has been claimed' })
                    schedules<'getDetailExam'>('getDetailExam', [params], true)
                    schedules<'getFormRegister'>('getFormRegister', [params], true)
                    setOpenConfirm(false)
                }
            }], true)
        } catch (err: any) {
        }
    }

    console.log({ sdfsaf: state?.formRegister });

    return (
        <>
            {windowWidth > 640 ?
                <div className='shadow-xl p-8 h-full' >
                    <div className='flex items-center gap-4 mb-10'>
                        <Icons onClick={() => router.replace('/page/dashboard/tryout/schedules')} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
                        <p className='text-base-color font-bold text-xl'>Detail Ujian</p>
                    </div>
                    {loading ?
                        <div>
                            <div className='flex gap-10'>
                                <Skeleton.Image className='!h-[300px] !w-[300px]' active />
                                <div className='w-full flex flex-col gap-2'>
                                    <Skeleton.Input active style={{ width: '300px' }} />
                                    <Skeleton.Input block active />
                                    <Skeleton.Input block active />
                                    <Skeleton.Input block active />
                                    <Skeleton.Input block active />
                                    <div className='flex justify-between mt-4'>
                                        <Skeleton.Input active />
                                        <Skeleton.Button style={{ width: '120px' }} active />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-2 mt-14'>
                                <Skeleton.Input active style={{ width: '256px' }} />
                                <Skeleton.Input block active className='!w-3/6' />
                                <Skeleton.Input block active className='!w-3/5' />
                                <Skeleton.Input block active className='!w-3/4' />
                                <Skeleton.Input block active className='!w-2/3 ' />
                                <Skeleton.Input block active className='!w-3/5' />
                            </div>
                        </div>
                        :
                        <Row gutter={[0, 40]}>
                            <Col sm={24} md={12} xl={6}>
                                <Image className='rounded-lg items-center' height={windowWidth <= 640 ? 160 : 300} alt="example" src="https://klik-adzkia.com/assets/assets/images/no_thumbnail/tryout.jpg" />
                            </Col>
                            <Col sm={24} md={12} xl={18}>
                                <div>
                                    <div className='p-4 rounded-lg shadow-md w-full'>
                                        <p className='text-base-color'>{state?.detailSchedule?.title}</p>

                                        <div className='mt-2 text-base-color' >
                                            <Row gutter={[0, 10]} >
                                                <Col span={6}><p className='font-normal text-xs'>Jumlah Soal</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.total_question}</p></Col>
                                                <Col span={6}><p className='font-normal text-xs'>Durasi Ujian</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.duration} Menit</p></Col>
                                                <Col span={6}><p className='font-normal text-xs'>Kapasitas Peserta</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.total_registered}/{state?.formRegister?.quota}</p></Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className='w-full md:flex justify-between items-center mt-10'>
                                        <div className=''>
                                            <p className='text-base-color'>Biaya Pendaftaran</p>
                                            <p className='text-base-color'>{state?.detailSchedule?.price === null ? 'Gratis' : <LynxCurrency value={state?.detailSchedule?.price} prefix='Rp.' />}</p>
                                        </div>
                                        {state?.formRegister?.exam === null ? (
                                            state?.formRegister?.total_registered < state?.formRegister?.quota ? (
                                                state?.detailSchedule?.price === null ? <LynxButtons onClick={() => setOpenConfirm(true)} title='Ikuti Ujian' className='!w-32' />
                                                    : <LynxButtons title='Ikuti Ujian' className='!w-32' />
                                            ) : <LynxButtons disabled title='Kuota Penuh' className='!w-32 !bg-[#f00]' />
                                        ) : state?.formRegister?.exam?.status === 'finish' ?
                                            <div className='flex gap-4'>
                                                <LynxButtons title='Lihat Hasil Ujian' onClick={() => router.push(getPath('resultStart', { examID: params }))} className='!w-32' />
                                                {state?.formRegister?.repeatable &&
                                                    <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Ulangi Ujian' className='!w-32' typeButton='danger' />
                                                }
                                            </div>
                                            : <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Mulai Ujian' className='!w-32' />

                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div>
                                    <p className='text-base-color font-semibold text-base mb-2'>Tata Tertib Ujian</p>
                                    <ol start={1} type='1' className='text-base-color text-justify'>
                                        <li>Pastikan Koneksi Internet anda stabil dan paket data anda cukup untuk mengikuti ujian.</li>
                                        <li>Pilihlah jawaban yang paling benar menurut Anda lalu tekan tombol Simpan untuk melanjutkan ke nomor soal berikutnya.</li>
                                        <li>Jika Anda masih ragu-ragu dengan jawaban soal tersebut maka Anda bisa menekan tombol Lewati untuk ke soal berikutnya.</li>
                                        <li>Jika Anda ingin mengerjakan soal secara acak maka Anda bisa menekan tombol , lalu pilih nomor soal yang Anda inginkan dan jangan lupa simpan setiap jawaban yang sudah dipilih.</li>
                                        <li>Jika Anda menekan tombol Selesai maka Anda dianggap sudah menyelesaikan ujian tersebut dan tidak bisa mengulanginya lagi.</li>
                                        <li>Pastikan waktu ujian Anda cukup untuk menyelesaikan seluruh soal. Jika tidak maka ujian akan selesai secara otomatis atau akan masuk ke ujian berikutnya.</li>
                                        <li>Jika seluruh ujian sudah selesai dan Anda sudah menekan tombol Selesai maka Anda akan diarahkan ke menu hasil ujian : skor per bidang, total skor, lulus/tidak lulus, dan rinciannya.</li>
                                        <li>Setelah Anda menekan Tombol Mulai Ujian maka waktu akan otomatis berjalan.</li>
                                    </ol>
                                </div>
                            </Col>
                        </Row>
                    }
                </div> :
                <>
                    <div className='flex items-center gap-2 mb-10'>
                        <Icons onClick={() => router.replace('/page/dashboard/tryout/schedules')} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={14} />
                        <p className='text-base-color font-bold text-base'>Detail Ujian</p>
                    </div>
                    {
                        loading ?
                            Array.from({ length: 5 }).map((item: any, index) => {
                                return <div className='flex gap-4 mb-4' key={index}>
                                    <Skeleton.Image className='!h-[76px] !w-[76px]' active />
                                    <div className=' flex flex-col gap-2'>
                                        <Skeleton.Input active className='!w-full' />
                                        <div className='flex gap-2 justify-between '>
                                            <Skeleton.Input active />
                                            <Skeleton.Button active />
                                        </div>
                                    </div>
                                </div>
                            })
                            :
                            <div>
                                <div className='flex gap-3 w-full '>
                                    <Image className='rounded-lg items-center' height={76} width={76} alt="example" src="https://klik-adzkia.com/assets/assets/images/no_thumbnail/tryout.jpg" />
                                    <p className='text-base-color'>{state?.detailSchedule?.title}</p>
                                </div>
                                <div className='mt-8'>
                                    <div className='w-full'>
                                        <div className='mt-2 text-base-color' >
                                            <Row gutter={[0, 10]} >
                                                <Col span={6}><p className='font-normal text-xs'>Jumlah Soal</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.total_question}</p></Col>
                                                <Col span={6}><p className='font-normal text-xs'>Durasi Ujian</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.duration} Menit</p></Col>
                                                <Col span={6}><p className='font-normal text-xs'>Kapasitas Peserta</p></Col>
                                                <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.total_registered}/{state?.formRegister?.quota}</p></Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col mt-5'>
                                        <div className='flex items-center justify-between mb-5'>
                                            <p className='text-base-color'>Biaya Pendaftaran</p>
                                            <p className='text-base-color'>{state?.detailSchedule?.price === null ? 'Gratis' : <LynxCurrency value={state?.detailSchedule?.price} prefix='Rp.' />}</p>
                                        </div>
                                        {state?.formRegister?.exam === null ? (
                                            state?.formRegister?.total_registered < state?.formRegister?.quota ? (
                                                state?.detailSchedule?.price === null ? <LynxButtons onClick={() => setOpenConfirm(true)} title='Ikuti Ujian' className='!w-full' />
                                                    : <LynxButtons title='Ikuti Ujian' className='!w-full' />
                                            ) : <LynxButtons disabled title='Kuota Penuh' className='!w-full !bg-[#f00]' />
                                        ) : state?.formRegister?.exam?.status === 'finish' ?
                                            <div className='flex gap-4'>
                                                <LynxButtons title='Lihat Hasil Ujian' onClick={() => router.push(getPath('resultStart', { examID: params }))} className='!w-full' />
                                                {state?.formRegister?.repeatable &&
                                                    <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Ulangi Ujian' className='!w-full' typeButton='danger' />
                                                }
                                            </div>
                                            : <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Mulai Ujian' className='!w-full' />

                                        }
                                    </div>
                                </div>
                                <div className='mt-8'>
                                    <p className='text-base-color font-semibold text-base mb-2'>Tata Tertib Ujian</p>
                                    <ol start={1} type='1' className='text-base-color text-justify'>
                                        <li>Pastikan Koneksi Internet anda stabil dan paket data anda cukup untuk mengikuti ujian.</li>
                                        <li>Pilihlah jawaban yang paling benar menurut Anda lalu tekan tombol Simpan untuk melanjutkan ke nomor soal berikutnya.</li>
                                        <li>Jika Anda masih ragu-ragu dengan jawaban soal tersebut maka Anda bisa menekan tombol Lewati untuk ke soal berikutnya.</li>
                                        <li>Jika Anda ingin mengerjakan soal secara acak maka Anda bisa menekan tombol , lalu pilih nomor soal yang Anda inginkan dan jangan lupa simpan setiap jawaban yang sudah dipilih.</li>
                                        <li>Jika Anda menekan tombol Selesai maka Anda dianggap sudah menyelesaikan ujian tersebut dan tidak bisa mengulanginya lagi.</li>
                                        <li>Pastikan waktu ujian Anda cukup untuk menyelesaikan seluruh soal. Jika tidak maka ujian akan selesai secara otomatis atau akan masuk ke ujian berikutnya.</li>
                                        <li>Jika seluruh ujian sudah selesai dan Anda sudah menekan tombol Selesai maka Anda akan diarahkan ke menu hasil ujian : skor per bidang, total skor, lulus/tidak lulus, dan rinciannya.</li>
                                        <li>Setelah Anda menekan Tombol Mulai Ujian maka waktu akan otomatis berjalan.</li>
                                    </ol>
                                </div>
                            </div>
                    }
                </>
            }
            <ModalConfirm loading={claimLoading} description="Claim Produk Gratis" onCancel={() => setOpenConfirm(false)} onSave={freeRegister} open={openConfirm} srcImage={Order} textSave="Claim Now" />
        </>
    )
}