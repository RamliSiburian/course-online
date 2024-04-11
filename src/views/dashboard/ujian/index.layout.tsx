'use client'
import { useLynxModel } from '@lynx/model-reg';
import Ujian from './main.layout';

export default useLynxModel(Ujian, () => [
    require('@lynx/models/exam/client/schedule.model').default
])