import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import LynxPieChart from '@afx/components/common/charts/pie'
import { Icons } from '@afx/components/common/icons'
import { IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import LynxStorages from '@afx/utils/storage.util'
import getPath from '@lynx/const/router.path'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Col, Row, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResultExam(): React.JSX.Element {
  const [profile, setProfile] = useState<any>(null)
  useEffect(() => {
    const tempData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0]
    setProfile(tempData)
  }, [])
  const router = useRouter()
  const { examID: params }: { examID: string } = useParams() as any
  const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
  const { state: examData, useActions: exams, isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam');
  const loading = examLoading('getResultExam') || scheduleloading('getFormRegister') || false

  useEffect(() => {
    if (Object.keys(state?.formRegister).length === 0) {
      schedules<'getFormRegister'>('getFormRegister', [params], true)
    }
  }, [state?.formRegister])

  useEffect(() => {
    if (Object.keys(state?.formRegister).length !== 0) {
      const params: IReqSaveAnswer = {
        registerID: state?.formRegister?.exam?.id,
        scheduleID: state?.formRegister?.id
      }
      exams<'getResultExam'>('getResultExam', [params, (code: number) => {
        if (code === 200) {

        }
      }], true)
    }
  }, [state?.formRegister])

  console.log({ dd: examData?.resultExam });

  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <div className='flex items-center gap-4 mb-10'>
          <Icons onClick={() => router.push(getPath('scheduleDetail', { scheduleID: params }))} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
          <p className='text-base-color font-bold text-xl'>Hasil Ujian</p>
        </div>
      </Col>
      <Col span={16}>
        <div className='text-base-color'>
          <p>Halo, {profile?.name}</p>
          <p className='text-base font-semibold'>Berikut hasil ujian {examData?.resultExam?.schedule?.title} kamu</p>
        </div>
      </Col>
      <Col span={8}>
        <div className='flex gap-5'>
          {examData?.resultExam?.is_discussion &&
            <LynxButtons title='Pembahasan' className='!w-32 !px-4 ' iconType='SolutionOutlined' />
          }
          {examData?.resultExam?.repeatable &&
            <LynxButtons title='Ulangi lagi' iconType='ReloadOutlined' className='!w-32' typeButton='danger' />
          }
        </div>
      </Col>

      {
        examData?.resultExam?.detail_exam?.sections !== 0 &&
        examData?.resultExam?.detail_exam?.sections?.map((data: any, idx: number) => (
          <Col span={8} key={idx}>
            <LynxCards className='!min-h-[400px]'>
              <LynxPieChart data={data} />
              {/* <p className='text-base font-semibold'>Berikut hasil ujian {examData?.resultExam?.schedule?.title} kamu</p> */}
            </LynxCards>
            d
          </Col>
        ))
      }
      <Col span={8}></Col>
      <Col span={8}></Col>
    </Row>
  )
}