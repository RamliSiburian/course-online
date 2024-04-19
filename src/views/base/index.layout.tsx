'use client'

import { useLynxModel } from '@lynx/model-reg'
import Pages from './main.layout'

export default useLynxModel(Pages, () => [
    require('@lynx/models/user-model/auth/auth.model').default,
    require('@lynx/models/user-model/client/user/profile.model').default,
    require('@lynx/models/user-model/client/menu/menu.model').default
])