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
import { IReqClaimExam } from '@afx/interfaces/payment/payment.iface';
import { SuccessNotif } from '@afx/components/common/notification/success';
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IReqAttachment, IReqExamQuestion } from '@afx/interfaces/exam/client/exam.iface';
import JSZip from 'jszip';
import { WarningNotif } from '@afx/components/common/notification/warning';
import LynxCurrency from '@afx/components/common/typography/currency.layout';
import getPath from '@lynx/const/router.path';

export function DetailSchedule(): React.JSX.Element {
    const router = useRouter()
    const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { useActions: exam } = useLynxStore<IStateExam, IActionExam>('exam')
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

    const handleAttachment = () => {
        const params: IReqAttachment = {
            registerID: '82ff5889-983a-4385-b754-be55945ee7f9',
            scheduleID: '1439ad8a-ce64-4e89-883a-3faea89db90d'
        }
        exam<'getAttachment'>('getAttachment', [params, (status: number, data: any) => {
            if (status === 200) {
                saveImageToIndexedDB(data)
            }
        }], true)
    }

    const saveImageToIndexedDB = async (data: any) => {
        if (!data) return;

        try {
            const zip = await JSZip.loadAsync(data);

            zip.forEach(async (relativePath, file) => {

                if (file.dir) return; // Skip directories
                if (isImageFile(relativePath)) {
                    const blob = await file.async('blob');
                    const imageUrl = URL.createObjectURL(blob);
                    saveToIndexedDB(relativePath, blob); // Save the blob to IndexedDB
                }
            });

        } catch (error) {
            WarningNotif({ message: 'Failed', description: 'Error extracting ZIP contents' })
        }
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

    const isImageFile = (fileName: any) => {
        // Add logic to determine if a file is an image
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    };

    const handleGetQuestion = () => {
        const params: IReqExamQuestion = {
            registerID: '82ff5889-983a-4385-b754-be55945ee7f9',
            scheduleID: '1439ad8a-ce64-4e89-883a-3faea89db90d'
        }
        exam<'getListExamQuestion'>('getListExamQuestion', [params, (status: number) => { }], true)
    }

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
            console.log({ test: err?.messages });
        }
    }

    const [image, setImage] = useState<any>([]);

    const getImage = () => {
        const request = window.indexedDB.open('images', 1);

        request.onerror = function (event) {
            console.log('Error opening database');
        };

        request.onsuccess = (event) => {
            var db = event.target.result;

            var transaction = db.transaction(['Images'], 'readonly');
            var objectStore = transaction.objectStore('Images');


            // const dataImages = ['2023_10_31_554963714_kancil.jpeg', '2023_11_03_869202118_fuji-mountain-with-milky-way-night_335224-104.webp']

            // const storeImage = dataImages?.map((item: any, idx: number) => {
            //     return objectStore.get(item).onsuccess = (event: any) => {
            //         if (getRequest.result) {
            //             return URL.createObjectURL(getRequest.result.blob)

            //         } else {
            //             console.log('No data found with the specified key');
            //         }
            //     };
            // })   

            // console.log({ storeImage });


            var getRequest = objectStore.get('2023_11_03_696814289_ppkn.jpeg'); // Replace 'your_specific_key' with the key you want to retrieve

            getRequest.onsuccess = (event: any) => {
                if (getRequest.result) {
                    console.log('Data found:', getRequest.result);
                    setImage(URL.createObjectURL(getRequest.result.blob))

                } else {
                    console.log('No data found with the specified key');
                }
            };

            getRequest.onerror = function (event: any) {
                console.log('Error retrieving data');
            };
        };
    }



    return (
        <div className='shadow-2xl p-8 h-full' >
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
                    <Col span={6}>
                        <Image className='rounded-lg' height={300} alt="example" src="https://klik-adzkia.com/assets/assets/images/no_thumbnail/tryout.jpg" />
                    </Col>
                    <Col span={18}>
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
                            <div className='w-full flex justify-between items-center mt-10'>
                                <div>
                                    <p className='text-base-color'>Biaya Pendaftaran</p>
                                    <p className='text-base-color'>{state?.detailSchedule?.price === null ? 'Gratis' : <LynxCurrency value={state?.detailSchedule?.price} prefix='Rp.' />}</p>
                                </div>
                                {state?.formRegister?.exam === null ? (
                                    state?.formRegister?.total_registered < state?.formRegister?.quota ? (
                                        state?.detailSchedule?.price === null ? <LynxButtons onClick={() => setOpenConfirm(true)} title='Ikuti Ujian' className='!w-32' />
                                            : <LynxButtons title='Ikuti Ujian' className='!w-32' />
                                    ) : <LynxButtons disabled title='Kuota Penuh' className='!w-32 !bg-[#f00]' />
                                ) : <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Mulai Ujian' className='!w-32' />

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

                    {/* <button onClick={getImage}>GET</button>
                {image && <Image alt='tets' src={image} />} */}
                </Row>
            }
            <ModalConfirm loading={false} description="Claim Produk Gratis" onCancel={() => setOpenConfirm(false)} onSave={freeRegister} open={openConfirm} srcImage={Order} textSave="Claim Now" />
        </div>
    )
}