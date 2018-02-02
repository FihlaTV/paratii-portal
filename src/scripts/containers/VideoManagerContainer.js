import { Map } from 'immutable'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { setSelectedVideo } from 'actions/VideoActions'

import VideoRecord from 'records/VideoRecords'

import { getUploads, getVideo } from 'selectors/index'
import type { RootState } from 'types/ApplicationTypes'

import VideoList from './VideoListContainer'
import VideoForm from './VideoFormContainer'
import Debug from './DebugContainer'
import UploadFile from './UploadFileContainer'

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.body.background};
  font-family: ${props =>
    props.theme.fonts.family ? props.theme.fonts.family : 'Monospace'},
    sans-serif;
  display: flex;
  flex-direction: row;
`

type Props = {
  videos: Map<string, VideoRecord>,
  selectedVideo: VideoRecord,
  setSelectedVideo: Object => void
}

class VideoManagerContainer extends Component<Props, void> {
  constructor (props) {
    super(props)
    props.setSelectedVideo(null)
    this.onVideoListItemClicked = this.onVideoListItemClicked.bind(this)
  }

  onVideoListItemClicked (id: string) {
    this.props.setSelectedVideo(id)
  }

  render () {
    const selectedVideo =
      this.props.selectedVideo && this.props.selectedVideo.id
    console.log('000000000000000000000000000')
    console.log(this.props.selectedVideo)
    console.log(this.props.videos)

    return (
      <Wrapper>
        <VideoList
          onItemClick={this.onVideoListItemClicked}
          videos={this.props.videos}
        />
        {selectedVideo === undefined && <UploadFile />}
        {selectedVideo !== undefined && <VideoForm />}
        <Debug />
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  videos: getUploads(state),
  selectedVideo: getVideo(state)
})

const mapDispatchToProps = dispatch => ({
  setSelectedVideo: bindActionCreators(setSelectedVideo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(
  VideoManagerContainer
)
