import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { validationAuth } from '@afx/services/auth/auth.service'
import { notification } from 'antd'

export type IStateAuth = {}
export type IActionAuth = {
    validation: () => void
}

const modelAuth: IModelDefinitions<IStateAuth, IActionAuth> = {
    name: 'auth',
    // subscriptions: (getStates, useActions) => ({ pathname }) => {
    //     if (pathname === '/dashboard/bimbel') {
    //         useActions('validation')('validation', [], true)
    //     }
    // },
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async validation() {
                try {
                    const res = await validationAuth()
                    console.log({ res });

                } catch (err: any) {
                    console.log({ err });

                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages,
                        duration: 2,
                        key: 'FUNC-VALIDATION'
                    })
                }
            }
        }
    })
}

export default modelAuth