import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetSimpleProfile } from '@afx/services/user-services/client/user/profile.service'
import LynxStorages from '@afx/utils/storage.util'
import { notification } from 'antd'

export type IStateProfile = {}
export type IActionProfile = {
    getSimpleProfile: () => void
}

const modelProfile: IModelDefinitions<IStateProfile, IActionProfile> = {
    name: 'profile',
    subscriptions: (getStates, useActions) => ({ pathname }) => {
        if (pathname === '/dashboard') {
            useActions('profile')('getSimpleProfile', [], true)
        }
    },
    model: () => ({
        state: {},
        actions: {
            async getSimpleProfile() {
                try {
                    const res = await GetSimpleProfile()
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@SIMPLEPROFILE', JSON.stringify(res?.data), true)
                    } else {
                        throw new Error(res?.messages)
                    }

                } catch (err: any) {
                    notification.warning({
                        message: 'Failed to load data',
                        description: err?.messages,
                        duration: 1,
                        key: 'SIMPLE-PROFILE'
                    })
                }
            }
        }
    })
}

export default modelProfile
