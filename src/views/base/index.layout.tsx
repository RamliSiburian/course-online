'use client'

import { useLynxModel } from '@lynx/model-reg'
import Dashboard from './main.layout'

export default useLynxModel(Dashboard, () => [
    require('@lynx/models/user-model/client/user/profile.model').default,
    require('@lynx/models/user-model/client/menu/menu.model').default
])