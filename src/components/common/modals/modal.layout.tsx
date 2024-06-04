import { Modal } from 'antd'
import Image from 'next/image'
import { LynxButtons } from '../button/button'

interface ModalCustom {
    style?: any
    title?: string
    maskClosable?: boolean
    open: any
    onCancel: () => void
    width?: number
    content?: React.JSX.Element | React.FC | string
    className?: any
    loading?: boolean
    closeIcon?: boolean
}

export function LynxModal(props: ModalCustom): React.JSX.Element {
    return (
        <Modal
            style={props.style}
            title={props?.title}
            maskClosable={props.maskClosable}
            open={props.open}
            onCancel={props?.onCancel}
            footer={false}
            className={props.className}
            width={props?.width || 350}
            closable={props?.closeIcon}
        >
            {props.content as any}
        </Modal>
    )
}
