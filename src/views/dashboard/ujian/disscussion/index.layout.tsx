'use client'
import { useLynxModel } from '@lynx/model-reg';
import Discussion from './main.layout';

export default useLynxModel(Discussion, () => [
  require('@lynx/models/exam/client/exam.model').default,
  require('@lynx/models/exam/client/schedule.model').default
])