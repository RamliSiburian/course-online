export interface IReqLogin {
    username: string
    password: string
}
export interface IReqRegister {
    email: string
    password: string
    confirmation_password: string
}
export interface IReqRegisterGoogle {
    id: string
    email: string
    name: string
}
