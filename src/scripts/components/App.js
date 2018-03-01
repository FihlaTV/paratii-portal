/* @flow */

import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import SignupContainer from 'containers/SignupContainer'
import LoginContainer from 'containers/LoginContainer'
import ProfileContainer from 'containers/ProfileContainer'
import PlayContainer from 'containers/PlayContainer'
import VideoManager from 'containers/VideoManagerContainer'
import DebugContainer from 'containers/DebugContainer'
import WalletContainer from 'containers/WalletContainer'

import type { Match } from 'react-router-dom'

import MainTemplate from './templates/MainTemplate'
import Modal from 'containers/ModalContainer'
import MainHeader from './structures/header/MainHeader'
import Main from './structures/Main'
import MainFooter from './structures/footer/MainFooter'
import Home from './pages/Home'
import Voucher from './pages/Voucher'
import NotFound from './pages/NotFound'

import { paratiiTheme } from 'constants/ApplicationConstants'

type Props = {
  initializeApp: () => void,
  match: Match,
  setSelectedVideo: (id: string) => void
}

type State = {
  modalContent: any,
  showModal: boolean
}

class App extends Component<Props, State> {
  showModal: () => void
  closeModal: () => void

  constructor (props: Props) {
    super(props)

    this.props.initializeApp()

    this.state = {
      modalContent: false,
      showModal: false
    }

    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  showModal (content: Object): void {
    this.setState({
      modalContent: content,
      showModal: true
    })
  }

  closeModal (): void {
    this.setState({
      showModal: false
    })
  }

  render () {
    const { match } = this.props
    return (
      <ThemeProvider theme={paratiiTheme}>
        <MainTemplate>
          <Modal />
          <MainHeader />
          <Main>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path={`${match.url}signup`} component={SignupContainer} />
              <Route path={`${match.url}login`} component={LoginContainer} />
              <Route
                path={`${match.url}profile`}
                component={ProfileContainer}
              />
              <Route
                path={`${match.url}upload`}
                render={props => (
                  <VideoManager
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                  />
                )}
              />
              <Route path={`${match.url}voucher`} component={Voucher} />
              <Route path={`${match.url}debug`} component={DebugContainer} />
              <Route path={`${match.url}wallet`} component={WalletContainer} />
              <Route
                path={`${match.url}play/:id`}
                render={props => <PlayContainer {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </Main>
          {/* <DebugContainer /> */}
          <MainFooter />
        </MainTemplate>
      </ThemeProvider>
    )
  }
}

export default App
