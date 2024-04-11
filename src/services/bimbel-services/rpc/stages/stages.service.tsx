import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListStages() {
    return request<any>({
        url: endpoint.bimbel.rpc.stages.listStages,
        method: 'GET',
        service: services.bimbelService
    })
}