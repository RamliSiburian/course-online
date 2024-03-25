import { Input } from 'antd'
import { useState } from 'react'

interface IInput {
    prefix?: React.JSX.Element | React.FC
    placeholder?: string
    disabled?: boolean
    standart?: boolean
    maxLength?: number
    onPressEnter?: (value: any) => void
    onChange?: (event: any) => void
    type?: any
}

/**
 *
 * - prefix -> icon in left of textfield
 * - onPressEnter -> when enter keyboard pressed
 *
 */

export default function LynxInput(props: IInput): React.JSX.Element {
    const { standart, ...others } = props

    const standartLayouts = {
        className:
            'form-input text-white bg-white/20 placeholder:text-white max-w-xs ml-3 gap-x-1.5',
        style: { border: 'none' },
        styles: {
            input: { backgroundColor: 'transparent', color: '#FFF', border: 'none' }
        }
    }

    return (
        <Input
            {...others}
            {...(typeof standart !== 'boolean' || standart ? standartLayouts : {})}
            disabled={props.disabled}
            prefix={props.prefix as any}
            size="large"
            placeholder={props.placeholder}
            onPressEnter={(v: any) => props.onPressEnter?.(v.target.value)}
            type={props.type}
        />
    )
}
