export interface IReqAttachment {
    scheduleID: string
    registerID: string
}
export interface IReqExamQuestion {
    scheduleID: string
    registerID: string
}
export interface IReqOption {
    batch_answer: Array<{ question_id: string, option_id: string }>
}
export interface IReqSaveAnswer {
    scheduleID: string
    registerID: string
}

