/* @flow */

import React, { Component } from 'react'
import styled from 'styled-components'
import VideoRecord from 'records/VideoRecords'

import Card from 'components/structures/Card'
import Button from './foundations/buttons/Button'
import Input from './widgets/forms/TextField'
import Textarea from './widgets/forms/TextareaField'
import RadioCheck, {
  RadioWrapper,
  RadioTitle
} from 'components/widgets/forms/RadioCheck'
import VideoProgress from 'components/widgets/VideoForm/VideoProgress'
import Hidden from 'components/foundations/Hidden'

type Props = {
  selectedVideo: VideoRecord,
  canSubmit: boolean,
  saveVideoInfo: Object => Object
}

const VideoFormWrapper = styled.div`
  display: flex;
  width: 100%;
`

const VideoFormHeader = styled.div`
  border-bottom: 1px solid
    ${props => props.theme.colors.VideoForm.header.border};
  margin-bottom: 40px;
  padding-bottom: 20px;
`

const VideoFormTitle = styled.h1`
  color: ${props => props.theme.colors.VideoForm.header.title};
  font-size: ${props => props.theme.fonts.video.form.title};
`

const VideoFormSubTitle = styled.p`
  color: ${props =>
    props.purple
      ? props.theme.colors.VideoForm.header.subtitle2
      : props.theme.colors.VideoForm.header.subtitle};
  font-size: ${props => props.theme.fonts.video.form.subtitle};
  margin-top: 3px;
`

const Form = styled.div`
  flex: 1 1 100%;
  margin-right: 45px;
`

const VideoFormInfos = styled.div`
  flex: 1 1 584px;
`

const VideoMedia = styled.div`
  margin-bottom: 15px;
  position: relative;
  width: 100%;
`

const VideoImage = styled.img`
  display: block;
  width: 100%;
`

const VideoMediaTime = styled.div`
  bottom: 10px;
  padding: 10px;
  position: absolute;
  right: 10px;

  &::before {
    background-color: ${props =>
    props.theme.colors.VideoForm.info.time.background};
    border-radius: 2px;
    content: '';
    height: 100%;
    left: 0;
    opacity: 0.8;
    position: absolute;
    top: 0;
    width: 100%;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 50px 0 0;
`

const VideoMediaTimeText = styled.p`
  color: ${props => props.theme.colors.VideoForm.info.time.color};
  font-size: ${props => props.theme.fonts.video.info.time};
  position: relative;
  z-index: 1;
`

class VideoForm extends Component<Props, Object> {
  handleSubmit: (e: Object) => void
  handleInputChange: (input: string, e: Object) => void

  constructor (props: Props) {
    super(props)
    this.state = new VideoRecord(this.props.selectedVideo)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps: Props): void {
    this.setState(nextProps.selectedVideo)
    this.setState({
      id: nextProps.selectedVideo.id,
      title: nextProps.selectedVideo.title,
      description: nextProps.selectedVideo.description
    })
  }

  handleInputChange (input: string, e: Object) {
    this.setState({
      [input]: e.target.value
    })
  }

  handleSubmit (e: Object) {
    e.preventDefault()
    const videoToSave = {
      id: this.state.id,
      title: this.state.title,
      description: this.state.description
    }
    this.props.saveVideoInfo(videoToSave)
  }

  render () {
    const video = this.props.selectedVideo
    const progressUpdate = video.getIn(['uploadStatus', 'data', 'progress'])
    const thumbImages = video.getIn([
      'transcodingStatus',
      'data',
      'sizes',
      'screenshots'
    ])
    const ipfsHash = video.ipfsHash
    let thumbImage = ''
    if (thumbImages !== undefined) {
      thumbImage = thumbImages.get(1)
    }
    const state = JSON.stringify(this.state, null, 2)
    return (
      <Card full>
        <VideoFormHeader>
          <VideoFormTitle id="video-title">{this.state.id}</VideoFormTitle>
          <Hidden>
            ({this.state.id} - {ipfsHash})
          </Hidden>{' '}
          <VideoFormSubTitle purple>345MB</VideoFormSubTitle>
        </VideoFormHeader>
        <VideoFormWrapper>
          <Form>
            <Input
              id="video-id"
              type="hidden"
              value={this.state.id}
              label="Title"
            />
            <Input
              id="video-title"
              label="Title"
              type="text"
              value={this.state.title}
              onChange={e => this.handleInputChange('title', e)}
              margin="0 0 30px"
            />
            <Textarea
              id="video-description"
              label="Description"
              value={this.state.description}
              rows="1"
              margin="0 0 30px"
              onChange={e => this.handleInputChange('description', e)}
            />
            <RadioWrapper>
              <RadioTitle>Paid or free</RadioTitle>
              <RadioCheck name="content-type" value="free">
                Free content
              </RadioCheck>
              <RadioCheck name="content-type" value="paid" nomargin disabled>
                Paid content (not available yet)
              </RadioCheck>
            </RadioWrapper>
            <ButtonWrapper>
              <Button
                id="video-submit"
                type="submit"
                onClick={this.handleSubmit}
                // disabled={!this.props.canSubmit}
                purple
              >
                Save data
              </Button>
            </ButtonWrapper>
          </Form>
          <VideoFormInfos>
            <VideoMedia>
              <VideoImage
                data-src={thumbImage}
                src={`http://paratii.video/public/images/paratii-src.png`}
              />
              <VideoMediaTime>
                <VideoMediaTimeText>28:26</VideoMediaTimeText>
              </VideoMediaTime>
            </VideoMedia>
            <VideoProgress progress={progressUpdate + '%'} marginBottom>
              Upload
            </VideoProgress>
            <VideoProgress progress="45%" marginBottom>
              Transcoding
            </VideoProgress>

            <Input
              id="video-title"
              type="text"
              margin="0 0 30px"
              onChange={e => this.handleInputChange('title', e)}
              value="<iframe width=560 height=315 src=https://"
              label="Embed Code"
              readonly
            />
            <Hidden>{state}</Hidden>
          </VideoFormInfos>
        </VideoFormWrapper>
      </Card>
    )
  }
}

export default VideoForm
