import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import LynxInput from '@afx/components/common/input/input';
import SimpleTable from '@afx/components/common/simple-table/table.layout';
import getPath from '@lynx/const/router.path';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Divider } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface IBrowseUjian {

}
export default function Browse(props: IBrowseUjian): React.JSX.Element {
    const router = useRouter()
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const loading = isLoading('getListOwnedExam') || false

    return (
        <div className='shadow-2xl p-4 min-h-screen' >
            <p className='text-base-color font-bold text-lg'>Ujian Saya</p>
            <Divider />
            <div className='flex justify-between items-center'>
                <div className='w-[320px]'>
                    <LynxInput prefix={<Icons type='SearchOutlined' size={18} />} placeholder='Search' standart={false} />
                </div>
                <LynxButtons onClick={() => router.replace('/page/dashboard/tryout/schedules')} title=' Lihat list ujian' size='large' />
            </div>
            <div className='flex gap-8 flex-wrap mt-5' >
                <SimpleTable
                    action={false}
                    LOADINGS={loading}
                    dataSource={state?.listOwnedExam}
                    minHeight={500}
                    pagination={true}
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
                            width: 80,
                            align: 'center',
                            dataIndex: 'open_from',
                            renderType: 'string',
                            render(value, record, index) {
                                return (
                                    <p>{moment(value).format('DD MMM YYY - HH:mm')}</p>
                                )
                            }
                        },
                        {
                            key: 'description',
                            title: 'Keterangan Ujian',
                            itemAlign: 'center',
                            width: 80,
                            align: 'center',
                            dataIndex: 'description',
                            renderType: 'string'
                        },
                        {
                            key: 'nilai',
                            title: 'Nilai Hasil',
                            itemAlign: 'center',
                            width: 80,
                            align: 'center',
                            dataIndex: 'description',
                            renderType: 'string'
                        },
                        {
                            key: 'detail',
                            title: 'Detail',
                            itemAlign: 'center',
                            width: 80,
                            align: 'center',
                            render(value, record, index) {
                                return (
                                    <div className='flex justify-center items-center'>
                                        <LynxButtons title="Lihat Hasil" typeButton='primary-300' onClick={() => router.push(getPath('resultStart', { examID: record?.id }))} />
                                    </div>
                                )
                            }
                        }
                    ]}
                />
            </div>
        </div>
    )
}