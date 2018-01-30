/* @flow */

import { combineReducers } from 'redux'

import video from 'reducers/VideoReducer'
import user from 'reducers/UserReducer'
import uploads from 'reducers/UploadReducer'

export default combineReducers({
  video,
  user,
  uploads
})
