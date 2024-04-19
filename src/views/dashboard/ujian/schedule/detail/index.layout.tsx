'use client'
import { useLynxModel } from '@lynx/model-reg';
import { DetailSchedule } from './main.layout';

export default useLynxModel(DetailSchedule, () => [
    require('@lynx/models/exam/client/schedule.model').default
])