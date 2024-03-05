import { StoragesProperties } from './consts.util'
import { shortDecrypt, shortEncrypt } from './encryption.util'

interface ILynxStorages {
  setItem: (
    key: (typeof StoragesProperties)[number],
    dataString: string,
    encrypt?: boolean
  ) => ILynxStorages & { data: Array<any> }
  getItem: (
    key: (typeof StoragesProperties)[number],
    decrypt?: boolean,
    parse?: boolean
  ) => ILynxStorages & { data: Array<any> }
}

export default abstract class LynxStorages {
  static dropItem(key: (typeof StoragesProperties)[number]) {
    localStorage.removeItem(key)
    return true
  }
  static setItem(
    key: (typeof StoragesProperties)[number],
    dataString: string,
    encrypt: boolean = false,
    continousData: Array<string> = []
  ): ILynxStorages & { data: Array<any> } {
    try {
      let tmpData: string = dataString
      if (encrypt)
        tmpData = shortEncrypt(
          process.env.STORAGE_ENCRYPTION_KEY as string,
          dataString
        ).encrypted

      localStorage.setItem(key, tmpData)

      return {
        data: continousData,
        getItem: (
          key: (typeof StoragesProperties)[number],
          decrypt: boolean = false
        ) => (this.getItem as any)(key, decrypt, continousData),
        setItem: (
          key: (typeof StoragesProperties)[number],
          dataString,
          encrypt
        ) => (this.setItem as any)(key, dataString, encrypt, continousData)
      }
    } catch (er: any) {
      throw new Error(er.message)
    }
  }

  static getItem(
    key: (typeof StoragesProperties)[number],
    decrypt: boolean = false,
    parse: boolean = false,
    continousData: Array<string> = []
  ): ILynxStorages & { data: Array<any> } {
    try {
      let tmpData: any | null = localStorage.getItem(key) || null

      if (decrypt && typeof tmpData === 'string')
        tmpData = shortDecrypt({
          key: process.env.STORAGE_ENCRYPTION_KEY as string,
          encrypted: tmpData
        })

      if (parse && typeof tmpData === 'string') tmpData = JSON.parse(tmpData)

      continousData.push(tmpData as any)
      return {
        data: continousData,
        getItem: (key, decrypt, parse = false) =>
          (this.getItem as any)(key, decrypt, parse, continousData),
        setItem: (key, dataString, encrypt) =>
          (this.setItem as any)(key, dataString, encrypt, continousData)
      }
    } catch (er: any) {
      return { data: [{}] } as any
    }
  }
}
