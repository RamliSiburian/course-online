import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import LynxInput from '@afx/components/common/input/input';
import SimpleTable from '@afx/components/common/simple-table/table.layout';
import { WindowWidth } from '@afx/components/common/window-width/window-width';
import getPath from '@lynx/const/router.path';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Divider, Empty, Skeleton, Space } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/navigation';

interface IBrowseUjian {
    setKeyword: (value: string) => void

}
export default function Browse(props: IBrowseUjian): React.JSX.Element {
    const windowWidth: number = WindowWidth()
    const router = useRouter()
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const loading = isLoading('getListOwnedExam') || false
    console.log({ sfd: state?.listOwnedExam });


    return (
        <>
            {windowWidth > 640 ?
                <div className='shadow-2xl p-4 min-h-full' >
                    <div className='flex items-center justify-between'>
                        <p className='text-base-color font-bold text-lg'>Ujian Saya</p>
                        {windowWidth <= 640 &&
                            <LynxButtons onClick={() => router.replace('/page/dashboard/tryout/schedules')} title=' Lihat list ujian' size='large' />
                        }
                    </div>
                    <Divider />
                    <div className='flex justify-between items-center'>
                        <div className='w-[320px]'>
                            <LynxInput prefix={<Icons type='SearchOutlined' size={18} />} placeholder='Search' standart={false} onChange={(v: any) => props?.setKeyword(v.target.value)} />
                        </div>
                        {windowWidth > 640 &&
                            <LynxButtons onClick={() => router.replace('/page/dashboard/tryout/schedules')} title=' Lihat list ujian' size='large' />
                        }
                    </div>
                    <div className='flex gap-8 flex-wrap mt-5' >
                        <SimpleTable
                            action={false}
                            LOADINGS={loading}
                            dataSource={state?.listOwnedExam}
                            minHeight={500}
                            pagination={false}
                            columns={[
                                {
                                    key: 'id',
                                    title: 'No',
                                    itemAlign: 'center',
                                    width: 80,
                                    align: 'center',
                                    render(value, record, index) {
                                        return (
                                            <p>{(index + 1)}</p>
                                        )
                                    }
                                },
                                {
                                    key: 'waktu',
                                    title: 'Waktu Mengerjakan',
                                    itemAlign: 'center',
                                    width: 160,
                                    align: 'center',
                                    dataIndex: 'open_from',
                                    renderType: 'string',
                                    render(value, record, index) {
                                        return (
                                            <p>{moment(value).format('DD MMM YYYY - HH:mm')}</p>
                                        )
                                    }
                                },
                                {
                                    key: 'description',
                                    title: 'Keterangan Ujian',
                                    itemAlign: 'center',
                                    width: 200,
                                    align: 'center',
                                    dataIndex: 'title',
                                    renderType: 'string'
                                },
                                {
                                    key: 'nilai',
                                    title: 'Nilai Hasil',
                                    itemAlign: 'center',
                                    width: 120,
                                    align: 'center',
                                    dataIndex: 'description',
                                    renderType: 'string'
                                },
                                {
                                    key: 'detail',
                                    title: 'Detail',
                                    itemAlign: 'center',
                                    width: 160,
                                    align: 'center',
                                    render(value, record, index) {
                                        return (
                                            <div className='flex justify-center items-center'>
                                                {
                                                    value?.status === 'finish' ?
                                                        <LynxButtons title="Lihat Hasil" typeButton='primary' onClick={() => router.push(getPath('resultStart', { examID: record?.id }))} />
                                                        : value?.status === 'verified' ?
                                                            <LynxButtons title="Mulai Ujian" typeButton='primary-300' onClick={() => router.push(getPath('examStart', { examID: record?.id }))} />
                                                            : value?.status === 'start' ?
                                                                <LynxButtons title="Lanjutkan Ujian" typeButton='primary-300' onClick={() => router.push(getPath('examStart', { examID: record?.id }))} />
                                                                : ''
                                                }
                                            </div>
                                        )
                                    }
                                }
                            ]}
                        />
                    </div>
                </div>
                :
                <div>
                    <div>
                        <div className='flex items-center justify-between'>
                            <p className='text-base-color font-bold text-lg'>Ujian Saya</p>
                            {windowWidth <= 640 &&
                                <LynxButtons onClick={() => router.replace('/page/dashboard/tryout/schedules')} title=' Lihat list ujian' size='large' />
                            }
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='w-[320px] mt-3'>
                                <LynxInput prefix={<Icons type='SearchOutlined' size={18} />} placeholder='Search' standart={false} onChange={(v: any) => props?.setKeyword(v.target.value)} />
                            </div>
                            {windowWidth > 640 &&
                                <LynxButtons onClick={() => router.replace('/page/dashboard/tryout/schedules')} title=' Lihat list ujian' size='large' />
                            }
                        </div>
                        <div className='mt-5 flex flex-col gap-5'>
                            {loading ?
                                Array.from({ length: 10 }).map((item: any, index) => {
                                    return <div key={index} className='text-base-color shadow-md p-2 w-full'>
                                        <Skeleton active />
                                    </div>
                                })
                                : state?.listOwnedExam?.length === 0 ?
                                    <div className='flex justify-center items-center mt-32 w-full '>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                    : state?.listOwnedExam?.map((item: any, idx: number) => (
                                        <div key={idx} className='text-base-color shadow-md p-2 w-full'>
                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <p className='font-semibold text-sm'>{item?.title}</p>
                                                    <p className='font-normal text-xs'>{moment(item?.created_at).format('DD MMM YYYY - HH:mm')}</p>
                                                </div>
                                                <div className='flex items-center justify-center rounded bg-[#ED7020] px-2 py-[2px]'>
                                                    <p className='font-semibold text-sm text-white'>{item?.type}</p>
                                                </div>
                                            </div>
                                            <div className='flex justify-center items-center mt-5'>
                                                {
                                                    item?.status === 'finish' ?
                                                        <LynxButtons className='!w-full' size='small' title="Lihat Hasil" typeButton='primary' onClick={() => router.push(getPath('resultStart', { examID: item?.id }))} />
                                                        : item?.status === 'verified' ?
                                                            <LynxButtons className='!w-full' size='small' title="Mulai Ujian" typeButton='primary-300' onClick={() => router.push(getPath('examStart', { examID: item?.id }))} />
                                                            : item?.status === 'start' ?
                                                                <LynxButtons className='!w-full' size='small' title="Lanjutkan Ujian" typeButton='primary-300' onClick={() => router.push(getPath('examStart', { examID: item?.id }))} />
                                                                : ''
                                                }
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div >
            }
        </>
    )
}