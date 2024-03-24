'use client'

import { useLynxModel } from '@lynx/model-reg'
import Login from './main.layout'

export default useLynxModel(Login, () => [
    require('@lynx/models/auth/auth.model').default
])