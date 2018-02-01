/* @flow */

import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import {
  UPLOAD_REQUESTED,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_LOCAL_SUCCESS,
  UPDATE_VIDEO_INFO,
  VIDEO_DATA_START,
  VIDEO_DATA_SAVED,
  TRANSCODING_REQUESTED,
  TRANSCODING_PROGRESS,
  TRANSCODING_SUCCESS,
  TRANSCODING_FAILURE
} from 'constants/ActionConstants'
import UploadRecord from 'records/UploadRecords'
import type { Action } from 'types/ApplicationTypes'

type VideoRecordArray = { string: UploadRecord }

const reducer = {
  [UPLOAD_REQUESTED]: (
    state: VideoRecordArray,
    { payload }: Action<{ id: string, filename: string }>
  ): VideoRecordArray => {
    state = state
      .mergeDeep({
        [payload.id]: new UploadRecord()
      })
      .mergeDeep({
        [payload.id]: {
          filename: payload.filename,
          uploadStatus: {
            name: 'running',
            data: { progress: 0 }
          }
        }
      })
    return state
  },
  [UPLOAD_PROGRESS]: (
    state: VideoRecordArray,
    { payload }: Action<{ id: string, progress: number }>
  ): VideoRecordArray => {
    if (!state.get(payload.id)) {
      throw Error(`Unknown id: ${payload.id}`)
    }
    return state.mergeDeep({
      [payload.id]: {
        uploadStatus: {
          data: { progress: payload.progress }
        }
      }
    })
  },
  [UPLOAD_SUCCESS]: (
    state: VideoRecordArray,
    { payload }: Action<{ id: string, hash: string }>
  ): VideoRecordArray => {
    if (!state.get(payload.id)) {
      throw Error(`Unknown id: ${payload.id}`)
    }
    return state.mergeDeep({
      [payload.id]: {
        uploadStatus: {
          name: 'success...',
          data: { ipfsHash: payload.hash }
        }
      }
    })
  },
  [UPLOAD_LOCAL_SUCCESS]: (
    state: VideoRecordArray,
    { payload }: Action<{ id: string, hash: string }>
  ): VideoRecordArray => {
    if (!state.get(payload.id)) {
      throw Error(`Unknown id: ${payload.id}`)
    }
    return state.mergeDeep({
      [payload.id]: {
        uploadStatus: {
          name: 'uploaded to local ipfs node',
          data: { ipfsHash: payload.hash }
        }
      }
    })
  },
  [UPDATE_VIDEO_INFO]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'videoInfo'], payload)
  },
  [VIDEO_DATA_START]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'blockchainStatus'], {
      name: 'running',
      data: {}
    })
  },
  [VIDEO_DATA_SAVED]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'blockchainStatus'], {
      name: 'success',
      data: {}
    })
  },
  [TRANSCODING_REQUESTED]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'transcodingStatus'], {
      name: 'requested',
      data: {}
    })
  },
  [TRANSCODING_PROGRESS]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'transcodingStatus'], {
      name: 'progress',
      data: {}
    })
  },
  [TRANSCODING_SUCCESS]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'transcodingStatus'], {
      name: 'success',
      data: {}
    })
  },
  [TRANSCODING_FAILURE]: (
    state: VideoRecordArray,
    { payload }: Action<UploadRecord>
  ): VideoRecordArray => {
    return state.setIn([payload.id, 'transcodingStatus'], {
      name: 'failed',
      data: {}
    })
  }
}

export default handleActions(reducer, Map({}))
