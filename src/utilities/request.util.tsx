import axios from 'axios'
import LynxStorages from './storage.util'
import { useRouter } from 'next/navigation'
import { notification } from 'antd'
import { services } from './config.endpoint'
// import LynxStorages from './storage.util'


const router = useRouter()
interface IRequestPayloads<T = any> {
  url: string
  method: 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'POST'
  headers?: any
  data?: T
  service: string,
  bodyType?: 'raw' | 'formData',
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}

interface IResponsePayloads<T = any> {
  data: T
  meta: { success: boolean; code: string | number; message: string }
  status_code: number,
  messages: any

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
  service,
  bodyType = 'raw',
  responseType = 'json'
}: IRequestPayloads<R>): Promise<IResponsePayloads<T>> {
  const [token] = LynxStorages.getItem('ADZKIA@UTOKEN').data
  const baseUrl = process.env.BASEURL

  let extendedItems: any = {}

  if (method === 'GET') {
    extendedItems = {
      params: data
    }
  } else {
    extendedItems = {
      data: bodyType === 'formData' ? data : JSON.stringify({ ...data })
    }
  }

  if (token) {
    try {
      await axios
        .request({
          url: `${baseUrl}${services.auth}/api/v1/token-validation`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${token}`,
            'X-User-Key': process.env.X_USER_KEY
          },
          method: 'POST',
          data: JSON.stringify(data)
        })
    }
    catch (e: any) {
      notification.warning({
        message: 'Failed to load data',
        description: e?.response?.data?.messages
      })
      router.replace('/auth/login')
      LynxStorages.dropItem('ADZKIA@UTOKEN')
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
          'Content-Type':
            bodyType === 'formData'
              ? 'multipart/form-data'
              : 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
          'X-User-Key': process.env.X_USER_KEY
        },
        method,
        // ...extendedItems
        data: bodyType === 'formData' ? data : JSON.stringify(data),
        responseType: responseType

      })
      .then(response => resolve(response?.data))
      .catch(error => reject(error?.response?.data))
  )
}


// import axios from 'axios'
// import LynxStorages from './storage.util'
// import { useRouter } from 'next/navigation'
// import { notification } from 'antd'
// import { services } from './config.endpoint'

// const router = useRouter()

// interface IRequestPayloads<T = any> {
//   url: string
//   method: 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'POST'
//   headers?: any
//   data?: T
//   service: string
// }

// interface IResponsePayloads<T = any> {
//   data: T
//   meta: { success: boolean; code: string | number; message: string }
//   status_code: number,
//   messages: any
// }

// const getQueryByName = (name: string, url: string) => {
//   const match = RegExp('[?&]' + name + '=([^&]*)').exec(url)

//   return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
// }

// export default async function request<T = any, R = any>({
//   url,
//   method = 'GET',
//   headers = {},
//   data,
//   service
// }: IRequestPayloads<R>): Promise<IResponsePayloads<T>> {
//   const [token] = LynxStorages.getItem('ADZKIA@UTOKEN').data
//   const baseUrl = process.env.BASEURL

//   if (token) {
//     try {
//       const tokenValidationResponse = await axios.request({
//         url: `${baseUrl}${services.auth}/api/v1/token-validation`,
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//           Authorization: `Bearer ${token}`,
//           'X-User-Key': process.env.X_USER_KEY
//         },
//         method: 'POST',
//         data: JSON.stringify(data),
//         timeout: 5000
//       })
//     }
//     catch (e: any) {
//       if (e.code === 'ECONNABORTED') {
//         notification.warning({
//           message: 'Failed to validate token',
//           description: 'The request has been timed out'
//         })
//         router.replace('/auth/login')
//         LynxStorages.dropItem('ADZKIA@UTOKEN')
//         return Promise.reject()
//       }
//       else {
//         notification.warning({
//           message: 'Failed to validate token',
//           description: e?.response?.data?.messages
//         })
//         router.replace('/auth/login')
//         LynxStorages.dropItem('ADZKIA@UTOKEN')
//         return Promise.reject()
//       }
//     }
//   }

//   if (method === 'GET') {
//     if (Object.getOwnPropertyNames(data || {}).length > 0) {
//       url += getQueryByName('mode', url) ? '&' : '?'
//       for (const i in data) {
//         if (Array.isArray(data[i]) && ((data[i] || []) as any).length > 0) {
//           for (const x in data[i]) {
//             const itemsArr = data[i][x]
//             url += `${i}[]=${itemsArr}&`
//           }
//         } else {
//           url += `${i}=${data[i]}&`
//         }
//       }

//       if (url[url.length - 1] === '&') {
//         url = url.substring(0, url.length - 1)
//       }
//     }
//   }

//   return new Promise((resolve, reject) =>
//     axios
//       .request({
//         url: `${baseUrl}${service}/api/v1/${url}`,
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//           Authorization: `Bearer ${token}`,
//           'X-User-Key': process.env.X_USER_KEY
//         },
//         method,
//         data: JSON.stringify(data),
//         timeout: 5000
//       })
//       .then(response => resolve(response.data))
//       .catch(error => {
//         if (error.code === 'ECONNABORTED') {
//           notification.warning({
//             message: 'Failed to load data',
//             description: 'The request has been timed out'
//           })
//         }
//         else {
//           notification.warning({
//             message: 'Failed to load data',
//             description: error?.response?.data?.messages
//           })
//         }
//         router.replace('/auth/login')
//         LynxStorages.dropItem('ADZKIA@UTOKEN')
//         return reject(error?.response?.data)
//       })
//   )
// }