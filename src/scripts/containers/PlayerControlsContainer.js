/* @flow */

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PlayerControls from 'components/PlayerControls'
import {
  getIsPlaying,
  getIsFullscreen,
  getPlayerCurrentTimeSeconds,
  getPlayerCurrentBufferedTimeSeconds,
  getPlayerCurrentVolume,
  getActivePlugin
} from 'selectors/index'
import {
  getPlayingVideo,
  getFormattedCurrentTime,
  getFormattedDuration,
  getDurationSeconds,
  getCurrentPlaybackLevel,
  getPlaybackLevelsSorted
} from 'selectors/PlayerSelectors'
import { playerSetActivePlugin } from 'actions/PlayerActions'

import type { RootState } from 'types/ApplicationTypes'
import type { Dispatch } from 'redux'

const mapStateToProps = (state: RootState): Object => ({
  video: getPlayingVideo(state),
  videoDurationSeconds: getDurationSeconds(state),
  isPlaying: getIsPlaying(state),
  isFullscreen: getIsFullscreen(state),
  currentTimeSeconds: getPlayerCurrentTimeSeconds(state),
  currentBufferedTimeSeconds: getPlayerCurrentBufferedTimeSeconds(state),
  currentVolume: getPlayerCurrentVolume(state),
  formattedCurrentTime: getFormattedCurrentTime(state),
  formattedDuration: getFormattedDuration(state),
  playbackLevels: getPlaybackLevelsSorted(state),
  currentPlaybackLevel: getCurrentPlaybackLevel(state),
  activePlugin: getActivePlugin(state)
})

const mapDispatchToProps = (dispatch: Dispatch<*>): Object => ({
  setActivePlugin: bindActionCreators(playerSetActivePlugin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls)
