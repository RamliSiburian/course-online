import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Radio, Space } from 'antd';
import SimpleTable from '@afx/components/common/simple-table/table.layout';
import { LynxButtons } from '@afx/components/common/button/button';
import { Icons } from '@afx/components/common/icons';
import { CountdownTimer } from '@afx/components/common/typography/count-time.layout';
import LynxStorages from '@afx/utils/storage.util';
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useLynxStore } from '@lynx/store/core';
import type { GetProp, InputNumberProps } from 'antd';
import LynxInput from '@afx/components/common/input/input';
import LynxInputNumber from '@afx/components/common/input/input-number.layout';

interface IProccessExam {
    handleAnswer: (data: any, type?: any) => void;
    responseCode: number | undefined;
    restartExam: (sectionID: string) => void
}

export function ProccessExam(props: IProccessExam): React.JSX.Element {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const question = LynxStorages.getItem('ADZKIA@QUESTION', true, true).data[0];
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule');
    const { isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam');
    const saveLoading = examLoading('saveAnswer') || false;
    const [sectionsIndex, setSectionIndex] = useState<number>(0);
    const [vintagesIndex, setVintagesIndex] = useState<number>(0);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [valueOption, setValueOption] = useState<any>();
    const [disableNextButton, setDisableNextButton] = useState<boolean>(true);
    const [statementOption, setStatementOption] = useState<Array<any>>([]);
    const [checkedOption, setCheckedOption] = useState<Array<any>>([]);

    useEffect(() => {
        if (props?.responseCode === 200) {
        } else {
        }
    }, [props?.responseCode]);

    const handleChangeValue = (e: any) => {
        setValueOption(e.target?.value?.id);
        props?.handleAnswer(e)
        validationButton(e, question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type)
    };

    const handleNext = () => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions?.length > questionIndex + 1) {
            setQuestionIndex(questionIndex + 1);
        } else if (question?.sections[sectionsIndex]?.vintages?.length > vintagesIndex + 1) {
            setVintagesIndex(vintagesIndex + 1);
            setQuestionIndex(0);
        } else if (question?.sections?.length > sectionsIndex + 1) {
            props?.restartExam(question?.sections[sectionsIndex + 1]?.id)
            setSectionIndex(sectionsIndex + 1);
            setVintagesIndex(0);
            setQuestionIndex(0);
        } else {
            props?.restartExam(question?.sections[sectionsIndex + 1]?.id)
        }

        setDisableNextButton(true);
        setStatementOption([]);
    };

    useEffect(() => {
        if (state?.formRegister?.exam?.status === 'verified') {
            props?.restartExam(question?.sections[0]?.id)
        } else { }
    }, [state?.formRegister])

    useEffect(() => {
        const section = question.sections.find((section: any) => section.id === state?.formRegister?.exam?.latest_section);
        if (section) {
            const sectionIndex = question.sections.indexOf(section);
            setSectionIndex(sectionIndex);
        }
    }, [])

    const validationButton = (e: any, type: string) => {
        if (type === 'multiple_choice') {
            setDisableNextButton(false);
        } else if (type === 'statement') {
        } else if (type === 'checkbox') {
            setDisableNextButton(false);
        }
    };

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
    };

    const handleOptionCheckbox: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any, type: any) => {
        setDisableNextButton(false)
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const tempOption = checkedValues.map((item: any) => ({
                question_id: item?.question_id,
                option_id: item?.id
            }));
            setCheckedOption(tempOption);
        }, 3000);
    };

    const handleEssay: InputNumberProps['onChange'] = (value) => {
        console.log('changed', value);
        setDisableNextButton(false)
        props?.handleAnswer(value, 'essay');

    };


    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options?.length === statementOption?.length) {
            setTimeout(() => {
                props?.handleAnswer(statementOption, 'statement');
            }, 3000);
            setDisableNextButton(false);
        } else if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions === null) {
            setDisableNextButton(false);
        }
        setDisableNextButton(false);

    }, [statementOption]);

    useEffect(() => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'checkbox') {
            props?.handleAnswer(checkedOption, 'checkbox');
        } else {
        }
    }, [checkedOption]);
    console.log({ question });


    return (
        <div className='shadow-xl p-8 h-full'>
            <div>
                <p className='text-base-color font-semibold text-lg'><Icons size={16} type='MenuOutlined' /> &nbsp; {state?.detailSchedule?.title}</p>
            </div>
            {state?.formRegister?.exam?.status !== 'finish' &&
                <div className='flex items-center justify-between mt-5'>
                    <p className='text-base-color text-xs'>{state?.detailSchedule?.description} </p>
                    <p className='text-base-color text-xs'>Akan berakhir dalam <CountdownTimer initialMinutes={question?.duration} />  </p>
                </div>
            }

            {
                state?.formRegister?.exam?.status === 'finish' ?
                    <div className='h-40 flex items-center justify-center flex-col'>
                        <p>Ujian Telah berakhir</p>
                        <LynxButtons disabled={false} onClick={() => { }} title="Lihat Hasil Ujian" className='!w-full mt-10' />
                    </div>
                    :
                    question?.sections?.length !== 0 && (
                        <>
                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content === null ? '' :
                                <>
                                    <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Vintages {vintagesIndex + 1} </p>
                                    <div dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content }} />
                                </>
                            }
                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'multiple_choice' && (
                                <div className='mt-5'>
                                    <div className='text-base-color' dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question }} />
                                    <Radio.Group onChange={handleChangeValue}>
                                        <Space direction="vertical">
                                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options.map((option: any) => (
                                                <Radio key={option.id} value={option}>
                                                    <span className='flex items-center gap-2'>{option.option}. <div dangerouslySetInnerHTML={{ __html: option?.answer }} /></span>
                                                </Radio>
                                            ))}
                                        </Space>
                                    </Radio.Group>
                                </div>
                            )}

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'checkbox' && (
                                <div className='mt-5'>
                                    <p className='text-lg text-base-color'>{question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question}</p>
                                    <Checkbox.Group onChange={(v: any) => handleOptionCheckbox(v, 'checkbox')}>
                                        <Space direction="vertical">
                                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options.map((option: any) => (
                                                <Checkbox key={option.id} value={option} >
                                                    {option.option}. {option?.answer}
                                                </Checkbox>
                                            ))}
                                        </Space>
                                    </Checkbox.Group>
                                </div>
                            )}

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'statement' && (
                                <div className='mt-5'>
                                    <p className='text-lg text-base-color'>{question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question}</p>
                                    <SimpleTable
                                        LOADINGS={false}
                                        minHeight={400}
                                        pagination={false}
                                        action={false}
                                        dataSource={question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options}
                                        columns={[
                                            {
                                                title: 'Statement',
                                                dataIndex: 'answer',
                                                key: 'option',
                                                align: 'center',
                                                itemAlign: 'left',
                                                renderType: 'string'
                                            },
                                            {
                                                title:
                                                    <div className='flex items-center justify-around'>
                                                        <p>Benar</p>
                                                        <p>Salah</p>
                                                    </div>,
                                                dataIndex: 'is_correct',
                                                key: 'is_correct',
                                                align: 'center',
                                                render: (text: any, record: any) => (
                                                    <Radio.Group className='flex items-center justify-around' onChange={(e: any) => handleStatement(e, record, 'statement')}>
                                                        <Radio value={true}></Radio>
                                                        <Radio value={false}></Radio>
                                                    </Radio.Group>
                                                )
                                            }
                                        ]}
                                    />
                                </div>
                            )}

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'essay' && (
                                <div className='mt-5 flex gap-5 items-center'>
                                    <p className='text-lg text-base-color'>{question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question}</p>
                                    <LynxInputNumber
                                        onPressEnter={handleEssay}
                                        size='middle' controls={false} placeholder='type your answer' standart={false} className='!w-[320px]  ' />
                                </div>
                            )}

                            <div className='mt-10 flex gap-4'>
                                <LynxButtons disabled={saveLoading} title="Lewati" className='!w-full' iconType='FastForwardOutlined' typeButton='primary-300' />
                                <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={handleNext} />
                            </div>
                        </>
                    )
            }
        </div >
    );
}
