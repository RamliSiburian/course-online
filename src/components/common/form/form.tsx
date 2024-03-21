import { Form, FormInstance, FormItemProps, FormProps } from 'antd'
import { useEffect, useMemo } from 'react'

export type TLynxFormInstance<V extends { [P: string]: any } = any> =
    FormInstance<V>

export function LynxUseForm<
    T extends { [P: string]: any }
>(): TLynxFormInstance<T> {
    return Form.useForm<T>()[0]
}

/**
 *
 * @param forms inject form into the watcher
 * @param deps passing the dependency
 * @param defaults used for default value (if the initial value is unkown)
 * @returns [Current Value: any, updater: Fn]
 */
export function LynxFormWatcher<RT extends any>(
    forms: TLynxFormInstance,
    deps: string,
    defaults?: RT
): [value: RT, setter: (value: RT) => void] {
    const currentVal = Form.useWatch(deps, forms) || defaults
    return [currentVal, val => forms.setFieldValue(deps, val)]
}

export function LynxForm(props: FormProps) {
    const { initialValues, ...others } = props
    useEffect(() => {
        props.form?.setFieldsValue(initialValues)
    }, [initialValues])

    return <Form {...others}>{props.children as any}</Form>
}

export function LynxFormItem(props: FormItemProps) {
    return (
        <Form.Item
            {...props}
            style={{ padding: '6px 0px', margin: 0 }}
            label={
                props.label ? (
                    <span
                        className="text-blue-950 font-AndikaReg"
                        style={{ fontSize: 13 }}
                    >
                        {props.label}
                    </span>
                ) : null
            }
            className="text-xs"
        >
            {props.children as any}
        </Form.Item>
    )
}

export const standartItemLayout: Pick<
    FormProps,
    'labelCol' | 'wrapperCol' | 'labelAlign' | 'labelWrap'
> = {
    labelCol: { xl: 4, lg: 5, md: 6, xs: 7, sm: 7 },
    wrapperCol: { xl: 10, lg: 12, md: 14, xs: 17, sm: 17 }
}

export const splitBrowseItemLayout: Pick<
    FormProps,
    'labelCol' | 'wrapperCol' | 'labelAlign' | 'labelWrap'
> = {
    labelCol: { xl: 7, lg: 8, md: 6, xs: 7, sm: 7 },
    wrapperCol: { xl: 17, lg: 16, md: 18, xs: 17, sm: 17 }
}
