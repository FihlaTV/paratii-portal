/* @flow */
import paratii from 'utils/ParatiiLib'
import React, { Component } from 'react'
import styled from 'styled-components'
import Text from 'components/foundations/Text'
import Button from 'components/foundations/Button'
import TextField from 'components/widgets/forms/TextField'

import { ModalContentWrapper, ModalScrollContent } from './Modal'

type Props = {
  openModal: () => void
}

const Title = styled.h2`
  color: ${props => props.theme.colors.Modal.title};
  font-size: ${props => props.theme.fonts.modal.title};
  margin-bottom: 25px;
`
//
// const Highlight = styled(Text)`
//   color: ${props => props.theme.colors.Modal.hightlight};
//   margin-bottom: 14px;
// `

const MainText = styled(Text)`
  margin-bottom: 35px;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  width: 100%;
`

const ButtonContainer = styled.div`
  margin-left: 10px;
`

class ModalRewriteSeed extends Component<Props, Object> {
  showSeed: () => void
  checkSeed: () => void
  handleMnemonicChange: (e: Object) => void

  constructor (props: Props) {
    super(props)
    this.state = {
      mnemonic: '',
      error: ''
    }
    this.showSeed = this.showSeed.bind(this)
    this.checkSeed = this.checkSeed.bind(this)
    this.handleMnemonicChange = this.handleMnemonicChange.bind(this)
  }

  showSeed () {
    this.props.openModal('ModalShowSeed')
  }

  checkSeed () {
    console.log('Check Seed and chose pin')
    console.log(this.state.mnemonic)
    const mnemonic = paratii.eth.wallet.getMnemonic()
    if (this.state.mnemonic !== mnemonic) {
      this.setState({
        error: 'The mnemonic you insert is uncorrect'
      })
    } else {
      this.setState({ error: '' })
      console.log('set you pin')
      this.props.openModal('ModalSetPin')
    }
  }

  handleMnemonicChange (e: Object) {
    this.setState({
      mnemonic: e.target.value
    })

    console.log(this.state.mnemonic)
  }

  render () {
    return (
      <ModalContentWrapper>
        <ModalScrollContent>
          <Title>Rewrite your account seed</Title>
          <MainText small gray>
            Rewrite your 12 words
          </MainText>
          <TextField
            label="Mnemonic"
            id="mnemonic"
            type="text"
            value={this.state.mnemonic}
            onChange={e => this.handleMnemonicChange(e)}
            error={this.state.error.length > 0}
            margin="0 0 30px"
          />
          {this.state.error && (
            <Text pink small>
              {this.state.error}
            </Text>
          )}
          <Footer>
            <ButtonContainer>
              <Button onClick={this.showSeed}>Go Back</Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button purple onClick={this.checkSeed}>
                Continue
              </Button>
            </ButtonContainer>
          </Footer>
        </ModalScrollContent>
      </ModalContentWrapper>
    )
  }
}

export default ModalRewriteSeed
