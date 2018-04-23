/* @flow */

import { combineReducers } from 'redux'
import global from 'reducers/GlobalReducer'
import modal from 'reducers/ModalReducer'
import player from 'reducers/PlayerReducer'
import { reducer as notifications } from 'react-notification-system-redux'
import uploader from 'reducers/UploaderReducer'
import user from 'reducers/UserReducer'
import videos from 'reducers/VideosReducer'

export default combineReducers({
  global,
  uploader,
  user,
  videos,
  player,
  modal,
  notifications
})
