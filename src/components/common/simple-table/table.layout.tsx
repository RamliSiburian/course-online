/* eslint-disable indent */
import React, { CSSProperties, useEffect, useState } from 'react'
import { Row, Table, Dropdown, Button } from 'antd'
import moment from 'moment'
import { Icons } from '../icons'
import { TableRowSelection } from 'antd/es/table/interface'

interface ColumnTypes {
    /** specifically type of parsed data */
    renderType?: 'date' | 'datetime' | 'number' | 'string'

    /** defining key of data value */
    dataIndex?: string

    /** defining width of columns */
    width?: number

    /** Set column to fix right or left */
    fixed?: 'left' | 'right'

    key: string

    title: string | React.JSX.Element

    /** defining alignment of column title */
    align?: 'center' | 'left' | 'right'

    /** defining alignment of data items */
    itemAlign?: 'center' | 'left' | 'right'

    /** Defining the sub of columns. */
    children?: Array<ColumnTypes>
    allowSort?: boolean

    /** customizing the data to displayed in tables */
    render?: (
        value: any,
        record: any,
        index: number
    ) => React.JSX.Element | React.FC | any
}

export interface ISimpleTableProps {
    /** defining row selection inside the table */
    rowSelection?: TableRowSelection<any>

    onSortData?: (sorts: Array<[key: string, direction: 'asc' | 'desc']>) => void

    dataSource: Array<any>
    LOADINGS: boolean
    columns: Array<ColumnTypes>
    minHeight: number
    /** set to "true", to using the row actions. */
    action?: boolean

    pagination?: boolean | any

    /** set your actions strategy for every rows in  a table*/
    actions?: Array<{
        key: string
        label: string

        /** use antd icon */
        icon?: string
        bgColor?: string
        fgColor?: string
        iconColor?: string
    }>
    /** get data from clicked action, would be returning the payload :
     * key - key of the clicked action
     * data - record of row
     */
    getDataFromAction?: <T = any>(key: string, data: T) => void

    /** get data from clicked row */
    onRowClick?: <T = any>(record: T, index: number) => void
    idFixedColumn?: string
    /** get hook from onchange page of tables */
    onChangePage?: (props: { page: number; pageSize: number }) => void
}

export default function SimpleTable(props: ISimpleTableProps) {
    const [orders, setOrders] = useState<
        Array<[key: string, direction: 'asc' | 'desc']>
    >([])
    const {
        action = true,
        actions = [],
        columns = [],
        getDataFromAction,
        onRowClick,
        idFixedColumn,
        minHeight = 300,
        onChangePage,
        LOADINGS,
        ...tableProps
    } = props

    const countLengthTable = (columnData = []): any => {
        return columnData.reduce(
            (x, { width, children }) =>
                x + (children ? countLengthTable(children) : width || 0),
            0
        )
    }
    const _dateFormat = 'DD/MMM/YY'
    const _dateTimeFormat = 'DD MMMM, YYYY HH:mm:ss'

    const buildItem = (_t: any, _p: any, renderType = 'text') => {
        let newText = _t
        if (renderType === 'date') {
            newText = moment(_t).format(_dateFormat)
        } else if (renderType === 'datetime') {
            newText = moment(_t).format(_dateTimeFormat)
        }
        const pStyle: CSSProperties = {
            textAlign:
                typeof newText === 'number' || renderType === 'number'
                    ? 'right'
                    : renderType === 'date' || renderType === 'text'
                        ? 'center'
                        : 'left',
            margin: 0
        }
        if (typeof newText === 'number' || typeof newText === 'string' || !_t) {
            return (
                <p className="tableRowText" style={pStyle}>
                    {newText || '-'}
                </p>
            )
        } else {
            return (
                <p className="tableRowText" style={pStyle}>
                    {newText}
                </p>
            )
        }
    }
    const columnAction = {
        key: 'action',
        title: 'Action',
        width: 60,
        align: 'center',
        fixed: 'right',
        render: (items: any, x: any, index: number) => {
            const keepShowAction =
                typeof x.activateTheAction === 'boolean' && !!x.activateTheAction
                    ? { visible: true, placement: 'bottomRight' }
                    : {}
            return (
                <Dropdown
                    trigger={['click']}
                    {...keepShowAction}
                    menu={{
                        onClick(info) {
                            getDataFromAction?.(info.key, items as any)
                        },
                        items: actions.map(a => ({
                            key: a.key,
                            label: a.icon ? (
                                <span className="flex flex-row justify-start gap-x-2 z-50 ">
                                    <Icons
                                        type={a.icon}
                                        size={15}
                                        style={{ color: a.iconColor ? a.iconColor : '#000' }}
                                    />
                                    {a.label}
                                </span>
                            ) : (
                                a.label
                            ),
                            style: {
                                backgroundColor: a.bgColor,
                                fontWeight: 'normal',
                                color: a.fgColor,
                                fontSize: 11,
                                padding: '8px 16px 8px 8px'
                            },
                            className: 'font-EncodeSansLight'
                        }))
                    }}
                    placement="bottomRight"
                    key={`drp${index}`}
                    overlayStyle={{
                        backgroundColor: 'transparent'
                    }}
                >
                    <Button
                        icon={
                            <Icons
                                type={LOADINGS ? 'LoadingOutlined' : 'MoreOutlined'}
                                size={18}
                                className="pt-1"
                            />
                        }
                        disabled={LOADINGS}
                        size="small"
                        key={`btn${index}`}
                        className="border-none text-[#E7216E] focus:!bg-[#E7216E1A] !p-0"
                        onClick={(e: any) => e.stopPropagation()}
                    />
                </Dropdown>
            )
        }
    }
    useEffect(() => {
        typeof props.onSortData === 'function' && props.onSortData(orders)
    }, [orders])

    const onSortData = (key: string, direction: 'asc' | 'desc') => {
        const newOrders: Array<any> = []
        let found = false

        for (const x in orders) {
            const newItem: [key: string, direction: 'asc' | 'desc'] = orders[x]
            if (orders[x][0] === key) {
                newItem[1] = direction
                found = true
            }
            newOrders.push(newItem)
        }

        if (!found) newOrders.push([key, direction])

        setOrders(newOrders[newOrders.length - 1])
    }
    const parseColumns = (cols = []) => {
        let isFixed = {}
        return cols.map(
            ({ spec, post, renderType, allowSort, ...other }: ColumnTypes | any) => {
                isFixed = {}
                const tmpOther = { ...other }
                if (tmpOther.children) {
                    tmpOther.children = parseColumns(tmpOther.children)
                }
                tmpOther.title = (
                    <span>
                        <strong>{tmpOther.title}</strong>
                    </span>
                )
                return {
                    render: (x: any, y: any) => buildItem(y[spec] || x, post, renderType),
                    ...(allowSort
                        ? {
                            sorter: (a: any, _: any, b: string) =>
                                onSortData(
                                    other.dataIndex || other.key,
                                    b === 'ascend' ? 'asc' : 'desc'
                                )
                        }
                        : {}),
                    ...tmpOther,
                    ...isFixed
                }
            }
        )
    }

    const newColumns =
        columns.length > 0
            ? parseColumns(
                (action ? [...columns, columnAction] : [...columns]) as any
            )
            : []

    return (
        <Row>
            <Table
                loading={LOADINGS}
                columns={newColumns}
                pagination={props.pagination}
                sticky
                {...tableProps}
                onChange={(_p: any) => {
                    if (typeof onChangePage === 'function') {
                        onChangePage({
                            page: _p.current as number,
                            pageSize: _p.pageSize as number
                        })
                    }
                    return null
                }}
                // onRowClick={(re, index) => (typeof onRowClick === 'function' ? onRowClick(re, index) : null)}
                onRow={(record: any, index: any) => ({
                    onClick: () =>
                        typeof onRowClick === 'function' ? onRowClick(record, index) : null
                })}
                scroll={{
                    x: countLengthTable(newColumns as any),
                    y: props.minHeight
                }}
                rowKey={(i: any, x: any) => `${x}keyTable` as any}
            />
        </Row>
    )
}
