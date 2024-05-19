'use client'
import { useLynxModel } from '@lynx/model-reg';
import ResultExam from './main.layout';

export default useLynxModel(ResultExam, () => [
  require('@lynx/models/exam/client/exam.model').default,
  require('@lynx/models/exam/client/schedule.model').default
])