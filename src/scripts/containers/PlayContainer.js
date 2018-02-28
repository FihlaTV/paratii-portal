/* @flow */

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Play from 'components/Play'
import {
  attemptPlay,
  playerVideoSelect,
  updateVideoTime,
  updateVideoBufferedTime,
  togglePlayPause
} from 'actions/PlayerActions'
import { fetchVideo } from 'actions/VideoActions'
import {
  getIsPlaying,
  getIsAttemptingPlay,
  getPlayerCurrentTimeSeconds,
  getPlayerCurrentBufferedTimeSeconds
} from 'selectors/index'
import { getPlayingVideo } from 'selectors/PlayerSelectors'
import type { RootState } from 'types/ApplicationTypes'

const mapStateToProps = (
  state: RootState,
  ownProps: { isEmbed?: boolean }
) => ({
  video: getPlayingVideo(state),
  isPlaying: getIsPlaying(state),
  isAttemptingPlay: getIsAttemptingPlay(state),
  isEmbed: ownProps.isEmbed,
  currentTimeSeconds: getPlayerCurrentTimeSeconds(state),
  currentBufferedTimeSeconds: getPlayerCurrentBufferedTimeSeconds(state)
})

const mapDispatchToProps = dispatch => ({
  fetchVideo: bindActionCreators(fetchVideo, dispatch),
  setSelectedVideo: bindActionCreators(playerVideoSelect, dispatch),
  attemptPlay: bindActionCreators(attemptPlay, dispatch),
  updateVideoTime: bindActionCreators(updateVideoTime, dispatch),
  togglePlayPause: bindActionCreators(togglePlayPause, dispatch),
  updateVideoBufferedTime: bindActionCreators(updateVideoBufferedTime, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Play)
