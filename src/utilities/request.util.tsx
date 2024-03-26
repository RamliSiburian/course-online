import axios from 'axios'
import LynxStorages from './storage.util'
import { useRouter } from 'next/navigation'
import { notification } from 'antd'
// import LynxStorages from './storage.util'


const router = useRouter()
interface IRequestPayloads<T = any> {
  url: string
  method: 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'POST'
  headers?: any
  data?: T
  service: string
}

interface IResponsePayloads<T = any> {
  data: T
  meta: { success: boolean; code: string | number; message: string }
  status_code: number
}

const getQueryByName = (name: string, url: string) => {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(url)

  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export default async function request<T = any, R = any>({
  url,
  method = 'GET',
  headers = {},
  data,
  service
}: IRequestPayloads<R>): Promise<IResponsePayloads<T>> {
  const [token] = LynxStorages.getItem('ADZKIA@UTOKEN').data
  const baseUrl = process.env.BASEURL


  if (token) {
    try {
      await axios
        .request({
          url: `${baseUrl}${service}/api/v1/token-validation`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${token}`,
            'X-User-Key': process.env.X_USER_KEY
          },
          method,
          data: JSON.stringify(data)
        })
    }
    catch (e: any) {
      notification.warning({
        message: 'Failed to load data',
        description: e?.response?.data?.messages
      })
      router.replace('/auth/login')
      return Promise.reject()
    }

  }

  if (method === 'GET') {
    if (Object.getOwnPropertyNames(data || {}).length > 0) {
      url += getQueryByName('mode', url) ? '&' : '?'
      for (const i in data) {
        if (Array.isArray(data[i]) && ((data[i] || []) as any).length > 0) {
          for (const x in data[i]) {
            const itemsArr = data[i][x]
            url += `${i}[]=${itemsArr}&`
          }
        } else {
          url += `${i}=${data[i]}&`
        }
      }

      if (url[url.length - 1] === '&') {
        url = url.substring(0, url.length - 1)
      }
    }
  }

  return new Promise((resolve, reject) =>
    axios
      .request({
        url: `${baseUrl}${service}/api/v1/${url}`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
          'X-User-Key': process.env.X_USER_KEY
        },
        method,
        data: JSON.stringify(data)
      })
      .then(response => resolve(response.data))
      .catch(error => reject(error?.response?.data))
  )
}
