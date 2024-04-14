import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqListExam, IReqListOwnedExam } from '@afx/interfaces/exam/client/schedule.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetListExam } from '@afx/services/exam/client/schedule.service'

type IpageInfo = {
    per_page: number
    current_page: number
    last_page: number
    total: number
}
export type IStateExamSchedule = {
    listSchedule: Array<any>
    pageInfo: IpageInfo
    listOwnedExam: Array<any>
    pageInfoOwnedExam: IpageInfo
}
export type IActionExamSchedule = {
    getListExam: (data: IReqListExam) => void
    getListOwnedExam: (data: IReqListOwnedExam) => void
}

const modelSchedule: IModelDefinitions<IStateExamSchedule, IActionExamSchedule> = {
    name: 'schedule',
    model: (put, getState, useActions) => ({
        state: {
            listSchedule: [],
            pageInfo: {} as IpageInfo,
            listOwnedExam: [],
            pageInfoOwnedExam: {} as IpageInfo
        },
        actions: {
            async getListExam(data) {
                try {
                    const res = await GetListExam(data)
                    const pageinfo: IpageInfo = {
                        current_page: res?.data?.current_page,
                        per_page: res?.data?.per_page,
                        total: res?.data?.total,
                        last_page: res?.data?.last_page

                    }
                    put({
                        listSchedule: res?.data?.data,
                        pageInfo: pageinfo
                    })

                } catch (err: any) {
                    WarningNotif({ key: 'LIST-EXAM', description: err?.messages })
                }
            },
            async getListOwnedExam(data) {
                try {
                    const res = await GetListExam(data)
                    const pageinfo: IpageInfo = {
                        current_page: res?.data?.current_page,
                        per_page: res?.data?.per_page,
                        total: res?.data?.total,
                        last_page: res?.data?.last_page

                    }
                    put({
                        listOwnedExam: res?.data?.data,
                        pageInfoOwnedExam: pageinfo
                    })

                } catch (err: any) {
                    WarningNotif({ key: 'LIST-OWNED-EXAM', description: err?.messages })
                }
            }
        }
    })
}

export default modelSchedule