import { WarningNotif } from '@afx/components/common/notification/warning'
import { IReqListExam, IReqListOwnedExam } from '@afx/interfaces/exam/client/schedule.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetDetailExam, GetListExam, FormRegitsterExam } from '@afx/services/exam/client/schedule.service'

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
    detailSchedule: any
    formRegister: any
}
export type IActionExamSchedule = {
    getListExam: (data: IReqListExam) => void
    getDetailExam: (id: string) => void
    getListOwnedExam: (data: IReqListOwnedExam) => void
    getFormRegister: (id: string) => void
}

const modelSchedule: IModelDefinitions<IStateExamSchedule, IActionExamSchedule> = {
    name: 'schedule',
    model: (put, getState, useActions) => ({
        state: {
            listSchedule: [],
            pageInfo: {} as IpageInfo,
            listOwnedExam: [],
            pageInfoOwnedExam: {} as IpageInfo,
            detailSchedule: {},
            formRegister: {}
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
            async getDetailExam(id) {
                try {
                    const res = await GetDetailExam(id)
                    put({
                        detailSchedule: res?.data
                    })
                } catch (err: any) {
                    WarningNotif({ key: 'DETAIL-EXAM', description: err?.messages })
                }
            },
            async getFormRegister(id) {
                try {
                    const res = await FormRegitsterExam(id)
                    put({
                        formRegister: res?.data
                    })

                } catch (err: any) {
                    WarningNotif({ key: 'REGISTER-EXAM', description: err?.messages })
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