'use client'

import { useLynxModel } from '@lynx/model-reg'
import Register from './main.layout'

export default useLynxModel(Register, () => [
    require('@lynx/models/auth/auth.model').default
])