import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import VideoRecord from 'records/VideoRecords'
import UserRecord from 'records/UserRecords'

import Card from './structures/Card'
import Button from './foundations/Button'
import TextField from './widgets/forms/TextField'
import Textarea from './widgets/forms/TextareaField'
import RadioCheck, {
  RadioWrapper,
  RadioTitle
} from './widgets/forms/RadioCheck'
import VideoProgress from 'components/widgets/VideoForm/VideoProgress'
import Hidden from 'components/foundations/Hidden'
import { prettyBytes } from 'utils/AppUtils'
import ModalStake from 'containers/ModalStakeContainer'

const VideoFormHeader = styled.div`
  border-bottom: 1px solid
    ${props => props.theme.colors.VideoForm.header.border};
  margin-bottom: 40px;
  padding-bottom: 20px;
`

const VideoFormWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;

  @media (max-width: 1150px) {
    flex-wrap: wrap;
  }
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
  padding-bottom: 70px;
  position: relative;

  @media (max-width: 1150px) {
    flex: 1 1 100%;
    margin: 0 0 50px;
  }
`

const VideoFormInfoBox = styled.div`
  flex: 1 1 584px;
  padding-bottom: 70px;
  position: relative;

  @media (max-width: 1150px) {
    flex: 1 1 100%;
  }
`
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 50px 0 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: baseline;
`

const ButtonWrapper = styled.div`
  margin-left: 20px;
  z-index: 5;
`

const VideoMedia = styled.div`
  margin-bottom: 15px;
  position: relative;
  width: 100%;
`

const VideoImage = styled.div`
  display: block;
  width: 100%;
  padding-top: 60%;
  background-color: black;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center center;
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

const VideoMediaTimeText = styled.p`
  color: ${props => props.theme.colors.VideoForm.info.time.color};
  font-size: ${props => props.theme.fonts.video.info.time};
  position: relative;
  z-index: 1;
`
const PublishLabel = styled.div`
  color: ${props => props.theme.colors.button.gray};
  font-size: ${props => props.theme.fonts.text.tiny};
  position: absolute;
  bottom: 0;
  z-index: 1;
`

type Props = {
  selectedVideo: VideoRecord,
  canSubmit: boolean,
  progress: Number,
  saveVideoInfo: Object => Object,
  showModal: (View: Object) => void,
  closeModal: () => void,
  user: UserRecord,
  balance: String
}

class VideoForm extends Component<Props, Object> {
  handleSubmit: () => void
  handlePublish: () => void
  onSubmit: (e: Object) => void
  handleInputChange: (input: string, e: Object) => void

  constructor (props: Props) {
    super(props)
    const selectedVideo = this.props.selectedVideo
    this.state = {
      id: selectedVideo.id,
      title: selectedVideo.title,
      description: selectedVideo.description,
      // FIXME: we are not editing duration, so we do not need to store it in the state
      duration: selectedVideo.duration,
      author: selectedVideo.author
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps: Props): void {
    const selectedVideo: ?VideoRecord = nextProps.selectedVideo
    if (selectedVideo && this.state.id !== selectedVideo.id) {
      this.setState({
        id: selectedVideo.id,
        title: selectedVideo.title,
        description: selectedVideo.description,
        // FIXME: we are not editing duration, so we do not need to store it in the state
        duration: selectedVideo.duration,
        author: selectedVideo.author
      })
    }
  }

  handleInputChange (input: string, e: Object) {
    this.setState({
      [input]: e.target.value
    })
  }

  handlePublish () {
    // this function is called by VideoModal
    this.handleSubmit()
    const videoToSave = {
      id: this.state.id,
      title: this.state.title,
      description: this.state.description,
      author: this.state.author,
      published: true
    }
    this.props.saveVideoInfo(videoToSave)
    this.props.closeModal()
  }

  handleSubmit () {
    const videoToSave = {
      id: this.state.id,
      title: this.state.title,
      description: this.state.description,
      author: this.state.author
    }
    this.props.saveVideoInfo(videoToSave)
  }

  onSubmit (e: Object) {
    e.preventDefault()

    this.props.showModal(
      <ModalStake
        videoId={this.state.id}
        onSuccess={this.handlePublish}
        user={this.props.user}
      />
    )
  }

  render () {
    const video: VideoRecord = this.props.selectedVideo
    // console.log(video.getIn(['transcodingStatus', 'data', 'result']))
    // console.log(video.getIn(['transcodingStatus', 'data', 'result', 'screenshots']))
    if (!this.state.id) {
      return (
        <Card>
          No video selected!
          {this.props.selectedVideo.id}
        </Card>
      )
    }

    const title = video.title || video.filename
    const duration = (video && video.get('duration')) || ''
    let durationBox = null
    if (duration) {
      durationBox = (
        <VideoMediaTime>
          <VideoMediaTimeText>{duration}</VideoMediaTimeText>
        </VideoMediaTime>
      )
    }

    const fileSize = prettyBytes((video && video.get('filesize')) || 0)
    const ipfsHash = (video && video.get('ipfsHash')) || ''
    const urlToPlay = `/play/${video.id}`
    const urlForSharing = `https://portal.paratii.video/play/${video.id}`

    const thumbImages =
      video &&
      video.getIn(['transcodingStatus', 'data', 'result', 'screenshots'])

    let thumbImage = ''
    if (thumbImages) {
      const firstThumb = thumbImages[0]
      thumbImage = `https://gateway.paratii.video/ipfs/${ipfsHash}/${firstThumb}`
    } else {
      thumbImage = 'https://paratii.video/public/images/paratii-src.png'
    }

    const uploadProgress = video.uploadStatus.data.progress
    const transcodingStatus = video.transcodingStatus.data.progress
    const progress = Math.ceil((uploadProgress + transcodingStatus) / 2)

    const isPublished = video.published === true || video.published === 'true'
    const isPublishable =
      video.transcodingStatus.name === 'success' && isPublished === false

    let publishButton
    if (isPublished) {
      publishButton = ''
    } else {
      publishButton = (
        <ButtonWrapper>
          <Button
            id="video-submit"
            type="submit"
            onClick={this.onSubmit}
            disabled={!isPublishable}
            purple
          >
            Publish
          </Button>
        </ButtonWrapper>
      )
    }

    const saveButton = (
      <ButtonWrapper>
        <Button
          id="video-submit"
          type="submit"
          onClick={this.handleSubmit}
          purple
        >
          Save Changes
        </Button>
      </ButtonWrapper>
    )

    return (
      <Card full>
        <VideoFormHeader>
          <VideoFormTitle id="video-title">{title}</VideoFormTitle>
          <VideoFormSubTitle purple>{fileSize}</VideoFormSubTitle>
        </VideoFormHeader>
        <VideoFormWrapper>
          <Form onSubmit={this.onSubmit}>
            <TextField
              id="video-id"
              type="hidden"
              value={this.state.id}
              label="Title"
            />
            <TextField
              label="Title"
              id="input-video-title"
              type="text"
              value={this.state.title}
              onChange={e => this.handleInputChange('title', e)}
              margin="0 0 30px"
            />
            <Textarea
              id="input-video-description"
              value={video.description}
              onChange={e => this.handleInputChange('description', e)}
              label="Description"
              rows="1"
              margin="0 0 30px"
            />
            <TextField
              label="Video Owner"
              id="input-video-owner"
              type="text"
              value={this.state.author}
              onChange={e => this.handleInputChange('author', e)}
              margin="0 0 30px"
            />
            <RadioWrapper>
              <RadioTitle>What kind of content?</RadioTitle>
              <RadioCheck name="content-type" value="free" defaultChecked>
                Free
              </RadioCheck>
              <RadioCheck name="content-type" value="paid" nomargin disabled>
                Paid (not available yet)
              </RadioCheck>
            </RadioWrapper>
            <ButtonContainer>
              {publishButton}
              {saveButton}
            </ButtonContainer>
          </Form>
          <VideoFormInfoBox>
            <VideoMedia>
              <Link to={urlToPlay}>
                <VideoImage data-src={thumbImage} src={thumbImage} />
              </Link>
              {durationBox}
            </VideoMedia>
            <VideoProgress progress={progress + '%'} marginBottom marginTop>
              {video.uploadStatus.data.progress === 100
                ? '2/2 - Transcoder: ' + video.transcodingStatus.name
                : '1/2 - Uploader: ' + video.uploadStatus.name}
            </VideoProgress>
            <Hidden>
              <TextField
                id="video-title"
                type="text"
                margin="0 0 30px"
                onChange={e => this.handleInputChange('title', e)}
                value="<iframe width=560 height=315 src=https://"
                label="Embed Code"
                readonly
              />
            </Hidden>
            <TextField
              id="video-title"
              type="text"
              margin="0 0 25px"
              onChange={e => this.handleInputChange('title', e)}
              value={urlForSharing}
              label="Share this video"
              readonly
            />
            {!isPublishable && !isPublished ? (
              <PublishLabel>
                You can publish this video as soon as it is{' '}
                <strong>ready</strong>
              </PublishLabel>
            ) : (
              ''
            )}
          </VideoFormInfoBox>
        </VideoFormWrapper>
      </Card>
    )
  }
}

export default VideoForm
