import React, { useState, useEffect } from 'react'

interface IFormatTime {
  initialMinutes: number
}

export function CountdownTimer(props: IFormatTime) {
  const [remainingTime, setRemainingTime] = useState<number>(props?.initialMinutes * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(timer)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: any) => {
    return time < 10 ? `0${time}` : `${time}`
  }

  const convertSecondsToTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const formattedHours = formatTime(hours)
    const formattedMinutes = formatTime(minutes)
    const formattedSeconds = formatTime(seconds % 60)

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  const formattedTime = convertSecondsToTime(remainingTime)

  return remainingTime > 0 ? formattedTime : 'Time Out'

}
