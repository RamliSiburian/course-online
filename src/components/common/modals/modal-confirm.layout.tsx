import { Modal } from 'antd'
import Image from 'next/image'
import { LynxButtons } from '../button/button'

interface ModalCustom {
    style?: any
    title?: string | React.FC | React.JSX.Element
    maskClosable?: boolean
    open: any
    onCancel: () => void
    footer?: Array<any>
    width?: number
    content?: React.JSX.Element | React.FC | string
    className?: any
    onSave: any
    textSave?: any
    description?: any
    onChange?: (e: any) => void
    srcImage?: any
}

export function ModalConfirm(props: ModalCustom): React.JSX.Element {
    return (
        <Modal
            centered
            style={props.style}
            title={false}
            maskClosable={props.maskClosable}
            open={props.open}
            onCancel={props.onCancel}
            footer={false}
            className={props.className}
            width={350}
        >
            {props?.srcImage && <div className="w-full flex justify-center">
                <Image
                    src={props.srcImage}
                    alt="icon bundle"
                    style={{
                        placeContent: 'center'
                    }}
                />
            </div>}

            <div className="text-center my-5 text-sm text-black font-normal">
                <p className='text-base-color'>{props.description}</p>
            </div>

            <div className="flex justify-between mt-8">
                <LynxButtons
                    size="small"
                    title={props.textSave || 'Next'}
                    className="!w-full"
                    onClick={props.onSave}
                />
            </div>

            {props.content as any}
        </Modal>
    )
}
