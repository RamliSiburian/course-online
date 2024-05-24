import { SuccessNotif } from '@afx/components/common/notification/success'
import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqExamQuestion, IReqOption, IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import JSZip from 'jszip'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DetailStartExam } from './layouts/detail.layout'
import { ProccessExam } from './layouts/proccess-exam.layout'
import { RadioChangeEvent } from 'antd'
import { debounce } from 'lodash';
import { IActionGlobal, IStateGlobal } from '@lynx/models/global.model'

export function StartExam(): React.JSX.Element {
    const { examID: params }: { examID: string } = useParams() as any
    const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { state: globalState, useActions: globalActions } = useLynxStore<IStateGlobal, IActionGlobal>('globalState')

    const { useActions: exam, isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam')
    const [isQuestion, setIsQuestion] = useState<boolean>(false)
    const [isAttachment, setIsAttachment] = useState<boolean>(false)
    const [isStart, setisStart] = useState<boolean>(false)
    const [responseCode, setResponseCode] = useState<number | undefined>()

    useEffect(() => {
        globalActions<'handleMaximizeFloor'>('handleMaximizeFloor', [isStart ? false : true], true)
    }, [isStart])

    useEffect(() => {
        setisStart(false)
        schedules<'getDetailExam'>('getDetailExam', [params], true)
        schedules<'getFormRegister'>('getFormRegister', [params], true)
    }, [])

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
        exam<'getListExamQuestion'>('getListExamQuestion', [paramsQuestion, (status: number) => {
            if (status === 200) {
                SuccessNotif({ key: 'LIST-QUESTION', message: 'Success', description: 'Question has been downloaded' })
                setIsQuestion(true)
            } else {
                setIsQuestion(false)
            }
        }], true)

        exam<'getAttachment'>('getAttachment', [paramsQuestion, (status: number, data: any) => {
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

    const debouncedApiCall = debounce((data: IReqOption, ids: IReqSaveAnswer) => {
        exam<'saveAnswer'>('saveAnswer', [data, ids, (code: number) => {
            setResponseCode(code)
            if (code === 200) {
                SuccessNotif({ message: 'Success', description: 'Your answer have been sent', key: 'SENT-ANSWER' })
            }
        }], true)
    }, 3000);

    const handleSaveAnswer = (e: RadioChangeEvent | any, type?: any) => {
        const ids: IReqSaveAnswer = {
            registerID: state?.formRegister?.exam?.id,
            scheduleID: params
        }
        if (type === undefined) {
            const paramsQuestion: IReqOption = {
                batch_answer: [{ option_id: e.target.value.id, question_id: e.target.value.question_id }]
            }
            debouncedApiCall(paramsQuestion, ids);
        } else if (type === 'statement') {
            const paramsTypeStatement: IReqOption = {
                batch_answer: e
            }
            debouncedApiCall(paramsTypeStatement, ids);
        } else if (type === 'checkbox') {
            const paramsCheckbox: IReqOption = {
                batch_answer: e
            }
            debouncedApiCall(paramsCheckbox, ids);
        }
    }

    const handleStartExam = (id: string) => {
        const paramsQuestion: IReqExamQuestion = {
            registerID: state?.formRegister?.exam?.id,
            scheduleID: params
        }
        exam<'StartExam'>('StartExam', [{ question_section_id: id }, paramsQuestion, (code: number) => {
        }], true)

    }

    const handleResult = () => {
        const paramsQuestion: IReqExamQuestion = {
            registerID: state?.formRegister?.exam?.id,
            scheduleID: params
        }
        exam<'getResultExam'>('getResultExam', [paramsQuestion, (code: number) => {

        }], true)
    }
    useEffect(() => {
        if (isQuestion && isAttachment) {
            setisStart(true)
        } else {
            setisStart(false)
        }

    }, [isQuestion, isAttachment])

    useEffect(() => {
        if (state?.formRegister?.exam?.status === 'finish') {

        } else { }
    }, [state?.formRegister])



    return (
        isStart
            ? <ProccessExam restartExam={handleStartExam} responseCode={responseCode} handleAnswer={handleSaveAnswer} />
            : <DetailStartExam result={handleResult} startExam={startExam} />
    )
}