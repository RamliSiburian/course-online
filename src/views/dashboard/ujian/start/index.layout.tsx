'use client'
import { useLynxModel } from '@lynx/model-reg';
import { StartExam } from './main.layout';


export default useLynxModel(StartExam, () => [
    require('@lynx/models/exam/client/schedule.model').default,
    require('@lynx/models/exam/client/exam.model').default
])