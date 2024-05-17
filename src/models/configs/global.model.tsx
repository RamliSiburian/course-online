import { IModelDefinitions } from '@afx/interfaces/global.iface'

export type IStateGlobal = {
  statusMaximize: boolean
}
export type IActionGlobal = {
  handleMaximizeFloor: (status: boolean) => void
}

const globalModels: IModelDefinitions<IStateGlobal, IActionGlobal> = {
  name: 'globalState',
  subscriptions:
    (getStates, useActions) =>
      ({ pathname }) => {
        if (pathname === '/page/dashboard/tryout/start') {
          useActions('globalState')('handleMaximizeFloor', [], true)
        }
      },
  model: (put, getStates, useActions) => ({
    state: {
      statusSocket: 'non-active',
      listCurrency: [],
      listPaymentMethod: [],
      listSubGroup: [],
      functionPermission: [],
      statusMaximize: true
    },
    actions: {
      handleMaximizeFloor(status) {
        put({ statusMaximize: status });
      }
    }
  })
}
export default globalModels
