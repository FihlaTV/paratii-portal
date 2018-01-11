/* @flow */

import React, { Component } from 'react'
import styled from 'styled-components'
import CreatePlayer from 'paratii-mediaplayer'
import VideoRecord from 'records/VideoRecords'

import type { RouteMatch } from 'types/ApplicationTypes'

type Props = {
  match: RouteMatch,
  fetchVideo: (id: string) => void,
  video: ?VideoRecord
};

const Wrapper = styled.div`
  font-size: 20px;
  flex: 1 1 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.header`
  display: none;
  background-color: #fff;
  padding: 20px;
  align-items: center;
  color: blue;
  flex: 0 0 50px;
  width: 100%;
  text-align: left;
`

const Player = styled.div`
  width: 100%;
  flex: 0 0 50%;
`

class Play extends Component<Props, void> {
  constructor (props: Props): void {
    super(props)

    const videoId = this.props.match.params.id

    if (videoId) {
      this.props.fetchVideo(videoId)
    }
  }

  // componentWillReceiveProps (nextProps: Props): void {
  //   console.log('will receive')
  //   console.log(this.props.video)
  //   if (nextProps.video && !this.props.video) {
  //     const nextVideo: VideoRecord = nextProps.video
  //     console.log(nextProps.video)
  //
  //     CreatePlayer({
  //       selector: '#player',
  //       source:
  //       `https://gateway.paratii.video/ipfs/${nextVideo.get('ipfsData')}`,
  //       mimeType: 'video/mp4',
  //       ipfsHash: nextVideo.get('ipfsData')
  //     })
  //   }
  // }

  componentDidMount (): void {
    const videoId = this.props.match.params.id

    CreatePlayer({
      selector: '#player',
      source:
      `https://gateway.paratii.video/ipfs/${videoId}`,
      mimeType: 'video/mp4',
      ipfsHash: videoId
    })
  }

  render () {
    console.log('render')
    return (
      <Wrapper>
        <Body>
          <Title>Play Video:</Title>
          <Player id="player" />
        </Body>
      </Wrapper>
    )
  }
}

export default Play
