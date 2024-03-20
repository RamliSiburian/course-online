import { CountdownTimer } from '@afx/components/date/countdownTimer'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ValidationView({ children }: any) {
    const router = useRouter()
    const [timeBreak, setTimeBreak] = useState<any>(1)




    // useEffect(() => {
    // const timer = localStorage.getItem('token')
    // const timeLeftInMinutes = calculateTimeLeft(moment(new Date(new Date().getTime())).format('HH:MM:SS'), timer);
    // const test = CountdownTimer({ initialMinutes: timeBreak })
    // setTimeBreak(Number(timer))

    // }, [])



    // useEffect(() => {
    //     const isLogin = localStorage.getItem('token')
    //     isLogin ? router.push('/dashboard') : router.push('/auth/login')
    //     console.log({ isLogin });

    // }, [])
    return children
}

function calculateTimeLeft(currentTime: any, timeBreak: any) {
    const currentTimeMoment = moment(currentTime, 'HH:mm:ss');
    const timeBreakMoment = moment(timeBreak, 'HH:mm:ss');
    const diffMinutes = timeBreakMoment.diff(currentTimeMoment, 'minutes');
    return diffMinutes;
}