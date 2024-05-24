import { IReqAttachment, IReqExamQuestion, IReqOption, IReqSaveAnswer } from '@afx/interfaces/exam/client/exam.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';


export function StartExam(ids: IReqExamQuestion, data: { question_section_id: string }) {
    return request<any>({
        url: endpoint.exam.client.exam.startExam.replace(':scheduleID', ids?.scheduleID).replace(':registerID', ids?.registerID),
        method: 'POST',
        data,
        service: services.examService
    })
}
export function ReStartExam(ids: IReqExamQuestion, data: { question_section_id: string }) {
    return request<any>({
        url: endpoint.exam.client.exam.reStartExam.replace(':scheduleID', ids?.scheduleID).replace(':registerID', ids?.registerID),
        method: 'POST',
        data,
        service: services.examService
    })
}

export function GetAttachment(data: IReqAttachment) {
    return request<any>({
        url: endpoint.exam.client.exam.getAttachment.replace(':scheduleID', data?.scheduleID).replace(':registerID', data?.registerID),
        method: 'GET',
        service: services.examService,
        responseType: 'blob'
    })
}

export function GetExamQuestion(data: IReqExamQuestion) {
    return request<any>({
        url: endpoint.exam.client.exam.getListExamQuestion.replace(':scheduleID', data?.scheduleID).replace(':registerID', data?.registerID),
        method: 'GET',
        service: services.examService
    })
}
export function GetExamDiscussion(data: IReqExamQuestion) {
    return request<any>({
        url: endpoint.exam.client.exam.discussion.replace(':scheduleID', data?.scheduleID).replace(':registerID', data?.registerID),
        method: 'GET',
        service: services.examService
    })
}

export function SaveAnswer(data: IReqOption, ids: IReqSaveAnswer) {
    return request<any>({
        url: endpoint.exam.client.exam.saveAnswer.replace(':scheduleID', ids?.scheduleID).replace(':registerID', ids?.registerID),
        method: 'POST',
        data,
        service: services.examService
    })
}
export function GetAnswer(ids: IReqSaveAnswer) {
    return request<any>({
        url: endpoint.exam.client.exam.answer.replace(':scheduleID', ids?.scheduleID).replace(':registerID', ids?.registerID),
        method: 'GET',
        service: services.examService
    })
}

export function ResultExam(ids: IReqSaveAnswer) {
    return request<any>({
        url: endpoint.exam.client.exam.result.replace(':scheduleID', ids?.scheduleID).replace(':registerID', ids?.registerID),
        method: 'GET',
        service: services.examService
    })
}
