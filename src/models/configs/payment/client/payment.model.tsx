import { WarningNotif } from '@afx/components/common/notification/warning'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { IReqClaimExam } from '@afx/interfaces/payment/payment.iface'
import { ClaimExam } from '@afx/services/payment/payment.service'

export type IStatePayment = {}
export type IActionPayment = {
    claimExam: (data: any, callback: (status: number) => void) => void
}

const modelPayment: IModelDefinitions<IStatePayment, IActionPayment> = {
    name: 'payment',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async claimExam(data, callback) {
                try {
                    const res = await ClaimExam(data)
                    console.log({ res: res?.data });

                    callback(200)
                } catch (err: any) {
                    WarningNotif({ key: 'CLAIM', message: 'Failed to load data', description: err?.messages })
                }
            }
        }
    })
}

export default modelPayment