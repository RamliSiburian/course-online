import request from '@afx/utils/request.util';

export function validationAuth() {
    return request<any>({
        url: '/login',
        service: '/auth',
        method: 'POST'
    })
}