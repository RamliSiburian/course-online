import { useState, useEffect } from 'react';
import { Col, Image, Row } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { LynxButtons } from '@afx/components/common/button/button';
import { LynxCards } from '@afx/components/common/card/card';
import { IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface';
import LynxStorages from '@afx/utils/storage.util';
import getPath from '@lynx/const/router.path';
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';

export default function Discussion() {
  const [profile, setProfile] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const router = useRouter();
  const { examID: params } = useParams();
  const { state, useActions: schedules } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule');
  const { state: examData, useActions: exams } = useLynxStore<IStateExam, IActionExam>('exam');

  useEffect(() => {
    const tempData = LynxStorages.getItem('ADZKIA@SIMPLEPROFILE', true, true).data[0];
    setProfile(tempData);
  }, []);

  useEffect(() => {
    schedules('getDetailExam', [params], true);
  }, []);

  useEffect(() => {
    if (!state?.formRegister || Object.keys(state.formRegister).length === 0) {
      schedules('getFormRegister', [params], true);
    }
  }, [state?.formRegister]);

  useEffect(() => {
    if (Object.keys(state?.formRegister).length !== 0) {
      const params: IReqSaveAnswer = {
        registerID: state?.formRegister?.exam?.id,
        scheduleID: state?.formRegister?.id
      };
      exams('getListExamDiscussion', [params], true);
    }
  }, [state?.formRegister]);
  const getImage = (key) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('images', 1);

      request.onerror = function () {
        console.log('Error opening database');
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
            console.log('No data found with the specified key');
            resolve(null);
          }
        };

        getRequest.onerror = function () {
          console.log('Error retrieving data');
          reject('Error retrieving data');
        };
      };
    });
  };


  useEffect(() => {
    const fetchImages = async () => {
      const newImageUrls = {};

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

    if (examData?.listDiscussion) {
      fetchImages();
    }
  }, [examData?.listDiscussion]);

  return (
    <Row gutter={[10, 20]}>
      <Col span={24}>
        <p className='text-base-color font-bold text-xl'>Pembahasan Ujian</p>
      </Col>
      <Col span={24}>
        <div className='flex items-center justify-between'>
          <div className='text-base-color mt-10'>
            <p>{profile?.name}</p>
            <p className='text-base font-semibold mt-1'>{state?.detailSchedule?.title}</p>
          </div>
          <LynxButtons title="Lihat Hasil Ujian" onClick={() => router.push(getPath('resultStart', { examID: params }))} />
        </div>
      </Col>
      <Col span={24}>
        <LynxCards>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <p className='font-semibold'>Daftar Soal Ujian</p>
            </Col>
            <Col span={24}>
              {examData?.listDiscussion?.sections?.map((section, idx) => (
                section.vintages.map((vintage, idxV) => (
                  vintage.questions.map((question, idxQ) => (
                    question.type === 'multiple_choice' ? (
                      <div key={idxQ} className='flex gap-5 mb-5'>
                        <p>{idx + idxV + idxQ + 1}</p>
                        <div>
                          <div>
                            {question?.attachment !== null && (
                              <>
                                {imageUrls[question.attachment.filename] ? (
                                  <Image alt='test' src={imageUrls[question.attachment.filename]} />
                                ) : (
                                  <p>Loading...</p>
                                )}
                              </>
                            )}
                            <div dangerouslySetInnerHTML={{ __html: question?.question }} />
                            <p>{section?.scoring_type === 'question_base' && `Point : ${question?.point}`}</p>
                          </div>
                          {question?.options?.map((option, idxO) => (
                            <div key={idxO} className='flex gap-2'>
                              <p>{String.fromCharCode(idxO + 65)}.</p>
                              <p>{option?.option} {section?.scoring_type === 'option_base' && `Point : ${option?.point}`}</p>
                            </div>
                          ))}
                          <div className='mt-2 text-[#477C82]'>
                            <p className='text-black'>Kunci Jawaban & Pembahasan :</p>
                            <div className='flex gap-10 '>
                              <p className='font-bold min-w-[100px] flex-wrap'> Kunci </p>
                              <p>: {question[idxQ]?.answer}</p>
                            </div>
                            <div className='flex gap-10 '>
                              <p className='font-bold min-w-[100px] flex-wrap'> Materi </p>
                              <p>: {section?.name}</p>
                            </div>
                            <div className=''>
                              <p className='font-bold min-w-[100px] flex-wrap'> Pembahasan </p>
                              <div dangerouslySetInnerHTML={{ __html: question?.discussion_content }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      's'
                    )
                  ))
                ))
              ))}
            </Col>
          </Row>
        </LynxCards>
      </Col>
    </Row>
  );
}
