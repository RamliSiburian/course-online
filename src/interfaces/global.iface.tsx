
export interface IQueryRequestParams {
  _page?: number
  _pageSize?: number
  q?: string
}

export type TModelFn<
  STATE,
  ACTION extends { [P: string]: (...args: any) => any }
> = (
  put: (payload: Partial<STATE>) => void,
  getStates: <REF_STATE = STATE>(
    modelName: string,
    extractor: (current: REF_STATE) => Partial<REF_STATE> | any
  ) => any,
  useActions: <REF_ACTION extends ACTION | { [P: string]: any } = ACTION>(
    modelName: string
  ) => <X extends keyof REF_ACTION = '???'>(
    act: keyof REF_ACTION,
    execute: Parameters<REF_ACTION[X]> | [],
    useLoading?: boolean
  ) => Promise<void> | void,
  routers: {
    pathname: () => string
    navigation: AppRouterInstance
  }
) => {
  state: STATE
  actions: ACTION
}

export type TSubscriptionFn<
  STATE,
  ACTION extends { [P: string]: (...args: any) => any }
> = (
  getStates: <REF_STATE = STATE>(
    modelName: string,
    extractor: (current: REF_STATE) => Partial<REF_STATE> | any
  ) => any,
  useActions: <REF_ACTION extends ACTION | { [P: string]: any } = ACTION>(
    modelName: string
  ) => <X extends keyof REF_ACTION = '???'>(
    act: keyof REF_ACTION,
    execute: Parameters<REF_ACTION[X]> | [],
    useLoading?: boolean
  ) => Promise<void> | void
) => (props: { pathname: string }) => void

export interface IModelDefinitions<
  STATE,
  ACTION extends { [P: string]: (...args: any) => any }
> {
  name: string
  subscriptions?: TSubscriptionFn<STATE, ACTION>
  model: TModelFn<STATE, ACTION>
}
