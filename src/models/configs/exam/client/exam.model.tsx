import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqAttachment, IReqExamQuestion } from '@afx/interfaces/exam/client/exam.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetAttachment, GetExamQuestion } from '@afx/services/exam/client/exam.service'

export type IStateExam = {}
export type IActionExam = {
    getAttachment: (data: IReqAttachment) => void
    getListExamQuestion: (data: IReqExamQuestion) => void
}

const modelExam: IModelDefinitions<IStateExam, IActionExam> = {
    name: 'exam',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async getAttachment(data) {
                try {
                    const res = await GetAttachment(data)
                    console.log({ res });


                } catch (err: any) {
                    WarningNotif({ key: 'ATTACHMENT', message: 'Failed to load data', description: err?.messages })
                }
            },
            async getListExamQuestion(data) {
                try {
                    const res = await GetExamQuestion(data)
                    console.log({ respon: res });
                } catch (err: any) {
                    WarningNotif({ key: 'QUESTION', message: 'Failed to load data', description: err?.messages })
                }
            }
        }
    })

}

export default modelExam