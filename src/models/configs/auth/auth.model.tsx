import { IReqLogin } from '@afx/interfaces/auth/auth.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { Login } from '@afx/services/auth/auth.service'
import { notification } from 'antd'

export type IStateAuth = {}
export type IActionAuth = {
    login: (data: IReqLogin, callback: (status: number, user: string) => void) => void
}

const modelAuth: IModelDefinitions<IStateAuth, IActionAuth> = {
    name: 'auth',
    model: (put, getState, useActions) => ({
        state: {},
        actions: {
            async login(data, callback) {
                try {
                    const res = await Login(data)
                    callback(res?.status_code, res?.data?.username)
                } catch (err: any) {
                    console.log({ err });
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages,
                        duration: 2,
                        key: 'FUNC-LOGIN'
                    })
                }
            }
        }
    })
}

export default modelAuth