/* @flow */

import { handleActions } from 'redux-actions'
import type { VideoInfo, Action } from 'types/ApplicationTypes'
import { UPLOAD_REQUESTED, UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPDATE_UPLOAD_INFO } from 'constants/ActionConstants'
import { fromJS } from 'immutable'
import UploadRecord from 'records/UploadRecords'

const reducer = {
  [UPLOAD_REQUESTED]: (
    state: UploadRecord
  ): UploadRecord => {
    return state.mergeDeep({
      uploadStatus: {
        name: 'running',
        data: { progress: 0 }
      }
    })
  },
  [UPLOAD_PROGRESS]: (
    state: UploadRecord,
    { payload }: Action<number>
  ): UploadRecord => {
    return state.mergeDeep({
      uploadStatus: {
        data: { progress: payload }
      }
    })
    // return state.setIn(['uploadStatus', 'data', 'progress'], payload)
  },
  [UPLOAD_SUCCESS]: (
    state: UploadRecord,
    { payload }: Action<string>
  ): UploadRecord => {
    return state.mergeDeep({
      uploadStatus: {
        name: 'success',
        data: { ipfsHash: payload }
      }
    })
  },
  [UPDATE_UPLOAD_INFO]: (
    state: UploadRecord,
    { payload }: Action<VideoInfo>
  ): UploadRecord => {
    return state.merge({
      videoInfo: payload
    })
  }
}

export default handleActions(reducer, fromJS(new UploadRecord()))
