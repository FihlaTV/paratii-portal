/* @flow */

import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'components/foundations/Button'
import Title from 'components/foundations/Title'
import TruncatedText from 'components/foundations/TruncatedText'
import PlayerControlsContainer from 'containers/PlayerControlsContainer'
import VideoRecord from 'records/VideoRecords'
import { TRANSITION_STATE } from 'constants/ApplicationConstants'

import type { TransitionState } from 'types/ApplicationTypes'

type Props = {
  video: ?VideoRecord,
  isEmbed?: boolean,
  onClick: (e: Object) => void,
  transitionState: ?TransitionState,
  showShareModal?: boolean,
  togglePlayPause: () => void,
  toggleShareModal: (e: Object) => void,
  toggleFullscreen: (goToFullscreen: boolean) => void,
  onScrub: (percentage: number) => void,
  onVolumeChange: (percentage: number) => void,
  onToggleMute: (mute: boolean) => void,
  onPlaybackLevelChange: (levelId: number) => void
}

type State = {
  openPopover: ?string,
  buttons: {
    profile: ?Class<React.Component<any>>
  }
}

const CONTROLS_HEIGHT: string = '75px'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const overlayPadding: string = '20px 25px 0'

const Overlay = styled.div`
  width: 100%;
  flex: 0 0 calc(100% - ${CONTROLS_HEIGHT});
  display: flex;
  flex-direction: column;
  color: white;
  box-sizing: border-box;
  opacity: ${({ transitionState }) => {
    switch (transitionState) {
      case TRANSITION_STATE.ENTERING:
      case TRANSITION_STATE.EXITED:
        return '0'
      case TRANSITION_STATE.EXITING:
      case TRANSITION_STATE.ENTERED:
      default:
        return '1.0'
    }
  }};
  transition: all ${({ theme }) => theme.animation.time.repaint}
    ${({ theme }) => theme.animation.ease.smooth};
`

const VideoInfo = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 0 0;
  padding: ${overlayPadding};
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  transform: translateY(
    ${({ transitionState }) => {
    switch (transitionState) {
      case TRANSITION_STATE.ENTERING:
      case TRANSITION_STATE.EXITED:
        return '-75px'
      case TRANSITION_STATE.EXITING:
      case TRANSITION_STATE.ENTERED:
      default:
        return 0
    }
  }}
  );
  transition: all ${({ theme }) => theme.animation.time.repaint}
    ${({ theme }) => theme.animation.ease.smooth};
`

const PlayerTitle = Title.extend`
  color: ${props => props.theme.colors.VideoPlayer.header.title};
  flex: 0 0 75%;
  max-width: 75%;
`

const ButtonGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1 0 0;
  justify-content: flex-end;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
`

const ButtonWrapper = styled.div`
  width: 25px;
  height: 25px;
`

const ShareButton = Button.extend`
  height: 18px;
  position: absolute;
  right: 25px;
  top: 28px;
  width: 30px;
`

const SVGButton = styled.svg`
  fill: ${props => props.theme.colors.VideoPlayer.header.icons};
  display: block;
  height: 100%;
  width: 100%;
`

const PopoverWrapper = styled.div`
  position: absolute;
  top: ${overlayPadding};
  right: ${overlayPadding};
  width: 230px;
  height: 110px;
  display: ${props => (props.open ? 'block' : 'none')};
  cursor: default;
`

class VideoOverlay extends Component<Props, State> {
  onProfileButtonClick: (e: Object) => void
  popoverWrapperRefCallback: (ref: HTMLElement) => void
  popoverWrapperRef: ?HTMLElement

  constructor (props: Props) {
    super(props)

    this.state = {
      openPopover: null,
      buttons: {
        profile: null
      }
    }

    this.loadEmbedPlugins()
  }

  loadEmbedPlugins () {
    // Disabled this as it is not working
    // const { isEmbed } = this.props
    // if (isEmbed) {
    //   import(/* webpackChunkName: ProfileButton */ 'components/widgets/PlayerPlugins/ProfileButton').then(
    //     ProfileButtonModule => {
    //       const ProfileButton: Class<
    //         React.Component<any>
    //       > = ((ProfileButtonModule.default: any): Class<React.Component<any>>)
    //       this.setState(prevState => ({
    //         buttons: {
    //           ...prevState.buttons,
    //           profile: ProfileButton
    //         }
    //       }))
    //     }
    //   )
    // }
  }

  getVideoTitle (): string {
    const { video } = this.props

    return (video && (video.get('title') || video.get('filename'))) || ''
  }

  onProfileButtonClick = (e: Object): void => {
    e.stopPropagation()
    this.setState({
      openPopover: 'profile'
    })
  }

  closePopover = (e: Object): void => {
    e.stopPropagation()
    this.setState({
      openPopover: null
    })
  }

  popoverWrapperRefCallback = (ref: HTMLElement): void => {
    this.popoverWrapperRef = ref
  }

  render () {
    const {
      onClick,
      onScrub,
      onVolumeChange,
      onToggleMute,
      onPlaybackLevelChange,
      togglePlayPause,
      toggleShareModal,
      toggleFullscreen,
      transitionState
    } = this.props
    const { openPopover } = this.state
    const ProfileButton: ?Class<React.Component<any>> = this.state.buttons
      .profile
    return (
      <Wrapper>
        <Overlay
          data-test-id="video-overlay"
          onClick={onClick}
          transitionState={transitionState}
        >
          <VideoInfo transitionState={transitionState}>
            <PlayerTitle small>
              <TruncatedText>{this.getVideoTitle()}</TruncatedText>
            </PlayerTitle>
            <ButtonGroup hide={!!this.state.openPopover}>
              {ProfileButton ? (
                <ButtonWrapper>
                  <ProfileButton
                    onClick={this.onProfileButtonClick}
                    onClose={this.closePopover}
                    popoverPortal={this.popoverWrapperRef}
                    popoverOpen={openPopover === 'profile'}
                  />
                </ButtonWrapper>
              ) : null}
              <ButtonWrapper>
                <ShareButton
                  onClick={(e: Object) => {
                    e.stopPropagation()
                    toggleShareModal(e)
                  }}
                >
                  {!this.props.showShareModal && (
                    <SVGButton>
                      <use xlinkHref="#icon-player-share" />
                    </SVGButton>
                  )}
                </ShareButton>
              </ButtonWrapper>
            </ButtonGroup>
            <PopoverWrapper
              open={!!openPopover}
              innerRef={this.popoverWrapperRefCallback}
            />
          </VideoInfo>
        </Overlay>
        <PlayerControlsContainer
          onScrub={onScrub}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          onPlaybackLevelChange={onPlaybackLevelChange}
          togglePlayPause={togglePlayPause}
          toggleFullscreen={toggleFullscreen}
          transitionState={transitionState}
        />
      </Wrapper>
    )
  }
}

export default VideoOverlay
