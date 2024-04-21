import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import { Col, Image, Row } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DetailSchedule(): React.JSX.Element {
    const router = useRouter()
    const { state, useActions } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { scheduleID: params }: { scheduleID: string } = useParams() as any


    useEffect(() => {
        useActions<'getDetailExam'>('getDetailExam', [params], true)
    }, [])

    return (
        <div className='shadow-2xl p-4 h-full' >
            <div className='flex items-center gap-4 mb-10'>
                <Icons onClick={() => router.replace('/page/dashboard/ujian/schedules')} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
                <p className='text-base-color font-bold text-xl'>Detail Ujian</p>
            </div>
            <Row gutter={[0, 40]}>
                <Col span={6}>
                    <Image className='rounded-lg' height={300} alt="example" src="https://klik-adzkia.com/assets/assets/images/no_thumbnail/tryout.jpg" />
                </Col>
                <Col span={18}>
                    <div>
                        <div className='p-4 rounded-lg shadow-md w-full'>
                            <p className='text-base-color'>TRYOUT PSIKOTES BINTARA-POLRI SISWA ADZKIA #1</p>

                            <div className='mt-2 text-base-color' >
                                <Row gutter={[0, 10]} >
                                    <Col span={6}><p className='font-normal text-xs'>jumlah Soal</p></Col>
                                    <Col span={18}><p className='font-normal text-xs'>: {state?.detailSchedule?.total_question}</p></Col>
                                    <Col span={6}><p className='font-normal text-xs'>Durasi Ujian</p></Col>
                                    <Col span={18}><p className='font-normal text-xs'>: {state?.detailSchedule?.duration} Menit</p></Col>
                                    <Col span={6}><p className='font-normal text-xs'>Kapasita Peserta</p></Col>
                                    <Col span={18}><p className='font-normal text-xs'>: {state?.detailSchedule?.total_registered}/{state?.detailSchedule?.quota}</p></Col>
                                </Row>
                            </div>
                        </div>
                        <div className='w-full flex justify-between items-center mt-10'>
                            <div>
                                <p className='text-base-color'>Biaya Pendaftara</p>
                                <p className='text-base-color'>Gratis</p>
                            </div>
                            {
                                state?.detailSchedule?.total_registered === state?.detailSchedule?.quota ?
                                    <LynxButtons disabled title='Kuota Penuh' className='!w-32 !bg-[#f00]' />
                                    :
                                    <LynxButtons title='Daftar' className='!w-32' />
                            }
                        </div>
                    </div>
                </Col>
                <Col span={24}>
                    <div>
                        <p className='text-base-color font-semibold text-base mb-2'>Tata Tertib Ujian</p>
                        <ol start={1} type='1' className='text-base-color'>
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
        </div>
    )
}