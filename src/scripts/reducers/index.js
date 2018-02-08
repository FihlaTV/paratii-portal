/* @flow */

import { combineReducers } from 'redux'

import selectedVid from 'reducers/SelectedVideoReducer'
import user from 'reducers/UserReducer'
import player from 'reducers/PlayerReducer'
import videos from 'reducers/VideosReducer'

export default combineReducers({
  selectedVid,
  user,
  videos,
  player
})
