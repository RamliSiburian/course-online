import { Input } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useState } from 'react'

interface IInput {
    prefix?: React.JSX.Element | React.FC | any
    suffix?: React.JSX.Element | React.FC
    addonBefore?: React.JSX.Element | React.FC | any
    placeholder?: string
    disabled?: boolean
    standart?: boolean
    size?: SizeType
    maxLength?: number
    onPressEnter?: (value: any) => void
    onChange?: (event: any) => void
    type?: any
    className?: string
    defaultValue?: any
    value?: any
}

/**
 *
 * - prefix -> icon in left of textfield
 * - suffix -> icon in right of textfield
 * - onPressEnter -> when enter keyboard pressed
 *
 */

export default function LynxInput(props: IInput): React.JSX.Element {
    const { standart, ...others } = props

    const standartLayouts = {
        className: `${props?.disabled ? 'custom-disabled-input' : ''
            }'form-input !bg-[#F8F8F8] max-w-[23rem] gap-x-1.5 hover:!bg-[#F8F8F8]'`,
        style: { border: 'none' },
        styles: {
            input: {
                backgroundColor: '#F8F8F8',
                color: '#9E9D9D',

                border: 'none',
                fontSize: '14px'
            }
        }
    }

    return (
        <Input
            {...others}
            {...(typeof standart !== 'boolean' || standart ? standartLayouts : {})}
            disabled={props.disabled}
            addonBefore={props.addonBefore as any}
            prefix={props.prefix as any}
            size={props?.size}
            placeholder={props.placeholder}
            onPressEnter={(v: any) => props.onPressEnter?.(v.target.value)}
            type={props.type}
            suffix={props.suffix as any}
        />
    )
}
