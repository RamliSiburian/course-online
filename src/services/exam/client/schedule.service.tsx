import { IReqListExam } from '@afx/interfaces/exam/client/schedule.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListExam(data: IReqListExam) {
    return request<any>({
        url: endpoint.exam.client.schedule.listExam,
        data,
        method: 'GET',
        service: services.examService
    })
}