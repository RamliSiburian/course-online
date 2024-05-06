import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import { Icons } from '@afx/components/common/icons'
import { LynxModal } from '@afx/components/common/modals/modal.layout'
import { SuccessNotif } from '@afx/components/common/notification/success'
import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqExamQuestion } from '@afx/interfaces/exam/client/exam.iface'
import LynxStorages from '@afx/utils/storage.util'
import getPath from '@lynx/const/router.path'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Col, Row } from 'antd'
import JSZip from 'jszip'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


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

export function StartExam(): React.JSX.Element {
    const { examID: params }: { examID: string } = useParams() as any
    const router = useRouter()
    const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { useActions: exam, isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam')
    const user = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0]
    const loadingDetail = scheduleloading('getDetailExam') || scheduleloading('getFormRegister') || false
    const loadingExam = examLoading('getAttachment') || examLoading('getListExamQuestion') || false
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [isQuestion, setIsQuestion] = useState<boolean>(false)
    const [isAttachment, setIsAttachment] = useState<boolean>(false)

    useEffect(() => {
        schedules<'getDetailExam'>('getDetailExam', [params], true)
        schedules<'getFormRegister'>('getFormRegister', [params], true)
    }, [])

    const isImageFile = (fileName: any) => {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    };

    const saveToIndexedDB = (relativePath: string, blob: any) => {

        const request = window.indexedDB.open('images', 1);

        request.onerror = function (event) {
            console.log('Error opening database');
        };

        request.onupgradeneeded = function (event) {
            var db = event?.target.result;

            var objectStore = db.createObjectStore('Images', { keyPath: 'id' });
        };

        request.onsuccess = function (event) {
            var db = event.target.result;

            // Insert data into the object store
            var transaction = db.transaction(['Images'], 'readwrite');
            var objectStore = transaction.objectStore('Images');

            var request = objectStore.put({ 'id': relativePath, blob });

            request.onsuccess = function (event: any) {
                console.log('Data inserted successfully');
            };

            request.onerror = function (event: any) {
                console.log('Error inserting data');
            };
        };
    };

    const saveImageToIndexedDB = async (data: any) => {
        if (!data) return;

        try {
            const zip = await JSZip.loadAsync(data);

            zip.forEach(async (relativePath, file) => {

                if (file.dir) return;
                if (isImageFile(relativePath)) {
                    const blob = await file.async('blob');
                    const imageUrl = URL.createObjectURL(blob);
                    saveToIndexedDB(relativePath, blob);
                }
            });

        } catch (error) {
            WarningNotif({ message: 'Failed', description: 'Error extracting ZIP contents' })
        }
    };

    const startExam = () => {
        const paramsQuestion: IReqExamQuestion = {
            registerID: state?.formRegister?.exam?.id,
            scheduleID: params
        }
        exam<'getListExamQuestion'>('getListExamQuestion', [paramsQuestion, (status: number) => {
            if (status === 200) {
                SuccessNotif({ key: 'LIST-QUESTION', message: 'Success', description: 'Question has been downloaded' })
                setIsQuestion(true)
            } else {
                setIsQuestion(false)
            }
        }], true)

        exam<'getAttachment'>('getAttachment', [paramsQuestion, (status: number, data: any) => {
            if (status === 200) {
                saveImageToIndexedDB(data)
                SuccessNotif({ key: 'LIST-ATTACHMENT', message: 'Success', description: 'Attachment has been downloaded' })
                setIsAttachment(true)
            } else {
                setIsAttachment(false)
            }
        }], true)
    }


    useEffect(() => {
        if (isQuestion && isAttachment) {
            //TODO: start api
        } else { }
    }, [isQuestion, isAttachment])



    return (
        <div className='shadow-2xl p-8 h-full' >
            <div className='flex items-center gap-4 mb-10'>
                <Icons onClick={() => router.push(getPath('scheduleDetail', { scheduleID: params }))} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
                <p className='text-base-color font-bold text-xl'>Detail Ujian</p>
            </div>
            <div className='flex justify-between '>
                <div>
                    <p className='text-base-color text-lg font-semibold'>{state?.detailSchedule?.title}</p>
                    <p className=''>{state?.detailSchedule?.description}</p>
                    <div className='flex gap-2 mt-5'>
                        <LynxButtons typeButton='primary-300' size='small' title="Ujian saya" onClick={() => router.replace('/page/dashboard/tryout')} />
                        <LynxButtons size='small' title="baca Panduan" onClick={() => setOpenModal(true)} />
                    </div>
                </div>
                <div>
                    <Image
                        src={require('@lynx/images/list.png')}
                        alt="Adzkia"
                        className="mr-2"
                        width={150}
                        height={150}
                    />
                </div>
            </div>
            <div>
                <p className='text-base-color text-base'>Detail Peserta Ujian</p>
                <div className='mt-2 text-base-color' >
                    <Row gutter={[0, 10]} >
                        <Col span={6}><p className='font-normal text-xs'>Nama Peserta</p></Col>
                        <Col span={18}><p className='font-normal text-xs'>: {user?.name}</p></Col>
                        <Col span={6}><p className='font-normal text-xs'>Total Soal</p></Col>
                        <Col span={18}><p className='font-normal text-xs'>: {state?.formRegister?.total_question} Soal</p></Col>
                        <Col span={6}><p className='font-normal text-xs'>Dapat Dilewati</p></Col>
                        <Col span={18}><p className='font-normal text-xs'>: {state?.detailSchedule?.randomize === true ? 'Ya' : 'Tidak'}</p></Col>
                        <Col span={6}><p className='font-normal text-xs'>Pembahasan</p></Col>
                        <Col span={18}><p className='font-normal text-xs'>: { }</p></Col>
                        <Col span={6}><p className='font-normal text-xs'>Dapat Diulang</p></Col>
                        <Col span={18}><p className='font-normal text-xs'>: {state?.detailSchedule?.repeatable === true ? 'Ya' : 'Tidak'}</p></Col>
                    </Row>
                    <LynxButtons disabled={loadingExam} onClick={startExam} title="Mulai Ujian" className='!w-full mt-10' />
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