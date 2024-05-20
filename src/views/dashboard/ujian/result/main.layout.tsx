import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import LynxPieChart from '@afx/components/common/charts/pie'
import { Icons } from '@afx/components/common/icons'
import LynxKatexEditor from '@afx/components/common/katex-editor/katex-editor'
import { IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import LynxStorages from '@afx/utils/storage.util'
import getPath from '@lynx/const/router.path'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Col, Row, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css';

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
            <LynxButtons title='Pembahasan' className='!w-32 !px-4 ' iconType='SolutionOutlined' onClick={() => router.push(getPath('discussion', { examID: params }))} />
          }
          {examData?.resultExam?.repeatable &&
            <LynxButtons title='Ulangi lagi' iconType='ReloadOutlined' className='!w-32' typeButton='danger' />
          }
        </div>
      </Col>

      <Col span={24}>
        {/* <Latex macros={{ '\\f': '\cup ' }}>{'$\\f\\relax{x} = x$ is rendered using macros'}</Latex> */}
      </Col>

      {
        examData?.resultExam?.detail_exam?.sections !== 0 &&
        examData?.resultExam?.detail_exam?.sections?.map((data: any, idx: number) => (
          <Col span={8} key={idx} >
            <LynxCards className='mt-10'>
              <LynxPieChart data={data} />
              <p className='-mt-10 text-base-color font-semibold'>{examData?.resultExam?.schedule?.title}</p>
              <div className='mt-2 text-base-color' >
                <Row gutter={[0, 10]} >
                  <Col span={12}><p className='font-normal text-xs'>Jumlah Soal</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>: {examData?.resultExam?.detail_exam?.total_question}</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>Benar</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>: {data?.correct}</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>Salah</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>: {data?.wrong}</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>Dilewati</p></Col>
                  <Col span={12}><p className='font-normal text-xs'>: {data?.skipped}</p></Col>
                  {/* <Col span={12}><p className='font-normal text-xs'>Min Nilai</p></Col> */}
                  {/* <Col span={12}><p className='font-normal text-xs'>: {state?.formRegister?.total_registered}/{state?.formRegister?.quota}</p></Col> */}
                </Row>
              </div>
              <div>
                {data?.is_passed ?
                  <p className='text-[#939393] text-sm text-center mt-5'>Horee, Kamu Lulus pada Materi {examData?.resultExam?.schedule?.title}</p>
                  : <p className='text-[#939393] text-sm text-center mt-5'>Yahh, Kamu Tidak Lulus pada Materi {examData?.resultExam?.schedule?.title}</p>
                }
              </div>
            </LynxCards>
          </Col>
        ))
      }

    </Row>
  )
}