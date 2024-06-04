import { useState, useEffect } from 'react';
import { Col, Image, Row, Spin } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { LynxButtons } from '@afx/components/common/button/button';
import { LynxCards } from '@afx/components/common/card/card';
import { IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface';
import LynxStorages from '@afx/utils/storage.util';
import getPath from '@lynx/const/router.path';
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import JSZip from 'jszip';
import { WarningNotif } from '@afx/components/common/notification/warning';
import LynxKatex from '@afx/components/common/katex-editor/katex-render.layout';

export default function Discussion() {
  const [profile, setProfile] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<any>({});
  const router = useRouter();
  const { examID: params }: { examID: string } = useParams() as any
  const { state, useActions: schedules } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule');
  const { state: examData, useActions: exams, isLoading } = useLynxStore<IStateExam, IActionExam>('exam');
  const [isAttachment, setIsAttachment] = useState<boolean>(false)
  const loading = isLoading('getListExamDiscussion') || false
  let questionCounter = 0;

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
        setTimeout(() => {
          fetchImages()
        }, 700)
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

  useEffect(() => {
    const tempData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0];
    setProfile(tempData);
    schedules<'getDetailExam'>('getDetailExam', [params], true)
    deleteDatabase('images')
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (state?.formRegister === undefined || Object.keys(state?.formRegister).length === 0) {
      schedules<'getFormRegister'>('getFormRegister', [params], true)
    }
  }, [state?.formRegister])

  useEffect(() => {
    if (Object.keys(state?.formRegister).length !== 0) {
      const params: IReqSaveAnswer = {
        registerID: state?.formRegister?.exam?.id,
        scheduleID: state?.formRegister?.id
      }
      exams<'getListExamDiscussion'>('getListExamDiscussion', [params], true)
      exams<'getAnswer'>('getAnswer', [params], true)
      exams<'getAttachment'>('getAttachment', [params, (status: number, data: any) => {
        if (status === 200) {
          saveImageToIndexedDB(data)
          setIsAttachment(true)
        } else {
          setIsAttachment(false)
        }
      }], true)
    }
  }, [state?.formRegister])

  const getImage = (key: any) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('images', 1);

      request.onerror = function () {
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        const db = event.target.result;


        const transaction = db.transaction(['Images'], 'readonly');
        const objectStore = transaction.objectStore('Images');
        const getRequest = objectStore.get(key);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const url = URL.createObjectURL(getRequest.result.blob);
            resolve(url);
          } else {
            resolve(null);
          }
        };

        getRequest.onerror = function () {
          reject('Error retrieving data');
        };
      };
    });
  };


  const fetchImages = async () => {
    const newImageUrls = {} as any;

    for (const section of examData?.listDiscussion?.sections || []) {
      for (const vintage of section.vintages || []) {
        for (const question of vintage.questions || []) {
          if (question?.attachment?.filename) {
            const url = await getImage(question.attachment.filename);
            newImageUrls[question.attachment.filename] = url;
          }
        }
      }
    }

    setImageUrls(newImageUrls);
  };




  return (
    <Row gutter={[10, 20]}>
      <Col span={24}>
        <p className='text-base-color font-bold text-xl'>Pembahasan Ujian</p>
      </Col>
      <Col xs={24} md={24} lg={12}>
        <div className='text-base-color mt-8'>
          <p>{profile?.name}</p>
          <p className='text-base font-semibold mt-1'>{state?.detailSchedule?.title}</p>
        </div>
      </Col>
      <Col xs={24} md={24} lg={12} >
        <div className='flex items-center justify-end'>
          <LynxButtons title="Lihat Hasil Ujian" onClick={() => router.push(getPath('resultStart', { examID: params }))} />
        </div>
      </Col>
      <Col span={24}>
        <LynxCards>
          <Spin spinning={loading} size='large' >
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <p className='font-semibold'>Daftar Soal Ujian</p>
              </Col>
              <Col span={24}>
                {examData?.listDiscussion?.sections?.map((section: any, idx: number) => (
                  section?.vintages?.map((vintage: any, idxV: number) => (
                    vintage?.questions?.map((question: any, idxQ: number) => {
                      questionCounter++
                      return (
                        // question.type === 'multiple_choice' ? (
                        <div key={idxQ} className='flex gap-5 mb-5'>
                          <p>{questionCounter}</p>
                          <div>
                            <div>
                              {question?.attachment !== null && (
                                <>
                                  {imageUrls[question.attachment.filename] ? (
                                    <Image alt='test' src={imageUrls[question.attachment.filename]} style={{ width: '200px' }} />
                                  ) : (
                                    <p>Loading...</p>
                                  )}
                                </>
                              )}
                              <div dangerouslySetInnerHTML={{ __html: question?.question }} />
                              {/* <LynxKatex text={question?.question} /> */}
                              <p>{section?.scoring_type === 'question_base' && `Point : ${question?.point}`}</p>
                            </div>
                            {question?.options?.map((option: any, idxO: number) => (
                              <div key={idxO} className='flex gap-2'>
                                <p className={examData?.answers?.find((ans: any) => ans.option_id === option.id) ? 'text-red-700' : 'text-base-color'}>{String.fromCharCode(idxO + 65)}.</p>
                                <p className={examData?.answers?.find((ans: any) => ans.option_id === option.id) ? 'text-red-700' : 'text-base-color'}>{option?.option} {section?.scoring_type === 'option_base' && `Point : ${option?.point}`}</p>
                              </div>
                            ))}
                            <div className='mt-2 text-[#477C82]'>
                              <p className='text-black'>Kunci Jawaban & Pembahasan :</p>
                              <div className='flex gap-10 '>
                                <p className='font-bold min-w-[76px] flex-wrap'> Kunci </p>
                                <p className='text-[12px]'>: {question?.options?.map((item: any, idx: number) => item?.is_correct && item?.option)}</p>
                              </div>
                              <div className='flex gap-10 '>
                                <p className='font-bold min-w-[76px] flex-wrap'> Materi </p>
                                <p className='text-left text-[12px]'>: {section?.name.slice(0, 10)}</p>
                              </div>
                              <div className=''>
                                <p className='font-bold min-w-[76px] flex-wrap'> Pembahasan </p>
                                <div dangerouslySetInnerHTML={{ __html: question?.discussion_content }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        // ) : (
                        //   's'
                        // )
                      )
                    })
                  ))
                ))}
              </Col>
            </Row>
          </Spin>
        </LynxCards>
      </Col>
    </Row >
  );
}
