/* @flow */

import { connect } from 'react-redux'

import PlayerControls from 'components/PlayerControls'
import {
  getIsPlaying,
  getIsFullscreen,
  getPlayerCurrentTimeSeconds,
  getPlayerCurrentBufferedTimeSeconds,
  getPlayerCurrentVolume,
  getPlaybackLevels
} from 'selectors/index'
import {
  getPlayingVideo,
  getFormattedCurrentTime,
  getFormattedDuration,
  getDurationSeconds,
  getCurrentPlaybackLevel
} from 'selectors/PlayerSelectors'
import type { RootState } from 'types/ApplicationTypes'

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
  playbackLevels: getPlaybackLevels(state),
  currentPlaybackLevel: getCurrentPlaybackLevel(state)
})

export default connect(mapStateToProps)(PlayerControls)
