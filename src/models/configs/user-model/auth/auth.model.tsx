import { IReqLogin, IReqRegister, IReqRegisterGoogle } from '@afx/interfaces/auth/auth.iface'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { Login, LoginGoogle, Logout, Register, RegisterGoogle } from '@afx/services/user-services/auth/auth.service'
import LynxStorages from '@afx/utils/storage.util'
import { notification } from 'antd'

export type IStateAuth = {}
export type IActionAuth = {
    login: (data: IReqLogin, callback: (status: number, user: string) => void) => void
    loginGoogle: (id: number, callback: (status: number, user: string) => void) => void
    register: (data: IReqRegister, callback: (status: number) => void) => void
    registerGoogle: (data: IReqRegisterGoogle, callback: (status: number, user: string) => void) => void
    logout: (callback: (status: number) => void) => void
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
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@UTOKEN', res?.data?.token)
                            .setItem('ADZKIA@UROLE', JSON.stringify(res?.data?.role[0]), true)
                    } else {
                        throw new Error(res?.messages?.username[0] || res?.messages?.password)
                    }

                } catch (err: any) {
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages,
                        duration: 2,
                        key: 'LOGIN'
                    })
                }
            },
            async loginGoogle(id, callback) {
                try {
                    const res = await LoginGoogle({ id })
                    callback(res?.status_code, res?.data?.username)
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@UTOKEN', res?.data?.token)
                    } else {
                        throw new Error(res?.status_code.toString())
                    }

                } catch (err: any) {
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages,
                        duration: 2,
                        key: 'LOGIN-GOOGLE'
                    })
                }
            },
            async register(data, callback) {
                try {
                    const res = await Register(data)
                    callback(res?.status_code)
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@UTOKEN', res?.data?.token)
                    } else {
                        throw new Error(res?.status_code.toString())
                    }
                } catch (err: any) {
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages?.email,
                        duration: 2,
                        key: 'REGISTER'
                    })
                }
            },
            async registerGoogle(data, callback) {
                try {
                    const res = await RegisterGoogle(data)
                    callback(res?.status_code, res?.data?.username)
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@UTOKEN', res?.data?.token)
                    } else {
                        throw new Error(res?.status_code.toString())
                    }
                } catch (err: any) {
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages?.email[0],
                        duration: 2,
                        key: 'REGISTER-GOOGLE'
                    })
                }
            },
            async logout(callback) {
                try {
                    await Logout()
                    callback(200)
                } catch (error) { }
            }
        }
    })
}

export default modelAuth