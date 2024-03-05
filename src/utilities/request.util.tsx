import axios from 'axios'
import LynxStorages from './storage.util'
// import LynxStorages from './storage.util'

interface IRequestPayloads<T = any> {
  url: string
  method: 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'POST'
  headers?: any
  data?: T
  dataBody?: any
}

interface IResponsePayloads<T = any> {
  data: T
  meta: { success: boolean; code: string | number; message: string }
}

const getQueryByName = (name: string, url: string) => {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(url)

  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export default async function request<T = any, R = any>({
  url,
  method = 'GET',
  headers = {},
  data
}: IRequestPayloads<R>): Promise<IResponsePayloads<T>> {
  const [token] = LynxStorages.getItem('RIDINEIN@UTOKEN').data

  let extendedItems: any = {}

  if (method === 'GET') {
    extendedItems = {
      params: data
    }
  } else {
    extendedItems = {
      data: JSON.stringify({ ...data })
    }
  }

  return new Promise((resolve, reject) =>
    axios
      .request({
        url,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`
        },
        method,
        ...extendedItems
      })
      .then(response => resolve(response.data))
      .catch(error => {
        const msg = error?.response?.data?.meta
        const newMsg = []
        if (
          msg.message &&
          typeof msg.message === 'object' &&
          !Array.isArray(msg.message)
        ) {
          for (const a in msg.message) {
            newMsg.push(msg.message[a])
          }
          newMsg.flat()
        } else if (typeof msg.message === 'string') {
          newMsg.push(msg.message)
        }
        reject({
          ...error?.response?.data?.meta,
          message: newMsg
        })
      })
  )
}
