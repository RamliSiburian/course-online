import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqAttachment, IReqExamQuestion, IReqOption, IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetAttachment, GetExamQuestion, ResultExam, SaveAnswer, StartExam } from '@afx/services/exam/client/exam.service'
import LynxStorages from '@afx/utils/storage.util'
import DummyQuestion from '@lynx/mock-data/question.json'

export type IStateExam = {
    resultExam: any
}
export type IActionExam = {
    getAttachment: (data: IReqAttachment, callback: (status: number, data: any) => void) => void
    getListExamQuestion: (data: IReqExamQuestion, callback: (status: number) => void) => void
    saveAnswer: (data: IReqOption, ids: IReqSaveAnswer, callback: (code: number) => void) => void
    StartExam: (data: { question_section_id: string }, ids: IReqExamQuestion, callback: (code: number) => void) => void
    getResultExam: (ids: IReqSaveAnswer, callback: (code: number) => void) => void
}

const modelExam: IModelDefinitions<IStateExam, IActionExam> = {
    name: 'exam',
    model: (put, getState, useActions) => ({
        state: {
            resultExam: {} as any
        },
        actions: {
            async getAttachment(data, callback) {
                try {
                    const res = await GetAttachment(data)
                    callback(200, res)
                    if (res?.status_code === 200) {
                        callback(200, res?.data)
                    } else {
                        throw new Error(res?.messages)
                    }
                } catch (err: any) {
                    // WarningNotif({ key: 'ATTACHMENT', message: 'Failed to load data attachment', description: err?.messages })
                }
            },
            async getListExamQuestion(data, callback) {
                try {
                    const res = await GetExamQuestion(data)
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@QUESTION', JSON.stringify(res?.data), true)
                        callback(200)
                    } else {
                        throw new Error(res?.messages)
                    }
                } catch (err: any) {
                    WarningNotif({ key: 'QUESTION', message: 'Failed to load data', description: err?.messages })
                }
            },
            async saveAnswer(data, ids, callback) {
                try {
                    const res = await SaveAnswer(data, ids)
                    callback(res?.status_code)
                } catch (err: any) {
                    WarningNotif({ key: 'SAVE-ANSWER', message: 'Failed to load data', description: err?.messages })
                }
            },
            async StartExam(data, ids, callback) {
                try {
                    const res = await StartExam(ids, data)
                    callback(res?.status_code)
                    console.log({ res });

                } catch (err: any) {
                    WarningNotif({ key: 'START-EXAM', message: 'Failed to load data', description: err?.messages })
                }
            },
            async getResultExam(ids, callback) {
                try {
                    const res = await ResultExam(ids)
                    console.log(({ res }));
                    callback(res?.status_code)
                    put({
                        resultExam: res?.data
                    })

                } catch (err: any) {
                    WarningNotif({ key: 'RESULT-EXAM', message: 'Failed to load data', description: err?.messages })

                }
            }
        }
    })

}

export default modelExam