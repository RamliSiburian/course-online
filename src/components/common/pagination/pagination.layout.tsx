/* eslint-disable indent */
import './style.scss'
import { Flex, Input, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { Icons } from '../icons'
import { IResPageInfo } from '@afx/interfaces/main.iface'
import { WindowWidth } from '../window-width/window-width'

interface PaginateCustom {
  pages: IResPageInfo
  pageSize: any
  setPageSize: (size: number) => void
  setPage: (page: number) => void
  options?: Array<number>
  className?: string
}

export function LynxPagination(props: PaginateCustom): React.JSX.Element {
  const windowWidth: number = WindowWidth()
  const [value, setValue] = useState(1)
  useEffect(() => {
    setValue(props?.pages?.current_page)
  }, [props?.pages])
  return (
    <div
      className={`${windowWidth <= 768 ? 'bg-white w-full fixed bottom-[6px] flex justify-between items-center' : 'bg-white w-[80%] left-[19.5%] fixed bottom-[6px] flex justify-between items-center'}`}
    >
      <div className={` flex right-8 bg-white w-fit justify-between p-[14px_32px] ${props.className}`}>
        <p className="text-sm font-medium text-black">
          {`Showing ${props?.pages?.current_page * props?.pageSize -
            props?.pageSize +
            1
            } 
            to ${props?.pages?.current_page * props?.pageSize -
              props?.pageSize +
              props?.pageSize <
              props?.pages?.total
              ? props?.pages?.current_page * props?.pageSize -
              props?.pageSize +
              props?.pageSize
              : props?.pages?.total
            }  
            of ${props?.pages?.total} entries`}
        </p>
      </div>

      <div
        className={`flex  right-8 justify-between p-[14px_24px] ${props.className}`}
      >
        <div className="flex items-center gap-0">
          <p className="text-sm">Show</p>
          <Pagination
            total={props?.pages?.total}
            onChange={(_, pageSize) => {
              props?.setPage(1)
              props?.setPageSize(pageSize)
            }}
            pageSizeOptions={props?.options || [10, 20, 30, 50, 100]}
            current={props?.pages?.current_page}
            pageSize={props.pageSize}
            showSizeChanger
          />
        </div>
        <div className="flex items-center  gap-2">
          <div
            className="flex items-center justify-center rounded w-7 h-7 bg-[#F7F7F7]"
            onClick={() => {
              props?.pages?.current_page > 1
                ? props?.setPage(props?.pages?.current_page - 1)
                : {}
            }}
            style={{
              cursor:
                props?.pages?.current_page <= 1 ? 'no-drop' : 'pointer'
            }}
          >
            <Icons
              type="LeftOutlined"
              size={12}
              style={{
                color:
                  props?.pages?.current_page <= 1 ? '#0000004d' : '#171717'
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="cursor-pointer flex items-center justify-center rounded w-7 h-7">
              <Input
                styles={{
                  input: {
                    fontSize: '14px',
                    padding: '2px 0px',
                    textAlign: 'center'
                  }
                }}
                value={value}
                onChange={(e: any) =>
                  setValue(
                    Number(e.target.value) > Number(props?.pages?.last_page)
                      ? props?.pages?.last_page
                      : e.target.value
                  )
                }
                onPressEnter={(e: any) =>
                  props?.setPage(
                    Number(e.target.value) > Number(props?.pages?.last_page)
                      ? props?.pages?.last_page
                      : e.target.value
                  )
                }
              />
            </div>
            <p className="text-sm">of</p>
            <div className="cursor-pointer flex items-center justify-center rounded w-7 h-7 bg-[#F7F7F7] text-[#0000004d]">
              {props?.pages?.last_page}
            </div>
          </div>
          <div
            className="cursor-pointer flex items-center justify-center rounded w-7 h-7 bg-[#F7F7F7]"
            onClick={() => {
              props?.pages?.current_page < props?.pages?.last_page
                ? props?.setPage(props?.pages?.current_page + 1)
                : {}
            }}
            style={{
              cursor:
                props?.pages?.current_page >= props?.pages?.last_page
                  ? 'no-drop'
                  : 'pointer'
            }}
          >
            <Icons
              type="RightOutlined"
              size={12}
              style={{
                color:
                  props?.pages?.current_page >= props?.pages?.last_page
                    ? '#0000004d'
                    : '#171717'
              }}
            />
          </div>
        </div>
      </div>
    </div>

  )
}
