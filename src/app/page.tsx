'use client'

import LynxStorages from '@afx/utils/storage.util'
import { redirect } from 'next/navigation'
import { useLayoutEffect } from 'react'

export default function MainPage() {
  const token = LynxStorages.getItem('ADZKIA@UTOKEN').data
  useLayoutEffect(() => {
    if (token[0] === null) {
      redirect('/auth/login')
    } else {
      redirect('/page')
    }
  }, [])
  return <div className="min-h-screen bg-gray-300" />
}
