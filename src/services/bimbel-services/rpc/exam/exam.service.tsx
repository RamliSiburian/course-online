import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListQuestion(id: number) {
    return request<any>({
        url: `${endpoint.bimbel.rpc.exam.listQuestion}/${id}`,
        method: 'GET',
        service: services.bimbelService
    })
}