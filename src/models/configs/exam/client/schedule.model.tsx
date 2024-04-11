import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqListExam } from '@afx/interfaces/exam/client/schedule.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetListExam } from '@afx/services/exam/client/schedule.service'

export type IStateExamSchedule = {}
export type IActionExamSchedule = {
    getListExam: (data: IReqListExam) => void
}

const modelSchedule: IModelDefinitions<IStateExamSchedule, IActionExamSchedule> = {
    name: 'schedule',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async getListExam(data) {
                try {
                    const res = await GetListExam(data)
                    console.log({ res });

                } catch (err: any) {
                    WarningNotif({ key: 'LIST--EXAM', description: err?.messages })
                }
            }
        }
    })
}

export default modelSchedule