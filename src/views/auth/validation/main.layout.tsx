import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ValidationView({children} : any){
    const router = useRouter()

    useEffect(() => {
        router.push('/auth/login')
    }, [])
    return children
}