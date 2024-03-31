import { IReqLogin, IReqRegisterGoogle } from '@afx/interfaces/auth/auth.iface';
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
export function RegisterGoogle(data: IReqRegisterGoogle) {
    return request<any>({
        url: endpoint.auth.registerGoolge,
        data,
        service: services?.auth,
        method: 'POST'
    })
}