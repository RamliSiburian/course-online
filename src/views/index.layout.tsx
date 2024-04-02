'use client'
import { useLynxModel } from '@lynx/model-reg'
import HomePage from './main.layout'

export default useLynxModel(HomePage, () => [
    require('@lynx/models/user-model/client/user/profile.model').default
])
