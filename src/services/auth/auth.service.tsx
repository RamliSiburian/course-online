import { IReqLogin } from '@afx/interfaces/auth/auth.iface';
import { services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function Login(data: IReqLogin) {
    return request<any>({
        url: '/login',
        service: services?.auth,
        method: 'POST',
        data
    })
}