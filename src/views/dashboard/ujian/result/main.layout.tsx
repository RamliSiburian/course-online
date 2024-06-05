import { LynxButtons } from '@afx/components/common/button/button'
import { LynxCards } from '@afx/components/common/card/card'
import LynxPieChart from '@afx/components/common/charts/pie'
import { Icons } from '@afx/components/common/icons'
import { IReqExamQuestion, IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import LynxStorages from '@afx/utils/storage.util'
import getPath from '@lynx/const/router.path'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import { Col, Row, Skeleton, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css';
import { SuccessNotif } from '@afx/components/common/notification/success'
import JSZip from 'jszip'
import { WarningNotif } from '@afx/components/common/notification/warning'

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
  const [isQuestion, setIsQuestion] = useState<boolean>(false)
  const [isAttachment, setIsAttachment] = useState<boolean>(false)
  const [isStart, setisStart] = useState<boolean>(false)

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


  const isImageFile = (fileName: any) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const saveToIndexedDB = (relativePath: string, blob: any) => {

    const request = window.indexedDB.open('images', 1);

    request.onerror = function (event) {
    };

    request.onupgradeneeded = function (event: any) {
      var db = event.target.result;

      var objectStore = db.createObjectStore('Images', { keyPath: 'id' });
    };

    request.onsuccess = function (event: any) {
      var db = event.target.result;

      // Insert data into the object store
      var transaction = db.transaction(['Images'], 'readwrite');
      var objectStore = transaction.objectStore('Images');

      var request = objectStore.put({ 'id': relativePath, blob });

      request.onsuccess = function (event: any) {
      };

      request.onerror = function (event: any) {
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

  const deleteDatabase = (dbName: any) => {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(dbName);

      deleteRequest.onerror = (event) => {
        reject('Error deleting database');
      };

      deleteRequest.onsuccess = (event) => {
        resolve('Database deleted successfully');
      };

      deleteRequest.onblocked = (event) => {
        reject('Database deletion blocked');
      };
    });
  };

  const startExam = () => {
    deleteDatabase('images')
    const paramsQuestion: IReqExamQuestion = {
      registerID: state?.formRegister?.exam?.id,
      scheduleID: params
    }
    exams<'getListExamQuestion'>('getListExamQuestion', [paramsQuestion, (status: number) => {
      if (status === 200) {
        SuccessNotif({ key: 'LIST-QUESTION', message: 'Success', description: 'Question has been downloaded' })
        setIsQuestion(true)
      } else {
        setIsQuestion(false)
      }
    }], true)

    exams<'getAttachment'>('getAttachment', [paramsQuestion, (status: number, data: any) => {
      if (status === 200) {
        saveImageToIndexedDB(data)
        SuccessNotif({ key: 'LIST-ATTACHMENT', message: 'Success', description: 'Attachment has been downloaded' })
        setIsAttachment(true)
      } else if (status === 404) {
        setIsAttachment(true)
      } else {
        setIsAttachment(false)
      }
    }], true)
  }


  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className='flex items-center gap-4 mb-10'>
          <Icons onClick={() => router.push(getPath('scheduleDetail', { scheduleID: params }))} style={{ color: '#2d4379', fontWeight: 'bold' }} type='ArrowLeftOutlined' size={18} />
          <p className='text-base-color font-bold text-xl'>Hasil Ujian</p>
        </div>
      </Col>
      <Col xs={24} lg={16}>
        <div className='text-base-color'>
          <p>Halo, {profile?.name}</p>
          <p className='text-base font-semibold'>Berikut hasil ujian {examData?.resultExam?.schedule?.title} kamu</p>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className='w-full flex gap-5 sm:justify-between lg:justify-end'>
          {examData?.resultExam?.is_discussion &&
            <LynxButtons title='Pembahasan' className='!w-full lg:!w-32 !px-4 ' iconType='SolutionOutlined' onClick={() => router.push(getPath('discussion', { examID: params }))} />
          }
          {examData?.resultExam?.repeatable &&
            <LynxButtons onClick={() => router.push(getPath('examStart', { examID: params }))} title='Ulangi lagi' iconType='ReloadOutlined' className='!w-full lg:!w-32' typeButton='danger' />
          }
        </div>
      </Col>

      <Col span={24}>
        {/* <Latex macros={{ '\\f': '\cup ' }}>{'$\\f\\relax{x} = x$ is rendered using macros'}</Latex> */}
      </Col>

      {
        loading ?
          <div className='flex gap-8 flex-wrap mt-5' >
            {Array.from({ length: 10 }).map((item: any, index) => {
              return <div key={index} className='flex flex-col gap-2 items-center w-[256px] ' >
                <Skeleton.Image active className='!w-full !h-[240px]' />
                <Skeleton.Input active block />
                <Skeleton.Button active block />
              </div>
            })
            }
          </div>
          : examData?.resultExam?.detail_exam?.sections !== 0 &&
          examData?.resultExam?.detail_exam?.sections?.map((data: any, idx: number) => (
            <Col xs={24} md={12} key={idx} >
              <LynxCards className='mt-10'>
                <LynxPieChart data={data} />
                <p className='-mt-10 text-base-color font-semibold'>{data?.title}</p>
                <div className='mt-2 text-base-color' >
                  <Row gutter={[0, 10]} >
                    <Col span={12}><p className='font-normal text-xs'>Jumlah Soal</p></Col>
                    <Col span={12}><p className='font-normal text-xs'>: {data?.correct + data?.wrong + data?.skipped}</p></Col>
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