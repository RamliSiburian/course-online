import moment from 'moment'
import { useRouter } from 'next/navigation'
export default function LoginPage(): React.JSX.Element {
    const router = useRouter()
    const handleLogin = () => {
        const timeBreak = new Date(new Date().getTime() + (120 * 60 * 1000))
        const timer = moment(timeBreak).format('HH:MM:SS')
        localStorage.setItem('token', 'login')
        router.push('/dashboard')
    }
    return (
        <div>
            <div onClick={() => handleLogin()} className='cursor-pointer'>login</div>
        </div>
    )
}


