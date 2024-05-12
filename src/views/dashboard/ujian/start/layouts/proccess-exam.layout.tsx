import { Icons } from '@afx/components/common/icons';
import LynxStorages from '@afx/utils/storage.util'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import { Radio, RadioChangeEvent, Space } from 'antd';
import { useState } from 'react';

interface IProccessExam {

}
export function ProccessExam(props: IProccessExam): React.JSX.Element {
    const question = LynxStorages.getItem('ADZKIA@QUESTION', true, true).data[0]
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const [sectionsIndex, setSectionIndex] = useState<number>(0)
    const [vintagesIndex, setVintagesIndex] = useState<number>(0)
    const [questionIndex, setQuestionIndex] = useState<number>(0)
    console.log({ question });

    const handleSaveAnswer = (e: RadioChangeEvent) => {
        console.log('ds', e.target.value);
    }

    return (
        <div className='shadow-xl p-8 h-full' >
            <div>
                <p className='text-base-color font-semibold text-lg'><Icons size={16} type='MenuOutlined' /> &nbsp; {state?.detailSchedule?.title}</p>
            </div>
            <div className='flex items-center justify-between mt-5  '>
                <p className='text-base-color text-xs'>{state?.detailSchedule?.description} </p>
                <p className='text-base-color text-xs'>Akan berakhir dalam {question?.duration} </p>
            </div>

            {question?.sections?.length !== 0 &&
                <>
                    {question?.sections[0]?.vintages[0]?.content === null ? '' :
                        <>
                            <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Vintages </p>
                            <div dangerouslySetInnerHTML={{ __html: question?.sections[0]?.vintages[0]?.content.replace('\\', '') }} />
                        </>
                    }

                    {
                        question?.sections[0]?.vintages[0]?.questions !== null || question?.sections[0]?.vintages[0]?.questions?.length !== 0 ?
                            <>
                                <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Soal Nomor {questionIndex + 1} </p>
                                <p className='text-base-color font-semibold text-xs mt-5 mb-5'> {question?.sections[0]?.vintages[0]?.questions[0]?.question}</p>
                                {
                                    question?.sections[0]?.scoring_type === 'question_base' ?
                                        <Radio.Group onChange={handleSaveAnswer} >
                                            <Space direction="vertical">
                                                {
                                                    question?.sections[0]?.vintages[0]?.questions[0]?.options?.map((item: any, idx: number) => {
                                                        return (
                                                            <Radio value={item?.option} key={idx}>{item?.option}. {item?.answer}</Radio>
                                                        )
                                                    })
                                                }
                                            </Space>
                                        </Radio.Group>
                                        : 'b'
                                }
                            </>
                            : ''
                    }
                </>
            }
        </div>
    )
}