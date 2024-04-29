import { notification } from 'antd';

interface ISuccessNotif {
    message?: string
    description: string
    key?: string
}

export function SuccessNotif(props: ISuccessNotif) {
    return notification.success({
        message: props?.message || 'Succes to load data',
        description: props?.description,
        duration: 2,
        key: `FUNC-${props?.key}`
    })
}