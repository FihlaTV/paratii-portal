/* @flow */

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Play from 'components/Play'
import {
  attemptPlay,
  setFullscreen,
  playerVideoSelect,
  updateVideoTime,
  updateVideoBufferedTime,
  togglePlayPause,
  updateVolume,
  playbackLevelsLoaded,
  playbackLevelSet,
  playerReset
} from 'actions/PlayerActions'
import { fetchVideo } from 'actions/VideoActions'
import {
  getIsPlaying,
  getIsAttemptingPlay,
  getPlayerCurrentTimeSeconds,
  getPlayerCurrentBufferedTimeSeconds,
  getPlayerCurrentVolume,
  getActivePlugin
} from 'selectors/index'
import { getPlayingVideo, getDurationSeconds } from 'selectors/PlayerSelectors'
import type { RootState } from 'types/ApplicationTypes'

const mapStateToProps = (
  state: RootState,
  ownProps: { isEmbed?: boolean }
) => ({
  video: getPlayingVideo(state),
  videoDurationSeconds: getDurationSeconds(state),
  isPlaying: getIsPlaying(state),
  isAttemptingPlay: getIsAttemptingPlay(state),
  isEmbed: ownProps.isEmbed,
  currentTimeSeconds: getPlayerCurrentTimeSeconds(state),
  currentBufferedTimeSeconds: getPlayerCurrentBufferedTimeSeconds(state),
  currentVolume: getPlayerCurrentVolume(state),
  activePlugin: getActivePlugin(state)
})

const mapDispatchToProps = dispatch => ({
  fetchVideo: bindActionCreators(fetchVideo, dispatch),
  setSelectedVideo: bindActionCreators(playerVideoSelect, dispatch),
  setFullscreen: bindActionCreators(setFullscreen, dispatch),
  attemptPlay: bindActionCreators(attemptPlay, dispatch),
  updateVideoTime: bindActionCreators(updateVideoTime, dispatch),
  togglePlayPause: bindActionCreators(togglePlayPause, dispatch),
  updateVideoBufferedTime: bindActionCreators(
    updateVideoBufferedTime,
    dispatch
  ),
  updateVolume: bindActionCreators(updateVolume, dispatch),
  playbackLevelsLoaded: bindActionCreators(playbackLevelsLoaded, dispatch),
  playbackLevelSet: bindActionCreators(playbackLevelSet, dispatch),
  playerReset: bindActionCreators(playerReset, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Play)
