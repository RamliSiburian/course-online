import { WarningNotif } from '@afx/components/common/notification/warning'
import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { GetListMenu } from '@afx/services/user-services/client/menu/menu.service'
import LynxStorages from '@afx/utils/storage.util'

export type IStateMenu = {}
export type IActionMenu = {
    getListMenu: () => void
}

const modelMenu: IModelDefinitions<IStateMenu, IActionMenu> = {
    name: 'menu',
    subscriptions: (getStates, useActions) => ({ pathname }) => {
        if (pathname === '/page') {
            useActions('menu')('getListMenu', [], true)
        }
    },
    model: () => ({
        state: {},
        actions: {
            async getListMenu() {
                try {
                    const res = await GetListMenu()
                    if (res?.status_code === 200) {
                        LynxStorages.setItem('ADZKIA@MENUS', JSON.stringify(res?.data), true)
                    } else {
                        throw new Error(res?.messages)
                    }
                } catch (err: any) {
                    WarningNotif({ description: err?.messages, key: 'LIST-Menu' })
                }
            }
        }
    })
}

export default modelMenu