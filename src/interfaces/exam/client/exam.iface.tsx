export interface IReqAttachment {
    scheduleID: string
    registerID: string
}
export interface IReqExamQuestion {
    scheduleID: string
    registerID: string
}
export interface IReqOption {
    batch_answer: Array<{ question_id: string, option_id: string, is_correct?: string }>
}
export interface IReqOptionEssay {
    batch_answer: Array<{ question_id: string, answer: any }>
}
export interface IReqSaveAnswer {
    scheduleID: string
    registerID: string
}
export interface IReqFinishAnswer {
    scheduleID: string
    registerID: string
}
export interface IReqDataFinishAnswer {
    finish_at: string
    finish_by: string
    timezone: number
    question_section_id: string
}

