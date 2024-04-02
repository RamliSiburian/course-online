import { IReqLogin, IReqRegister, IReqRegisterGoogle } from '@afx/interfaces/auth/auth.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function Login(data: IReqLogin) {
    return request<any>({
        url: endpoint.auth.login,
        data,
        service: services?.auth,
        method: 'POST'
    })
}
export function LoginGoogle(data: { id: number }) {
    return request<any>({
        url: endpoint.auth.loginGoole,
        data,
        service: services?.auth,
        method: 'POST'
    })
}
export function Register(data: IReqRegister) {
    return request<any>({
        url: endpoint.auth.register,
        data,
        method: 'POST',
        service: services.auth
    })
}

export function RegisterGoogle(data: IReqRegisterGoogle) {
    return request<any>({
        url: endpoint.auth.registerGoolge,
        data,
        service: services?.auth,
        method: 'POST'
    })
}

export function Logout() {
    return request<any>({
        url: endpoint.auth.logout,
        service: services?.auth,
        method: 'POST'
    })
}