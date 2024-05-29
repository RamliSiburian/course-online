import { useLynxStore } from '@lynx/store/core';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useEffect, useState } from 'react';
import { IReqListExam } from '@afx/interfaces/exam/client/schedule.iface';
import ListSchedule from './browse.layout';
import { LynxPagination } from '@afx/components/common/pagination/pagination.layout';
import { debounce } from 'lodash';

export default function Ujian(): React.JSX.Element {
    const { state, useActions } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const [pageSize, setPageSize] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [keyword, setKeyword] = useState<string>('')

    const handleSearch = debounce((keyword: string) => {
        setKeyword(keyword)
    }, 1000)

    useEffect(() => {
        const params: IReqListExam = {
            per_page: pageSize,
            keyword,
            page
        }
        useActions<'getListExam'>('getListExam', [params], true)
    }, [page, pageSize, keyword])

    return (
        <>
            <ListSchedule setKeyword={handleSearch} />
            <LynxPagination
                pages={state?.pageInfo}
                setPageSize={size => setPageSize(size)}
                pageSize={pageSize}
                setPage={(page: number) => setPage(page)}
            />
        </>
    )
}