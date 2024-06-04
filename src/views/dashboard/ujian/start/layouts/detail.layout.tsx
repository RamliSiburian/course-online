import { LynxButtons } from '@afx/components/common/button/button';
import { LynxCards } from '@afx/components/common/card/card';
import { Icons } from '@afx/components/common/icons';
import { LynxModal } from '@afx/components/common/modals/modal.layout';
import LynxStorages from '@afx/utils/storage.util';
import getPath from '@lynx/const/router.path';
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import { Col, Row } from 'antd';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IDetailStartExam {
    startExam: () => void
    result: () => void
}

export function DetailStartExam(props: IDetailStartExam): React.JSX.Element {
    const router = useRouter()
    const { examID: params }: { examID: string } = useParams() as any
    const { state, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam')
    const loadingExam = examLoading('getAttachment') || examLoading('getListExamQuestion') || false
    // const user = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0]
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const userData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0];
        setUser(userData);
    }, []);

    return (
        <div className='shadow-xl p-8 h-full' >
            <div className='flex items-center gap-4 mb-10'>
                <Icons onClick={() => router.push(getPath('scheduleDetail', { scheduleID: params }))} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
                <p className='text-base-color font-bold text-xl'>Detail Ujian</p>
            </div>
            <div className='flex justify-between '>
                <div>
                    <p className='text-base-color text-sm lg:text-lg font-semibold'>{state?.detailSchedule?.title}</p>
                    <p className='mt-2'>{state?.detailSchedule?.description}</p>
                    <div className='flex gap-2 mt-5'>
                        <LynxButtons typeButton='primary-300' size='small' title="Ujian saya" onClick={() => router.replace('/page/dashboard/tryout')} />
                        <LynxButtons size='small' title="baca Panduan" onClick={() => setOpenModal(true)} />
                    </div>
                </div>
                <div>
                    <Image
                        src={require('@lynx/images/list.png')}
                        alt="Adzkia"
                        className="mr-2 hidden lg:inline-block"
                        width={150}
                        height={150}
                    />
                </div>
            </div>
            <div className='mt-4'>
                <p className='text-base-color text-base'>Detail Peserta Ujian</p>
                <div className='mt-2 text-base-color' >
                    <Row gutter={[0, 10]} >
                        <Col span={10}><p className='font-normal text-xs'>Nama Peserta</p></Col>
                        <Col span={14}><p className='font-normal text-xs'>: {user ? user.name.slice(0, 20) : 'Loading...'}</p></Col>
                        <Col span={10}><p className='font-normal text-xs'>Total Soal</p></Col>
                        <Col span={14}><p className='font-normal text-xs'>: {state?.formRegister?.total_question} Soal</p></Col>
                        {/* <Col span={10}><p className='font-normal text-xs'>Dapat Dilewati</p></Col>
                    <Col span={14}><p className='font-normal text-xs'>: {state?.detailSchedule?.randomize === true ? 'Ya' : 'Tidak'}</p></Col> */}
                        <Col span={10}><p className='font-normal text-xs'>Pembahasan</p></Col>
                        <Col span={14}><p className='font-normal text-xs'>: {state?.detailSchedule?.is_discussion === true ? 'Ya' : 'Tidak'}</p></Col>
                        <Col span={10}><p className='font-normal text-xs'>Dapat Diulang</p></Col>
                        <Col span={14}><p className='font-normal text-xs'>: {state?.detailSchedule?.repeatable === true ? 'Ya' : 'Tidak'}</p></Col>
                    </Row>
                    {
                        state?.formRegister?.exam?.status === 'finish' && !state?.formRegister?.repeatable ?
                            <LynxButtons disabled={loadingExam} onClick={props?.result} title="Lihat Hasil Ujian" className='!w-full mt-10' />
                            : <LynxButtons disabled={loadingExam} onClick={props?.startExam} title="Mulai Ujian" className='!w-full mt-10' />
                    }
                </div>
            </div>
            <LynxModal width={450} open={openModal} onCancel={() => setOpenModal(false)} title="Tata Tertib Ujian" content={
                <LynxCards className='mt-10 !shadow-md'>
                    <ul>
                        {
                            panduan?.map((item: string, idx: number) => <li key={idx} className='text-[#4A5C87]'>{idx + 1}. {item}</li>)
                        }
                    </ul>
                </LynxCards>
            } />
        </div>
    )
}




const panduan: string[] = [
    'Pastikan Koneksi Internet kamu stabil dan paket data kamu cukup untuk mengikuti ujian.',
    'Pilihlah jawaban yang paling benar menurut kamu lalu tekan tombol Simpan untuk melanjutkan ke nomor soal berikutnya.',
    'Jika kamu masih ragu-ragu dengan jawaban soal tersebut maka kamu bisa menekan tombol Lewati untuk ke soal berikutnya.',
    'Jika kamu ingin mengerjakan soal secara acak maka kamu bisa menekan tombol , lalu pilih nomor soal yang kamu inginkan dan jangan lupa simpan setiap jawaban yang sudah dipilih.',
    'Jika kamu menekan tombol Selesai maka kamu dianggap sudah menyelesaikan ujian tersebut dan tidak bisa mengulanginya lagi.',
    'Pastikan waktu ujian kamu cukup untuk menyelesaikan seluruh soal. Jika tidak maka ujian akan selesai secara otomatis atau akan masuk ke ujian berikutnya.',
    ' Jika seluruh ujian sudah selesai dan kamu sudah menekan tombol Selesai maka kamu akan diarahkan ke menu hasil ujian : skor per bidang, total skor, lulus/tidak lulus, dan rinciannya.',
    'Setelah kamu menekan Tombol Mulai Ujian maka waktu akan otomatis berjalan.'
]
