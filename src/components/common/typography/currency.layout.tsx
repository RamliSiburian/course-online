import { CSSProperties } from 'react'

export interface ILynxCurrency {
    value: number
    locale?: CurrencyLocale
    fraction?: Fraction
    className?: string
    style?: CSSProperties
    prefix?: string
    prefixClassName?: string
    textOnly?: boolean
}

type CurrencyLocale = 'ID-id' | 'en-US'
interface Fraction {
    min: number
    max: 0
}

export function parseCurrency(
    value: number,
    locale?: CurrencyLocale,
    fraction?: Fraction
) {
    try {
        return value.toLocaleString(locale || 'ID-id', {
            minimumFractionDigits: fraction?.min || 0,
            maximumFractionDigits: fraction?.max || 0
        })
    } catch (er) {
        return null
    }
}

export default function LynxCurrency(props: ILynxCurrency) {
    if (props.textOnly)
        return parseCurrency(props.value, props.locale, props.fraction)
    return (
        <span className={props.className} style={props.style}>
            <span className={props.prefixClassName}>
                {props.prefix ? `${props.prefix} ` : ''}
            </span>
            {parseCurrency(props.value, props.locale, props.fraction)}
        </span>
    )
}