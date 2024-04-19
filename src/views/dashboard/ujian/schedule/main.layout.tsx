import { useLynxStore } from '@lynx/store/core';
import { IActionExamSchedule, IStateExamSchedule } from '@lynx/models/exam/client/schedule.model';
import { useEffect } from 'react';
import { IReqListExam } from '@afx/interfaces/exam/client/schedule.iface';
import ListSchedule from './browse.layout';

export default function Ujian(): React.JSX.Element {
    const { useActions } = useLynxStore<IStateExamSchedule, IActionExamSchedule>('schedule')
    useEffect(() => {
        const params: IReqListExam = {
            per_page: 11
        }
        useActions<'getListExam'>('getListExam', [params], true)
    }, [])
    return (
        <>
            <ListSchedule />
        </>
    )
}