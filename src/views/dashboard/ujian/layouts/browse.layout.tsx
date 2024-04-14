import { Icons } from '@afx/components/common/icons';
import LynxInput from '@afx/components/common/input/input';
import LynxCurrency from '@afx/components/common/typography/currency.layout';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Button, Card, Image } from 'antd';
import { useRouter } from 'next/navigation';

interface IListSchedule {

}
export default function ListSchedule(props: IListSchedule): React.JSX.Element {
    const { state } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const router = useRouter()
    return (
        <div className='shadow-2xl p-4 min-h-screen' >
            <div className='flex justify-between'>
                <div className='flex items-center gap-4'>
                    <Icons onClick={() => router.replace('/page/dashboard/ujian')} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
                    <p className='text-base-color font-bold text-xl'>Jadwal Ujian</p>
                </div>
                <div className='w-[320px]'>
                    <LynxInput prefix={<Icons type='SearchOutlined' size={18} />} placeholder='Search' standart={false} />
                </div>
            </div>
            <div className='flex gap-8 flex-wrap mt-5' >
                {state?.listSchedule?.map((item, idx) => (
                    <Card
                        key={idx}
                        hoverable
                        style={{ minWidth: 260, overflow: 'hidden', cursor: 'default' }}
                        cover={<Image height={200} alt="example" src="https://klik-adzkia.com/assets/assets/images/no_thumbnail/tryout.jpg" />}
                    >
                        {item?.price === null && <div className='absolute w-[200px] flex items-end pb-3 justify-center h-[72px] top-[-16px] left-[-84px] bg-secondary-color' style={{ transform: 'rotate(-40deg)' }}>
                            <p className='text-[#fff] text-base font-bold '>Gratis</p>
                        </div>}
                        <p className='text-base-color'>{item?.title}</p>
                        <div className='mt-2 flex justify-between items-center gap-4'>
                            {item?.price !== null &&
                                <p className='text-base-color font-bold w-full '>
                                    <LynxCurrency value={item?.price} prefix='Rp.' />
                                </p>
                            }
                            <Button type='primary' className='w-full !bg-secondary-color'>
                                Ikuti Sekarang
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}