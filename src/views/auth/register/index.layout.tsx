'use client'

import { useLynxModel } from '@lynx/model-reg'
import Register from './main.layout'

export default useLynxModel(Register, () => [
    require('@lynx/models/user-model/auth/auth.model').default
])