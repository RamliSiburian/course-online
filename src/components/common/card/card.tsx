/* eslint-disable indent */
import { Col, Row } from 'antd'
interface CardCustom {
    children?: any
    className?: string
}

/**
 * OPTIONAL
 * - title -> string
 * - leftExtra -> if any of content beside of title like search or another
 * - type -> primary , default
 * - children -> a part of content card
 * - extra -> an element or a component
 * - iconType -> icon name from antdesign
 */
export function LynxCards(props: CardCustom): React.JSX.Element {
    return (
        <div
            style={{
                width: '100%',
                borderRadius: '10px',
                background: '#FFF',
                boxShadow: '0px 2px 20px 2px rgba(0, 0, 0, 0.10)'
            }}
            className={props.className}
        >
            <Row
                style={{
                    minHeight: '150px',
                    padding: '14px 20px'
                }}
            >
                <Col span={24} style={{ textAlign: 'justify' }}>
                    {props.children}
                </Col>
            </Row>
        </div>
    )
}
