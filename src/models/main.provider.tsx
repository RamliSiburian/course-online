import { IModelDefinitions } from '@afx/interfaces/global.iface'
import { notification } from 'antd'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { StoreApi, UseBoundStore, create } from 'zustand'

const boundStore: { [M: string]: UseBoundStore<StoreApi<any>> } = {}

interface IRegisterModelOptions {
  key?: string
  replace?: boolean
}

function getStates(modelName: string, callbackState: (state: any) => any): any {
  const currentState =
    typeof boundStore[modelName] === 'function'
      ? boundStore[modelName].getState()?.state
      : {}

  return callbackState(currentState)
}

function useActions(
  modelName: string
): (
  act: string,
  execute: Array<any>,
  useLoading?: boolean
) => Promise<void> | void {
  const { actions }: any =
    typeof boundStore[modelName] === 'function'
      ? boundStore[modelName].getState()
      : {}

  return async (
    act: string,
    execute: Array<any> = [],
    useLoading: boolean = false
  ) => {
    const loadingKey: string = `${modelName}/${act as string}`

    // loading before
    if (useLoading) {
      const { loadings: loadBefore } = boundStore[modelName].getState()
      await boundStore[modelName].setState({
        loadings: [...(loadBefore || []), loadingKey]
      })
    }

    await actions[act](...execute)

    // loading after
    if (useLoading) {
      const { loadings: loadAfter }: { loadings: Array<string> } =
        boundStore[modelName].getState()
      loadAfter.splice(loadAfter.indexOf(loadingKey), 1)
      await boundStore[modelName].setState({
        loadings: loadAfter
      })
    }
  }
}

export function registerModels(
  models: () => Array<IModelDefinitions<any, any>>,
  pathname: string,
  navigation: AppRouterInstance,
  listener: (model: string, subscriptions: any) => void,
  options?: IRegisterModelOptions
) {
  const _models = models()
  for (const a in _models) {
    const currentModel = _models[a]

    if (!boundStore[currentModel.name]) {
      boundStore[currentModel.name] = create((set: any) => {
        const currents = currentModel.model(
          (payload = {}) =>
            set((currentState: any) => ({
              state: { ...currentState.state, ...payload }
            })),
          getStates,
          useActions as any,
          {
            pathname: () => window?.location?.pathname,
            navigation
          }
        )
        return currents
      })
    }

    if (typeof currentModel.subscriptions === 'function') {
      listener(
        currentModel.name,
        currentModel.subscriptions(getStates, useActions as any)
      )
    }
  }
}

export function useLynxStore<
  State,
  Action extends { [P: string]: (...args: any) => any }
>(
  model: string
): {
  state: State
  isLoading: (act: keyof Action) => boolean
  useActions: <T extends string = '???'>(
    act: keyof Action,
    execute: Parameters<Action[T]> | [],
    useLoading?: boolean
  ) => void
} {
  try {
    let store: any = boundStore[model]
    store = store((state: any) => state)
    // if (!store) throw new Error()
    return {
      state: store.state,
      isLoading(act: keyof Action) {
        const { loadings }: { loadings: Array<string> } = store
        return (loadings || []).indexOf(`${model}/${act as string}`) !== -1
      },
      async useActions<T extends string = '???'>(
        act: keyof Action,
        executes: Parameters<Action[T]> | [],
        useLoading: boolean = false
      ) {
        useActions(model)(act as string, executes, useLoading)
      }
    }
  } catch (er: any) {
    // notification.error({
    //   key: 'MODEL-NF',
    //   message: 'FAILER TO LOAD MODELS',
    //   description: er.message
    // })
    return { state: {}, actions: {} } as any
  }
}
