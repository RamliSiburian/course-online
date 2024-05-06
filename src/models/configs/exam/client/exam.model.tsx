import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqAttachment, IReqExamQuestion } from '@afx/interfaces/exam/client/exam.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetAttachment, GetExamQuestion } from '@afx/services/exam/client/exam.service'
import LynxStorages from '@afx/utils/storage.util'

export type IStateExam = {}
export type IActionExam = {
    getAttachment: (data: IReqAttachment, callback: (status: number, data: any) => void) => void
    getListExamQuestion: (data: IReqExamQuestion, callback: (status: number) => void) => void
}

const modelExam: IModelDefinitions<IStateExam, IActionExam> = {
    name: 'exam',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async getAttachment(data, callback) {
                try {
                    const res = await GetAttachment(data)
                    console.log({ res });

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
                        LynxStorages.setItem('ADZKIA@QUESTION', res?.data)
                        callback(200)
                    } else {
                        throw new Error(res?.messages)
                    }
                } catch (err: any) {
                    WarningNotif({ key: 'QUESTION', message: 'Failed to load data', description: err?.messages })
                }
            }
        }
    })

}

export default modelExam