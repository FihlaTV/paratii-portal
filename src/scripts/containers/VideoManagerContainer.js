import { Map } from 'immutable'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { CardContainer } from 'components/structures/Card'
import PTIGuide from 'components/widgets/PTIGuide'
import VideoRecord from 'records/VideoRecords'
import { getVideos, getVideo } from 'selectors/index'
import type { RootState } from 'types/ApplicationTypes'

import RedeemVoucher from 'components/widgets/RedeemVoucher'
import VideoList from './VideoListContainer'
import VideoForm from './VideoFormContainer'
import UploadFile from './UploadFileContainer'

type Props = {
  videos: Map<string, VideoRecord>,
  selectedVideo: ?VideoRecord
}

class VideoManagerContainer extends Component<Props, void> {
  render () {
    const showForm = this.props.selectedVideo
    const showList = this.props.videos.size > 0 || this.selectedVideo

    return (
      <CardContainer>
        {showList ? <VideoList /> : ''}
        {showForm ? <VideoForm /> : <UploadFile />}
        {!showList ? <RedeemVoucher /> : ''}
        {!showForm && <PTIGuide />}
      </CardContainer>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  videos: getVideos(state),
  selectedVideo: getVideo(state)
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(
  VideoManagerContainer
)
