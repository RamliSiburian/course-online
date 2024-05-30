import { useLynxStore } from '@lynx/store/core';
import Browse from './browse.layout';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useEffect, useState } from 'react';
import { IReqListOwnedExam } from '@afx/interfaces/exam/client/schedule.iface';
import { debounce } from 'lodash';
import { LynxPagination } from '@afx/components/common/pagination/pagination.layout';

export default function Ujian(): React.JSX.Element {
    const { state, useActions } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    const [pageSize, setPageSize] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [keyword, setKeyword] = useState<string>('')

    const handleSearch = debounce((keyword: string) => {
        setKeyword(keyword)
    }, 1000)

    useEffect(() => {
        const params: IReqListOwnedExam = {
            per_page: pageSize,
            page,
            keyword
        }
        useActions<'getListOwnedExam'>('getListOwnedExam', [params], true)
    }, [page, pageSize, keyword])


    return (
        <>
            <Browse setKeyword={handleSearch} />
            <LynxPagination
                pages={state?.pageInfoOwnedExam}
                setPageSize={size => setPageSize(size)}
                pageSize={pageSize}
                setPage={(page: number) => setPage(page)}
            />
        </>
    )
}