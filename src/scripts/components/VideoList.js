import React, { Component } from 'react'
import styled from 'styled-components'

import type { VideoRecord } from 'records/VideoRecords'
import type { Map } from 'immutable'

import VideoListItem from 'components/VideoListItem'
import Card from 'components/structures/Card'
import Button from 'components/foundations/Button'

type Props = {
  videos: Map<string, VideoRecord>, // maps video ids to upload records
  setSelectedVideo: Object => void
  // onItemClick: (id: string) => void
}

const Title = styled.h3`
  color: ${props => props.theme.colors.VideoList.title};
  font-size: ${props => props.theme.fonts.video.list.title};
  margin-bottom: 37px;
  padding: ${props => props.theme.sizes.card.padding};
  padding-bottom: 0;
`

const List = styled.ul`
  display: block;
  width: 100%;
`

class VideoList extends Component<Props, void> {
  constructor (props) {
    super(props)
    props.setSelectedVideo(null)
    this.onVideoListItemClicked = this.onVideoListItemClicked.bind(this)
  }

  onVideoListItemClicked (id: string) {
    this.props.setSelectedVideo(id)
  }

  render () {
    return (
      <Card
        margin="0 25px 0 0"
        nopadding
        footer={
          <Button onClick={() => this.onVideoListItemClicked(null)}>
            Add more videos
          </Button>
        }
      >
        <Title>Video List</Title>
        <List>
          {this.props.videos
            .entrySeq()
            .map(([videoId, videoInfo]) => (
              <VideoListItem
                key={videoId}
                video={videoInfo}
                onClick={this.onVideoListItemClicked}
              />
            ))}
        </List>
      </Card>
    )
  }
}

export default VideoList
