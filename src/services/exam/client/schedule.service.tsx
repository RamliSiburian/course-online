import { IReqListExam, IReqListOwnedExam } from '@afx/interfaces/exam/client/schedule.iface';
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
export function GetDetailExam(id: string) {
    return request<any>({
        url: endpoint.exam.client.schedule.detailExam.replace(':id', id),
        method: 'GET',
        service: services.examService
    })
}
export function FormRegitsterExam(id: string) {
    return request<any>({
        url: endpoint.exam.client.schedule.formRegisterExam.replace(':id', id),
        method: 'GET',
        service: services.examService
    })
}
export function GetListOwnedExam(data: IReqListOwnedExam) {
    return request<any>({
        url: endpoint.exam.client.schedule.listOwnedExam,
        method: 'GET',
        service: services.examService
    })
}