/* eslint-disable indent */
import { Button } from 'antd'
import { Icons } from '../icons'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

export interface IButtonCustom {
    onClick?: any
    style?: React.CSSProperties
    className?: string
    title?: React.JSX.Element | React.FC | string
    size?: 'huge' | 'large' | 'small'
    disabled?: boolean
    iconType?: string
    typeButton?:
    | 'danger'
    | 'warning'
    | 'primary'
    | 'primary-600'
    | 'primary-300'
    | 'danger-primary-300'
    htmlType?: 'button' | 'submit' | 'reset' | undefined
    other?: any
    customIcon?: React.JSX.Element | React.FC | string
}

/**
 * REQUIRED
 * - onClick -> function
 *
 * OPTIONAL
 * - title
 * - size -> huge, large, small
 * - iconType -> name icon from antdesign : 'FastForwardOutlined'
 * - typeButton -> danger , warning , primary-600 , primary-300' default : primary
 * - htmlType -> for form on finish "submit | button | reset"
 */
export function LynxButtons(props: IButtonCustom): React.JSX.Element {
    return (
        <Button
            className={props.className}
            htmlType={props.htmlType}
            type="primary"
            onClick={props.onClick}
            size="middle"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px 12px',
                width: 'fit-content',
                height: 'fit-content',
                border: props.disabled
                    ? '#E4E4E4'
                    : props.typeButton === 'primary-300'
                        ? '2px solid #B9E0BE'
                        : 'none',
                borderRadius: '8px',
                color: props.disabled
                    ? '#9E9D9D'
                    : props.typeButton === 'primary-300'
                        ? '#50AF5B'
                        : props.typeButton === 'primary-600'
                            ? '#50AF5B'
                            : props.typeButton === 'danger-primary-300'
                                ? '#F33A3A'
                                : '#FFFFFF',
                background: props.disabled
                    ? '#E4E4E4'
                    : props.typeButton === 'danger'
                        ? '#F33A3A'
                        : props.typeButton === 'danger-primary-300'
                            ? 'rgba(243, 58, 58, 0.1)'
                            : props.typeButton === 'warning'
                                ? 'yellow'
                                : props.typeButton === 'primary-300'
                                    ? '#FFFFFF'
                                    : props.typeButton === 'primary-600'
                                        ? '#EDF7EF'
                                        : '#ED7020',
                fontWeight: 600,
                boxShadow: 'none',
                fontSize:
                    props.size === 'huge'
                        ? '18px'
                        : props.size === 'large'
                            ? '16px'
                            : props.size === 'small'
                                ? '12px'
                                : '14px',
                ...props.style
            }}
            disabled={props.disabled}
            icon={
                props.iconType ? (
                    <Icons
                        type={props.iconType}
                        size={
                            props.size === 'huge'
                                ? 24
                                : props.size === 'large'
                                    ? 20
                                    : props.size === 'small'
                                        ? 16
                                        : 18
                        }
                    />
                ) : null
            }
            {...props.other}
        >
            {/* {props.disabled ? (
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 18, color: '#9D9D9D' }} spin />
          }
        />
      ) : (
        <span className="flex"> */}
            {props.customIcon}

            {props.title ? props.title : ''}
            {/* </span> */}
            {/* )} */}
        </Button>
    )
}
