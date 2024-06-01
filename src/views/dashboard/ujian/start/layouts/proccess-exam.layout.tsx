import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Divider, Image, Radio, Space, Spin } from 'antd';
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
import LynxKatex from '@afx/components/common/katex-editor/katex-render.layout';
import DetailProgressExam from './detail-progres.layout';

interface IProccessExam {
    handleAnswer: (data: any, type: any, callback: (code: number) => void) => void;
    responseCode: number | undefined;
    restartExam: (sectionID: string) => void
    result: () => void
    finish: (id: string) => void
}

export function ProccessExam(props: IProccessExam): React.JSX.Element {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const question = LynxStorages.getItem('ADZKIA@QUESTION', true, true).data[0];
    const { state, isLoading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule');
    const { isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam');
    const saveLoading = examLoading('saveAnswer') || false;
    const finishLoading = examLoading('finishExam') || false;
    const [sectionsIndex, setSectionIndex] = useState<number>(0);
    const [vintagesIndex, setVintagesIndex] = useState<number>(0);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [disableNextButton, setDisableNextButton] = useState<boolean>(true);
    const [statementOption, setStatementOption] = useState<Array<any>>([]);
    const [checkedOption, setCheckedOption] = useState<Array<any>>([]);
    const [imageUrls, setImageUrls] = useState<any>({});
    const [questionimageUrls, setQuestionImageUrls] = useState<any>({});
    const [selectedStatements, setSelectedStatements] = useState<Array<any>>([]);
    const [detailProgress, setDetailProgress] = useState<boolean>(false)

    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    const isLastQuestion = () => {
        const sectionLength = question?.sections?.length
        if (sectionLength === sectionsIndex + 1) {
            const vinLength = question?.sections[sectionLength - 1]?.vintages?.length
            if (vinLength === vintagesIndex + 1) {
                const questionLength = question?.sections[sectionLength - 1]?.vintages[vinLength - 1]?.questions?.length
                if (questionLength === questionIndex + 1) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
    };

    useEffect(() => {
        if (props?.responseCode === 200) {
        } else {
        }
    }, [props?.responseCode]);

    const handleChangeValue = (e: any) => {
        const selectedId = e.target.value?.id;
        const option = question.sections[sectionsIndex].vintages[vintagesIndex].questions[questionIndex].options.find(
            (option: any) => option.id === selectedId
        );
        setSelectedOption(option);
        props?.handleAnswer(e, '', (code: number) => {
            if (code === 200) {
                validationButton(e, question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type)
            }
        })
    };

    const handleNext = (trigger?: string) => {
        if (trigger === 'statement') {
            props?.handleAnswer(statementOption, 'statement', (code: number) => {
                if (code === 200) {
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
                }
            })
        } else if (trigger === 'checkbox') {
            props?.handleAnswer(checkedOption, 'checkbox', (code: number) => {
                if (code === 200) {
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
                    setCheckedOption([])
                    setDisableNextButton(false);
                }
            });
        } else {
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
        }
        setDisableNextButton(true)
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
    const handleStatement = (e: any, record: any) => {
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
        setSelectedStatements((prevState: any) => ({
            ...prevState,
            [record.id]: e.target.value
        }));
    };


    const handleOptionCheckbox: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any, type: any) => {
        setDisableNextButton(false)
        const tempOption = checkedValues.map((item: any) => ({
            question_id: item?.question_id,
            option_id: item?.id
        }));
        setCheckedOption(tempOption);


    };

    const handleEssay: InputNumberProps['onChange'] = (value: any, question_id?: string) => {
        const params = {
            answer: value,
            question_id
        }
        props?.handleAnswer(params, 'essay', (code: number) => {
            if (code === 200) {
                setDisableNextButton(false)
            }
        });

    };
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options?.length != statementOption?.length) {
            setDisableNextButton(true);
        } else if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options?.length === statementOption?.length) {
            setDisableNextButton(false);
        } else if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions === null) {
            setDisableNextButton(false);
        }

    }, [statementOption]);


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

    const fetchImages = async (fileName: any) => {
        if (fileName) {
            const url = await getImage(fileName);
            setImageUrls(url);
        }
    };

    const fetchImagesQuestion = async (fileName: any) => {
        if (fileName) {
            const url = await getImage(fileName);
            setQuestionImageUrls(url);
        }
    };

    useEffect(() => {
        if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.attachment !== null) {
            fetchImages(question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.attachment?.filename)
        } else if (question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions?.attachment?.filename !== null) {
            fetchImagesQuestion(question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.attachment?.filename)
        } else { }

    }, [vintagesIndex, sectionsIndex, questionIndex])


    return (
        <>
            <div className={`${detailProgress ? 'ms-[400px]' : ''} shadow-xl p-8 h-full`}>
                <div>
                    <p className='text-base-color font-semibold text-lg'><Icons size={16} type='MenuOutlined' onClick={() => setDetailProgress(!detailProgress)} /> &nbsp; {state?.detailSchedule?.title}</p>
                </div>
                {state?.formRegister?.exam?.status !== 'finish' || state?.formRegister?.repeatable &&
                    <div className='flex items-center justify-between mt-5'>
                        <p className='text-base-color text-xl mb-2'>{question?.sections[sectionsIndex]?.name} </p>
                        <p className='text-base-color text-xs'>Akan berakhir dalam <CountdownTimer initialMinutes={state?.formRegister?.exam?.status === 'start' ? Math.ceil(state?.formRegister?.exam?.remaind_section_duration)
                            : state?.formRegister?.exam?.status === 'finish' ? Math.ceil(state?.formRegister?.exam?.remaind_section_duration) : question?.duration} />  </p>
                    </div>
                }

                {
                    // state?.formRegister?.exam?.status === 'finish' ?
                    //     <div className='h-40 flex items-center justify-center flex-col'>
                    //         <p>Ujian Telah berakhir</p>
                    //         <LynxButtons disabled={false} onClick={() => { }} title="Lihat Hasil Ujian" className='!w-full mt-10' />
                    //     </div>
                    //     :
                    question?.sections?.length !== 0 && (
                        <>


                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.attachment !== null &&
                                <>
                                    {imageUrls && (
                                        <Image alt='test' src={imageUrls} style={{ width: '200px' }} />
                                    )}
                                </>
                            }

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content === null ? '' :
                                <>
                                    <p className='text-base-color font-semibold text-xs mt-5 mb-5'> Vintages {vintagesIndex + 1} </p>
                                    <div dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.content }} />
                                </>
                            }
                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.attachment !== null &&
                                <div>
                                    {questionimageUrls && (
                                        <Image alt='test' src={questionimageUrls} style={{ width: '200px' }} />
                                    )}
                                </div>
                            }
                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'multiple_choice' && (
                                <div className='mt-5'>
                                    <Spin spinning={saveLoading}>
                                        <div className='text-base-color' dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question }} />
                                        <Radio.Group onChange={handleChangeValue} value={selectedOption ? selectedOption.id : null}>
                                            <Space direction="vertical">
                                                {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options.map((option: any) => (
                                                    <Radio key={option.id} value={option} defaultChecked={selectedOption ? selectedOption.id : null}>
                                                        <span className='flex items-center gap-2'>{option.option}. <div dangerouslySetInnerHTML={{ __html: option?.answer }} /></span>
                                                    </Radio>
                                                ))}
                                            </Space>
                                        </Radio.Group>
                                    </Spin>
                                </div>
                            )}

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'checkbox' && (
                                <Spin spinning={saveLoading} >
                                    <div className='mt-5'>
                                        <p className='text-lg text-base-color'>{question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question}</p>
                                        <Checkbox.Group onChange={(v: any) => handleOptionCheckbox(v, 'checkbox')} value={['44d4c424-87c1-4524-9566-7b8bc7741cf2']}>
                                            <Space direction="vertical">
                                                {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.options.map((option: any) => (
                                                    <Checkbox key={option.id} value={option?.id} >
                                                        {option.option}. {option?.answer}
                                                    </Checkbox>
                                                ))}
                                            </Space>
                                        </Checkbox.Group>
                                    </div>
                                </Spin>
                            )}

                            {question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'statement' && (
                                <div className='mt-5'>
                                    <p className='text-lg text-base-color'>{question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question}</p>
                                    <SimpleTable
                                        LOADINGS={saveLoading}
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
                                                    <Radio.Group className='flex items-center justify-around' onChange={(e: any) => handleStatement(e, record)} value={selectedStatements[record.id]}>
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
                                <div className='mt-5 flex-col gap-5 items-center'>
                                    <div className='text-lg text-base-color' dangerouslySetInnerHTML={{ __html: question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question }} />
                                    <Divider />
                                    <LynxKatex text={'\\lim_{x \\to 0 } \\frac{1 - \\cos 6x}{2x \\tan(\\frac{1}{3}x)}'} />
                                    {/* <LynxKatex text={question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.question} /> */}
                                    <LynxInputNumber
                                        onPressEnter={(e: any) => handleEssay(e, question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.id)}
                                        size='middle' controls={false} placeholder='type your answer' standart={false} className='!w-[320px] mt-4  ' />
                                </div>
                            )}

                            {/* button */}
                            <div className='mt-10 flex gap-4'>
                                <LynxButtons onClick={handleNext} title="Lewati" disabled={isLastQuestion() ? true : false} className='!w-full' iconType='FastForwardOutlined' typeButton='primary-300' />
                                {
                                    isLastQuestion() ? (
                                        question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'statement' ?
                                            <LynxButtons disabled={saveLoading || disableNextButton} title="Submit dan Selesai" className='!w-full' onClick={() => {
                                                handleNext('statement')
                                                props?.result
                                            }} />
                                            : question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'checkbox' ?
                                                <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={() => {
                                                    handleNext('checkbox')
                                                    props?.result
                                                }} />
                                                : <LynxButtons disabled={finishLoading} title="Selesai" className='!w-full' onClick={() => props?.finish(question?.sections[sectionsIndex]?.id)} />
                                    )
                                        : question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'statement' ?
                                            <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={() => handleNext('statement')} />
                                            : question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions !== null && question?.sections[sectionsIndex]?.vintages[vintagesIndex]?.questions[questionIndex]?.type === 'checkbox' ?
                                                <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={() => handleNext('checkbox')} />
                                                : <LynxButtons disabled={saveLoading || disableNextButton} title="Selanjutnya" className='!w-full' onClick={handleNext} />
                                }
                            </div>
                        </>
                    )
                }
            </div >

            <DetailProgressExam
                openDetail={detailProgress}
                setOpenDetail={() => setDetailProgress(!detailProgress)}
                question={question}

            />
        </>
    );
}
