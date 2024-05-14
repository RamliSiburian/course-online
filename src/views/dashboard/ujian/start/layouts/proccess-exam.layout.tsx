import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import SimpleTable from '@afx/components/common/simple-table/table.layout';
import { CountdownTimer } from '@afx/components/common/typography/count-time.layout';
import LynxStorages from '@afx/utils/storage.util'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import { Radio, RadioChangeEvent, Space } from 'antd';
import { useEffect, useState } from 'react';

interface IProccessExam {
    handleAnswer: (data: any) => void
    responseCode: number | undefined
}
export function ProccessExam(props: IProccessExam): React.JSX.Element {
    const question = LynxStorages.getItem('ADZKIA@QUESTION', true, true).data[0]
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam')
    const saveLoading = examLoading('saveAnswer') || false
    const [sectionsIndex, setSectionIndex] = useState<number>(0)
    const [vintagesIndex, setVintagesIndex] = useState<number>(0)
    const [questionIndex, setQuestionIndex] = useState<number>(0)
    const [disableNextButton, setDisableNextButton] = useState<boolean>(true)
    const [statementOption, setStatementOption] = useState<Array<any>>([])

    useEffect(() => {
        if (props?.responseCode === 200) {
        } else {

        }
    }, [props?.responseCode])

    const handleNext = () => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions?.length > questionIndex + 1) {
            setQuestionIndex(questionIndex + 1)
        } else if (question?.sections[sectionsIndex]?.vintages?.length > vintagesIndex + 1) {
            setVintagesIndex(vintagesIndex + 1)
            setQuestionIndex(0)
        } else if (question?.sections?.length > sectionsIndex + 1) {
            setSectionIndex(sectionsIndex + 1)
            setVintagesIndex(0)
            setQuestionIndex(0)
        } else { }

        setDisableNextButton(true)
    }
    const validationButton = (e: any, type: string) => {
        if (type === 'multiple_choice') {
            setDisableNextButton(false)
        } else if (type === 'statement') {

            if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options?.length === statementOption?.length) {
                setDisableNextButton(false)
            }
        }

    }

    const handleStatement = (e: any, record: any, type: string) => {
        const tempOption = {
            question_id: record?.question_id,
            option_id: record?.id,
            is_correct: e.target.value
        };
        setStatementOption(prevOptions => {
            const index = prevOptions.findIndex(option => option.option_id === tempOption.option_id);
            if (index !== -1) {
                const existingOption = prevOptions[index];
                if (existingOption.is_correct !== tempOption.is_correct) {
                    const updatedOptions = [...prevOptions];
                    updatedOptions[index] = tempOption;
                    return updatedOptions;
                }
                return prevOptions;
            } else {
                return [...prevOptions, tempOption];
            }
        });

        setTimeout(() => {
            validationButton(null, type)
        }, 500)
    }




    // console.log({ sectionsIndex, vintagesIndex, questionIndex, question, ss: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options });
    console.log({ statementOption });

    return (
        <div className='shadow-xl p-8 h-full' >
            <div>
                <p className='text-base-color font-semibold text-lg'><Icons size={16} type='MenuOutlined' /> &nbsp; {state?.detailSchedule?.title}</p>
            </div>
            <div className='flex items-center justify-between mt-5  '>
                <p className='text-base-color text-xs'>{state?.detailSchedule?.description} </p>
                <p className='text-base-color text-xs'>Akan berakhir dalam <CountdownTimer initialMinutes={question?.duration} />  </p>
            </div>

            {question?.sections?.length !== 0 &&
                <>
                    {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content === null ? '' :
                        <>
                            <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Vintages </p>
                            <div dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content }} />
                        </>
                    }

                    {
                        question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null || question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions?.length !== 0 ?
                            <>
                                <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Soal Nomor {questionIndex + 1} </p>
                                <div className='text-base-color font-semibold text-xs mt-5 mb-5' dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question }} />
                                {/* <p className='text-base-color font-semibold text-xs mt-5 mb-5'> </p> */}
                                {
                                    question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'multiple_choice' ?
                                        <Radio.Group disabled={saveLoading} onChange={(e: RadioChangeEvent) => {
                                            props?.handleAnswer(e)
                                            validationButton(e, question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type)
                                        }} >
                                            <Space direction="vertical">
                                                {
                                                    question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options?.map((item: any, idx: number) => {
                                                        return (
                                                            <Radio value={item} key={idx}>{item?.option}. {item?.answer}</Radio>
                                                        )
                                                    })
                                                }
                                            </Space>
                                        </Radio.Group>
                                        : question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'statement' ?
                                            <SimpleTable
                                                pagination={false}
                                                action={false}
                                                dataSource={question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options || []}
                                                columns={[
                                                    {
                                                        key: 'answer',
                                                        title: 'Pernyataan',
                                                        width: 200,
                                                        align: 'left',
                                                        dataIndex: 'answer',
                                                        renderType: 'string'
                                                    },
                                                    {
                                                        key: 'a',
                                                        title:
                                                            <div className='flex items-center justify-around'>
                                                                <p>Benar</p>
                                                                <p>Salah</p>
                                                            </div>,
                                                        width: 120,
                                                        align: 'left',
                                                        dataIndex: 'answer',
                                                        renderType: 'string',
                                                        render(_, record, idx) {
                                                            return (
                                                                <Radio.Group className='flex items-center justify-around' onChange={(e: any) => handleStatement(e, record, question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type)}>
                                                                    <Radio value={true}></Radio>
                                                                    <Radio value={false}></Radio>
                                                                </Radio.Group>
                                                            )
                                                        }
                                                    }
                                                ]}
                                                LOADINGS={false}
                                                minHeight={400}
                                            />
                                            : 'b'
                                }
                            </>
                            : ''
                    }

                    <div className='mt-10 flex gap-4'>
                        <LynxButtons disabled={saveLoading} title="Lewati" className='!w-full' iconType='FastForwardOutlined' typeButton='primary-300' />
                        <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={handleNext} />
                    </div>
                </>
            }
        </div>
    )
}