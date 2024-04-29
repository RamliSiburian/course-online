import { notification } from 'antd';

interface IWarningNotif {
    message?: string
    description: string
    key?: string

}

export function WarningNotif(props: IWarningNotif) {
    return notification.warning({
        message: props?.message || 'Failed to load data',
        description: props?.description,
        duration: 2,
        key: `FUNC-${props?.key}`
    })
}