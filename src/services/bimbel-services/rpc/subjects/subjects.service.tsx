import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListSubjects() {
    return request<any>({
        url: endpoint.bimbel.rpc.subjects.listSubjects,
        method: 'GET',
        service: services.bimbelService
    })
}