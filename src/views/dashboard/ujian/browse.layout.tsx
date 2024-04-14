import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import LynxInput from '@afx/components/common/input/input';
import SimpleTable from '@afx/components/common/simple-table/table.layout';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Divider } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface IBrowseUjian {

}
export default function Browse(props: IBrowseUjian): React.JSX.Element {
    const router = useRouter()
    const { state } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')

    return (
        <div className='shadow-2xl p-4 min-h-screen' >
            <p className='text-base-color font-bold text-lg'>Ujian Saya</p>
            <Divider />
            <div className='flex justify-between items-center'>
                <div className='w-[320px]'>
                    <LynxInput prefix={<Icons type='SearchOutlined' size={18} />} placeholder='Search' standart={false} />
                </div>
                <LynxButtons onClick={() => router.replace('/page/dashboard/ujian/schedules')} title='Tambah Ujian' iconType='PlusOutlined' size='large' />
            </div>
            <div className='flex gap-8 flex-wrap mt-5' >
                <SimpleTable
                    action={false}
                    LOADINGS={false}
                    dataSource={[]}
                    minHeight={500}
                    pagination={true}
                    columns={[
                        {
                            key: 'no',
                            title: 'No'
                        },
                        {
                            key: 'title',
                            title: 'Title'
                        },
                        {
                            key: 'status',
                            title: 'Status'
                        },
                        {
                            key: 'score',
                            title: 'Score'
                        }
                    ]}
                />
            </div>
        </div>
    )
}