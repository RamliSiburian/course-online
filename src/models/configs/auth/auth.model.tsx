import { IReqLogin } from '@afx/interfaces/auth/auth.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { Login } from '@afx/services/auth/auth.service'
import { notification } from 'antd'

export type IStateAuth = {}
export type IActionAuth = {
    login: (data: IReqLogin) => void
}

const modelAuth: IModelDefinitions<IStateAuth, IActionAuth> = {
    name: 'auth',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async login(data) {
                try {
                    const res = await Login(data)
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