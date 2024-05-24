import { useLynxStore } from '@lynx/store/core';
import Browse from './browse.layout';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useEffect } from 'react';
import { IReqListExam } from '@afx/interfaces/exam/client/schedule.iface';

export default function Ujian(): React.JSX.Element {
    const { useActions } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    useEffect(() => {
        const params: IReqListExam = {
            per_page: 20
        }
        useActions<'getListExam'>('getListExam', [params], true)
        useActions<'getListOwnedExam'>('getListOwnedExam', [params], true)
    }, [])
    return (
        <>
            <Browse />
        </>
    )
}