/* @flow */

import React, { Component } from 'react'
import { Events } from 'clappr'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import Transition from 'react-transition-group/Transition'

import VideoRecord from 'records/VideoRecords'
import VideoOverlay from 'components/VideoOverlay'
import Button from 'components/foundations/Button'
import Title from 'components/foundations/Title'
import NotFound from './pages/NotFound'
import { requestFullscreen, requestCancelFullscreen } from 'utils/AppUtils'

import type { ClapprPlayer } from 'types/ApplicationTypes'
import type { Match } from 'react-router-dom'

type Props = {
  match: Match,
  setSelectedVideo: (id: string) => void,
  setFullscreen: (isFullscreen: boolean) => void,
  fetchVideo: (id: string) => void,
  isPlaying: boolean,
  togglePlayPause: (play: ?boolean) => void,
  updateVideoTime: ({ duration: number, time: number, id: string }) => void,
  updateVideoBufferedTime: ({ time: number }) => void,
  updateVolume: (percentage: number) => void,
  isAttemptingPlay: boolean,
  attemptPlay: () => void,
  video?: VideoRecord,
  isEmbed?: boolean,
  currentTimeSeconds: number,
  currentBufferedTimeSeconds: number
}

type State = {
  mouseInOverlay: boolean,
  shouldShowVideoOverlay: boolean,
  videoNotFound: boolean,
  showShareModal: boolean,
  playerCreated: string
}

const Wrapper = styled.div`
  margin: ${props => (props.isEmbed ? null : '0 auto')};
  position: relative;
  height: ${props => (props.isEmbed ? '100%' : '720px')};
  width: 100%;

  @media (max-width: 1440px) {
    height: ${props => (props.isEmbed ? null : '576px')};
  }

  @media (max-width: 1200px) {
    height: ${props => (props.isEmbed ? null : '432px')};
  }
`

const PlayerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`

const Player = styled.div`
  width: 100%;
  height: 100%;
  z-index: 5;
`

const OverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: pointer;
`

const ShareOverlay = styled.div`
  align-items: center;
  background-color: ${props => props.theme.colors.Modal.background};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: ${props => (props.show ? 1 : 0)};
  position: absolute;
  pointer-events: ${props => (!props.show ? 'none' : null)};
  transition: opacity ${props => props.theme.animation.time.repaint};
  top: 0;
  width: 100%;
  z-index: 15;
`

const CloseButton = Button.extend`
  height: 20px;
  position: absolute;
  right: 30px;
  top: 27px;
  width: 20px;
  z-index: 3;
`

const SVGButton = styled.svg`
  fill: ${props => props.theme.colors.VideoPlayer.header.icons};
  display: block;
  height: 100%;
  width: 100%;
`

const ShareTitle = Title.extend`
  font-size: ${props => props.theme.fonts.video.share.title};
  margin-bottom: 20px;
`

const Anchor = Button.withComponent('a')

const AnchorLink = Anchor.extend`
  font-size: ${props => props.theme.fonts.video.share.link};
  padding: 0 10%;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
`

const ShareButtons = styled.div`
  display: flex;
  margin-top: 20px;
`

const ShareLink = Anchor.extend`
  height: 30px;
  margin: 0 5px;
  width: 30px;
`

const ShareLinkIcon = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`

const HIDE_CONTROLS_THRESHOLD: number = 2000

class Play extends Component<Props, State> {
  player: ?ClapprPlayer
  onOverlayClick: () => void
  toggleShareModal: () => void
  lastMouseMove: number
  playerHideTimeout: number
  wrapperRef: ?HTMLElement

  constructor (props: Props) {
    super(props)

    this.state = {
      mouseInOverlay: false,
      shouldShowVideoOverlay: false,
      videoNotFound: false,
      showShareModal: false,
      playerCreated: ''
    }

    this.lastMouseMove = 0
    this.playerHideTimeout = 0

    this.onOverlayClick = this.onOverlayClick.bind(this)
    this.toggleShareModal = this.toggleShareModal.bind(this)

    this.props.setSelectedVideo(this.getVideoIdFromRequest())

    if (this.props.video) {
      this.props.updateVideoTime({
        duration: 0,
        id: this.props.video.get('id'),
        time: 0
      })
      this.props.updateVideoBufferedTime({
        time: 0
      })
    }
  }

  bindClapprEvents (): void {
    const { attemptPlay, togglePlayPause, updateVolume, video } = this.props
    const { player } = this
    if (player) {
      player.on(Events.PLAYER_PLAY, (): void => {
        togglePlayPause(true)
      })
      player.on(Events.PLAYER_PAUSE, (): void => {
        togglePlayPause(false)
      })
      player.on(Events.PLAYER_VOLUMEUPDATE, (volume: number): void => {
        updateVolume(volume)
      })
      const playback = player.core.getCurrentPlayback()
      if (playback && video) {
        playback.on(Events.PLAYBACK_PLAY_INTENT, attemptPlay)
        playback.on(
          Events.PLAYBACK_TIMEUPDATE,
          ({ current, total }: { current: number, total: number }): void => {
            this.props.updateVideoTime({
              duration: total,
              id: video.get('id'),
              time: current
            })
          }
        )
        playback.on(
          Events.PLAYBACK_PROGRESS,
          ({ current }: { current: number }): void => {
            this.props.updateVideoBufferedTime({
              time: current
            })
          }
        )
      }
    }
  }

  onOverlayClick (e: Object): void {
    if (this.player) {
      e.stopPropagation()
      this.togglePlayPause()
    }
  }

  toggleShareModal (): void {
    this.setState({
      showShareModal: !this.state.showShareModal
    })
  }

  onMouseEnter = (): void => {
    if (this.player) {
      clearTimeout(this.playerHideTimeout)
      this.showControls()
    }
  }

  showControls = (): void => {
    clearTimeout(this.playerHideTimeout)
    this.setState((prevState: State) => {
      if (!prevState.shouldShowVideoOverlay) {
        return {
          shouldShowVideoOverlay: true
        }
      }
    })
    this.playerHideTimeout = setTimeout(() => {
      this.setState((prevState: State) => {
        if (prevState.shouldShowVideoOverlay) {
          return {
            shouldShowVideoOverlay: false
          }
        }
      })
    }, HIDE_CONTROLS_THRESHOLD)
  }

  scrubVideo = (percentage: number): void => {
    const { video } = this.props
    const videoDuration: number = video.get('duration')
    if (this.player && videoDuration) {
      this.player.seek(videoDuration * percentage / 100)
    }
  }

  changeVolume = (percentage: number): void => {
    const { player } = this

    if (player) {
      player.setVolume(percentage)
    }
  }

  toggleMute = (mute: boolean): void => {
    const { player } = this

    if (player) {
      if (mute) {
        player.mute()
      } else {
        player.unmute()
      }
    }
  }

  onMouseMove = debounce(
    (): void => {
      this.lastMouseMove = Date.now()
      this.showControls()
    },
    150,
    { leading: true, trailing: false }
  )

  onMouseLeave = (): void => {
    if (this.player) {
      clearTimeout(this.playerHideTimeout)
      this.playerHideTimeout = setTimeout(() => {
        this.setState({
          shouldShowVideoOverlay: false
        })
      })
    }
  }

  maybeHideControls = (): void => {
    this.playerHideTimeout = setTimeout(() => {
      if (Date.now() - this.lastMouseMove > HIDE_CONTROLS_THRESHOLD) {
      }
    }, HIDE_CONTROLS_THRESHOLD + 250)
  }

  getVideoIdFromRequest (): string {
    const params: Object = this.props.match.params
    return params.id || ''
  }

  setFullscreen = (): void => {
    const { setFullscreen } = this.props
    setFullscreen(
      !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement
    )
  }

  componentDidMount (): void {
    const videoId = this.getVideoIdFromRequest()
    if (videoId) {
      if (this.props.video && this.props.video.ipfsHash) {
        this.createPlayer(this.props.video.ipfsHash)
      } else {
        this.props.fetchVideo(videoId)
      }
    } else {
      this.setState({ videoNotFound: true })
    }

    document.addEventListener('fullscreenchange', this.setFullscreen)
    document.addEventListener('mozfullscreenchange', this.setFullscreen)
    document.addEventListener('webkitfullscreenchange', this.setFullscreen)
    document.addEventListener('MSFullscreenChange', this.setFullscreen)
  }

  componentWillUnmount (): void {
    document.removeEventListener('fullscreenchange', this.setFullscreen)
    document.removeEventListener('mozfullscreenchange', this.setFullscreen)
    document.removeEventListener('webkitfullscreenchange', this.setFullscreen)
    document.removeEventListener('MSFullscreenChange', this.setFullscreen)
  }

  componentWillReceiveProps (nextProps: Props): void {
    const { video } = this.props
    if (nextProps.video) {
      const fetchStatus = nextProps.video.getIn(['fetchStatus', 'name'])
      if (nextProps.video && fetchStatus === 'success') {
        if (
          !video ||
          video.get('ipfsHash') !== nextProps.video.get('ipfsHash')
        ) {
          this.createPlayer(nextProps.video.ipfsHash)
        }
      } else if (fetchStatus === 'failed') {
        // If video not exist we set in the component state
        this.setState({ videoNotFound: true })
      }
    }
  }

  createPlayer (ipfsHash: string): void {
    this.setState({ playerCreated: ipfsHash })
    if (this.player && this.player.remove) {
      this.player.remove()
    }
    if (!ipfsHash) {
      throw new Error("Can't create player without ipfsHash")
    }
    import('paratii-mediaplayer').then(CreatePlayer => {
      this.player = CreatePlayer({
        selector: '#player',
        source: `https://gateway.paratii.video/ipfs/${ipfsHash}/master.m3u8`,
        mimeType: 'video/mp4',
        ipfsHash: ipfsHash,
        autoPlay: true
      })
      this.bindClapprEvents()
    })
  }

  togglePlayPause = (): void => {
    const { player } = this
    if (player) {
      if (player.isPlaying()) {
        player.pause()
      } else {
        player.play()
      }
    }
  }

  onPlayerClick = (e: Object): void => {
    clearTimeout(this.playerHideTimeout)
    this.showControls()
  }

  shouldShowVideoOverlay (): boolean {
    return this.state.mouseInOverlay
  }

  portalUrl () {
    // FIXME: do not hardcode this heres
    return 'https://portal.paratii.video'
  }
  facebook () {
    if (this.props.video) {
      var baseurl = 'https://www.facebook.com/sharer/sharer.php?u='
      return baseurl + this.portalUrl() + '/play/' + this.props.video.id
    }
  }
  twitter () {
    if (this.props.video) {
      var baseurl = 'https://twitter.com/intent/tweet'
      var url = '?url=' + this.portalUrl() + '/play/' + this.props.video.id
      var text = '&text=🎬 Worth a watch: ' + this.props.video.title
      return baseurl + url + text
    }
  }
  whatsapp () {
    if (this.props.video) {
      var baseurl = 'whatsapp://send?text='
      var url = this.portalUrl() + '/play/' + this.props.video.id
      var text = '🎬 Worth a watch: ' + this.props.video.title + ' '
      return baseurl + text + url
    }
  }
  whatsappDesktop () {
    if (this.props.video) {
      var baseurl = 'https://web.whatsapp.com/send?text='
      var url = this.portalUrl() + '/play/' + this.props.video.id
      var text = '🎬 Worth a watch: ' + this.props.video.title + ' '
      return baseurl + text + url
    }
  }
  telegram () {
    if (this.props.video) {
      var baseurl = 'https://t.me/share/url'
      var url = '?url=' + this.portalUrl() + '/play/' + this.props.video.id
      var text = '&text=🎬 Worth a watch: ' + this.props.video.title
      return baseurl + url + text
    }
  }
  render () {
    const { isEmbed, video } = this.props
    if (this.state.videoNotFound) {
      return <NotFound />
    } else {
      return (
        <Wrapper>
          <PlayerWrapper
            onClick={this.onPlayerClick}
            onMouseEnter={this.onMouseEnter}
            innerRef={(ref: HTMLElement) => {
              this.wrapperRef = ref
            }}
          >
            <Transition
              in={this.state.shouldShowVideoOverlay || true}
              timeout={0}
            >
              {(transitionState: ?string) => (
                <OverlayWrapper
                  onMouseLeave={this.onMouseLeave}
                  onMouseMove={this.onMouseMove}
                >
                  <VideoOverlay
                    onClick={this.onOverlayClick}
                    video={video}
                    isEmbed={isEmbed}
                    toggleShareModal={this.toggleShareModal}
                    showShareModal={this.state.showShareModal}
                    onScrub={this.scrubVideo}
                    onVolumeChange={this.changeVolume}
                    onToggleMute={this.toggleMute}
                    transitionState={transitionState}
                    togglePlayPause={this.togglePlayPause}
                    toggleFullscreen={(goToFullscreen: boolean): void => {
                      if (goToFullscreen && this.wrapperRef) {
                        requestFullscreen(this.wrapperRef)
                      } else {
                        requestCancelFullscreen()
                      }
                    }}
                  />
                </OverlayWrapper>
              )}
            </Transition>
            <Player id="player" />
            {this.props.video ? (
              <ShareOverlay show={this.state.showShareModal}>
                <CloseButton onClick={this.toggleShareModal}>
                  <SVGButton>
                    <use xlinkHref="#icon-close" />
                  </SVGButton>
                </CloseButton>
                <ShareTitle small />
                <AnchorLink
                  href={this.portalUrl() + '/play/' + this.props.video.id}
                  target="_blank"
                  anchor
                  white
                >
                  {this.portalUrl() + '/play/' + this.props.video.id}
                </AnchorLink>
                <ShareButtons>
                  <ShareLink href={this.telegram()} target="_blank" anchor>
                    <ShareLinkIcon src="/assets/assets/svg/icons-share-telegram.svg" />
                  </ShareLink>
                  <ShareLink href={this.twitter()} target="_blank" anchor>
                    <ShareLinkIcon src="/assets/assets/svg/icons-share-twitter.svg" />
                  </ShareLink>
                  <ShareLink href={this.whatsapp()} target="_blank" anchor>
                    <ShareLinkIcon src="/assets/assets/svg/icons-share-whatsapp.svg" />
                  </ShareLink>
                </ShareButtons>
              </ShareOverlay>
            ) : null}
          </PlayerWrapper>
        </Wrapper>
      )
    }
  }
}

export default Play
