import React from 'react'
import { InputNumber, Space } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'

interface IInputNumber {
  prefix?: React.JSX.Element | React.FC
  addOnBefore?: React.JSX.Element | React.FC
  placeholder?: string
  disabled?: boolean
  standart?: boolean
  maxLength?: number
  onPressEnter?: (value: any) => void
  onChange?: (event: any) => void
  type?: any
  value?: number | string | undefined
  defaultValue?: number
  className?: string
  suffix?: React.JSX.Element | React.FC
  controls?: boolean
  max?: number
  size?: SizeType
}

export default function LynxInputNumber(
  props: IInputNumber
): React.JSX.Element {
  const { standart, ...others } = props
  const standartLayouts = {
    className: 'form-input w-full gap-x-1.5',
    style: { width: '100%' },
    styles: {
      input: { backgroundColor: 'transparent', color: '#FFF', border: 'none' }
    }
  }

  return (
    <InputNumber
      {...others}
      defaultValue={props.defaultValue}
      value={props.value}
      size={props?.size || 'large'}
      prefix={props.prefix as any}
      addonBefore={props.addOnBefore as any}
      addonAfter={props.suffix as any}
      {...(typeof standart !== 'boolean' || standart
        ? standartLayouts
        : { className: 'w-full' })}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value!.replace(/\$\s?|(\,*)/g, '')}
      onPressEnter={(v: any) => props.onPressEnter?.(v.target.value)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      className={props.className}
      controls={props?.controls}
      min={0}
      max={props?.max || undefined}
      maxLength={15}
      suffix={false}
    />
  )
}
