import { Button } from 'antd'
import { useRouter } from 'next/navigation'

import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: 'http://530827057986-4df87ihc1cgh0l5kknl22k61d72958ib.apps.googleusercontent.com',
            clientSecret: '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'
        })
    ]
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


export default function LoginPage(): React.JSX.Element {
    const router = useRouter()
    const handleLogin = () => {
        localStorage.setItem('ADZKIA@UTOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cGUiOiJKV1QifQ.eyJpZCI6IjliOTcwMzU1LTVhNGMtNDc5Mi04OTVjLTI0NDE2NzQ0NmI4MCIsInVzZXJuYW1lIjoidGVzdDAwMV8xNzEwNzI4OTgyIiwiY29tbXVuaXR5X2lkIjpudWxsLCJjb21tdW5pdHlfZ3JvdXBfaWQiOm51bGwsImNvbW11bml0eV9tZW1iZXJfaWQiOm51bGwsInJvbGUiOiJjb21tb24iLCJpYXQiOjE3MTEwMTA4MDEsImV4cCI6MTc0MjU0NjgwMX0.B2gzmHUYN5b_YRwEw_0fVQl3p0JXy636tZ7gFUF76pjaF4sUr_EMeQNsWwSnoAxknSXXTcSPlIyLZGlbaq_1933_cw3DXL9kr5hsn5NBu87sIs0_qitmYZos1qr7mOKf7jjv-T1AAlnc1O_i-ffLsiXxZSFcgE-wbEPbsgkQS6c')
        router.push('/dashboard')
    }
    return (
        <div className='bg-[#FFF] h-screen'>
            <Button>regist</Button>
        </div>
    )
}


