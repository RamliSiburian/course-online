export interface IReqListExam {
    timezone?: string
    per_page?: number
    page?: number
    keyword?: string
    type_id: string
}

export interface IReqListOwnedExam {
    timezone?: string
    per_page?: number
    page?: number
    keyword?: string
}