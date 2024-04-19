'use client'
import { useLynxModel } from '@lynx/model-reg';
import ListSchedule from './main.layout';

export default useLynxModel(ListSchedule, () => [
    require('@lynx/models/exam/client/schedule.model').default
])