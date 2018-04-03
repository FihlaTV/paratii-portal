import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'components/foundations/Button'
import MainHeaderLogo from 'components/widgets/MainHeaderLogo'
import MainNavigation from 'components/structures/header/MainNavigation'
import { Link } from 'react-router-dom'
import Blockies from 'react-blockies'

import { Z_INDEX_HEADER } from 'constants/UIConstants'

type Props = {
  children: Object
}

const Header = styled.header`
  background-color: ${props => props.theme.colors.header.background};
  box-shadow: ${({ displayShadow }) =>
    displayShadow ? '0 3px 5px rgba(0,0,0,0.16)' : ''};
  display: flex;
  padding: 20px 80px;
  position: fixed;
  transition: box-shadow 0.3s;
  width: 100%;
  z-index: ${Z_INDEX_HEADER};

  @media (max-width: 768px) {
    height: ${props => (props.open ? '100vh' : null)};
    padding: 20px 40px;
  }
`

const HeaderWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    align-content: baseline;
    flex-wrap: wrap;
  }
`

const HeaderContent = styled.div`
  align-items: center;
  display: flex;

  @media (max-width: 768px) {
    display: ${props => (props.open ? 'block' : 'none')};
    flex: 1 1 100%;
  }

  form {
    flex: 0 0 207px;
    transform: translate3d(82px, -5px, 0);
  }
`

const HeaderButtons = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 30px;
  }
`

// foundation/widgets(move?)

const ProfileAvatarLink = styled(Link)`
  background-color: ${props => props.theme.colors.header.color};
  border-radius: 100%;
  flex: 0 0 40px;
  height: 40px;
  margin-left: 45px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const MobileButton = styled(Button)`
  display: none;
  height: 20px;
  position: absolute;
  right: 30px;
  top: 24px;
  width: 20px;
  z-index: 3;

  @media (max-width: 768px) {
    display: block;
  }
`

const SVG = styled.svg`
  fill: ${props => props.theme.colors.Modal.close};
  display: block;
  height: 100%;
  width: 100%;
`

class MainHeader extends Component<Props, void> {
  constructor (props) {
    super(props)
    this.state = {
      navOpen: false,
      displayShadow: false
    }

    this.openNav = this.openNav.bind(this)
    this.closeNav = this.closeNav.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
  }

  componentDidMount () {
    this.bindScroll()
  }

  componentWillUnmount () {
    this.unbindScroll()
  }

  bindScroll = () => {
    // Use passive event listener if available
    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassive = true
        }
      })
      window.addEventListener('test', null, opts)
    } catch (e) {} // eslint-disable-line no-empty

    window.addEventListener(
      'scroll',
      this.handleScroll,
      supportsPassive ? { passive: true } : false
    )
  }

  unbindScroll = () => {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    // Ugly cross-browser compatibility
    const top =
      document.documentElement.scrollTop ||
      document.body.parentNode.scrollTop ||
      document.body.scrollTop

    // Test < 1 since Safari's rebound effect scrolls past the top
    if (top < 1) {
      this.setState({ displayShadow: false })
    } else if (this.state.displayShadow === false) {
      this.setState({ displayShadow: true })
    }
  }

  openNav () {
    this.setState({
      navOpen: true
    })
  }

  closeNav () {
    this.setState({
      navOpen: false
    })
  }

  toggleNav () {
    this.setState({
      navOpen: !this.state.navOpen
    })
  }

  render () {
    return (
      <Header
        displayShadow={this.state.displayShadow}
        open={this.state.navOpen}
      >
        {this.props.children}
        <HeaderWrapper open={this.state.navOpen}>
          <MainHeaderLogo />
          <HeaderContent open={this.state.navOpen}>
            <HeaderButtons>
              <MainNavigation closeNav={this.closeNav} />
              <ProfileAvatarLink onClick={this.closeNav} to="/wallet">
                <Blockies
                  seed={window.paratii.config.account.address}
                  size={10}
                  scale={4}
                />
              </ProfileAvatarLink>
            </HeaderButtons>
          </HeaderContent>
          <MobileButton onClick={this.toggleNav} open={this.state.navOpen}>
            <SVG>
              <use
                xlinkHref={this.state.navOpen ? '#icon-close' : '#icon-menu'}
              />
            </SVG>
          </MobileButton>
        </HeaderWrapper>
      </Header>
    )
  }
}

export default MainHeader
