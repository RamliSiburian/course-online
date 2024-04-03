'use client'

import { useLynxModel } from '@lynx/model-reg'
import Bimbel from './main.layout'

export default useLynxModel(Bimbel, () => [
    require('@lynx/models/user-model/auth/auth.model').default
])