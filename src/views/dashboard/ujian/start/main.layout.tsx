import { SuccessNotif } from '@afx/components/common/notification/success'
import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqExamQuestion } from '@afx/interfaces/exam/client/exam.iface'
import { IActionExam, IStateExam } from '@lynx/models/exam/client/exam.model'
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model'
import { useLynxStore } from '@lynx/store/core'
import JSZip from 'jszip'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DetailStartExam } from './layouts/detail.layout'
import { ProccessExam } from './layouts/proccess-exam.layout'

export function StartExam(): React.JSX.Element {
    const { examID: params }: { examID: string } = useParams() as any
    const { state, useActions: schedules, isLoading: scheduleloading } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const { useActions: exam, isLoading: examLoading } = useLynxStore<IStateExam, IActionExam>('exam')
    const [isQuestion, setIsQuestion] = useState<boolean>(false)
    const [isAttachment, setIsAttachment] = useState<boolean>(false)
    const [isStart, setisStart] = useState<boolean>(false)

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
            console.log('Error opening database');
        };

        request.onupgradeneeded = function (event) {
            var db = event?.target.result;

            var objectStore = db.createObjectStore('Images', { keyPath: 'id' });
        };

        request.onsuccess = function (event) {
            var db = event.target.result;

            // Insert data into the object store
            var transaction = db.transaction(['Images'], 'readwrite');
            var objectStore = transaction.objectStore('Images');

            var request = objectStore.put({ 'id': relativePath, blob });

            request.onsuccess = function (event: any) {
                console.log('Data inserted successfully');
            };

            request.onerror = function (event: any) {
                console.log('Error inserting data');
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

    const startExam = () => {
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
            } else {
                setIsAttachment(false)
            }
        }], true)
    }


    useEffect(() => {
        if (isQuestion && isAttachment) {
            setisStart(true)
            //TODO: start api
        } else {
            setisStart(false)
        }

    }, [isQuestion, isAttachment])

    return (
        isStart
            ? <ProccessExam />
            : <DetailStartExam startExam={startExam} />
    )
}