import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqAttachment, IReqExamQuestion, IReqOption, IReqOptionEssay, IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetAnswer, GetAttachment, GetExamDiscussion, GetExamQuestion, ReStartExam, ResultExam, SaveAnswer, StartExam } from '@afx/services/exam/client/exam.service'
import LynxStorages from '@afx/utils/storage.util'
import DummyQuestion from '@lynx/mock-data/question.json'

export type IStateExam = {
    resultExam: any
    answers: any
    listDiscussion: any
}
export type IActionExam = {
    getAttachment: (data: IReqAttachment, callback: (status: number, data: any) => void) => void
    getListExamQuestion: (data: IReqExamQuestion, callback: (status: number) => void) => void
    getListExamDiscussion: (data: IReqExamQuestion) => void
    saveAnswer: (data: IReqOption | IReqOptionEssay, ids: IReqSaveAnswer, callback: (code: number) => void) => void
    getAnswer: (ids: IReqSaveAnswer) => void
    StartExam: (data: { question_section_id: string }, ids: IReqExamQuestion, callback: (code: number) => void) => void
    reStartExam: (data: { question_section_id: string }, ids: IReqExamQuestion, callback: (code: number) => void) => void
    getResultExam: (ids: IReqSaveAnswer, callback: (code: number) => void) => void
}

const modelExam: IModelDefinitions<IStateExam, IActionExam> = {
    name: 'exam',
    model: (put, getState, useActions) => ({
        state: {
            resultExam: {} as any,
            listDiscussion: {},
            answers: []
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
                    callback(404, null)
                    // WarningNotif({ key: 'ATTACHMENT', message: 'Failed to load data attachment', description: err?.message })
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
            async getListExamDiscussion(data) {
                try {
                    const res = await GetExamDiscussion(data)
                    if (res?.status_code === 200) {
                        put({
                            listDiscussion: res?.data
                        })
                    } else {
                        throw new Error(res?.messages)
                    }
                } catch (err: any) {
                    WarningNotif({ key: 'DISCUSSION', message: 'Failed to load data', description: err?.messages })
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
            async getAnswer(ids) {
                try {
                    const res = await GetAnswer(ids)
                    put({
                        answers: res?.data
                    })
                } catch (err: any) {
                    WarningNotif({ key: 'GET-ANSWER', message: 'Failed to load data', description: err?.messages })
                }
            },
            async StartExam(data, ids, callback) {
                try {
                    const res = await StartExam(ids, data)
                    callback(res?.status_code)

                } catch (err: any) {
                    WarningNotif({ key: 'START-EXAM', message: 'Failed to load data', description: err?.messages })
                }
            },
            async reStartExam(data, ids, callback) {
                try {
                    const res = await ReStartExam(ids, data)
                    callback(res?.status_code)
                } catch (err: any) {
                    WarningNotif({ key: 'RE-START-EXAM', message: 'Failed to load data', description: err?.messages })
                }
            },
            async getResultExam(ids, callback) {
                try {
                    const res = await ResultExam(ids)
                    callback(res?.status_code)
                    put({
                        resultExam: res?.data
                    })

                } catch (err: any) {
                    // WarningNotif({ key: 'RESULT-EXAM', message: 'Failed to load data', description: err?.messages })

                }
            }
        }
    })

}

export default modelExam