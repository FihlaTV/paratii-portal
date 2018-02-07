/* stylelint-disable */
// Stylint issue will be fixed in future:
// https://github.com/styled-components/stylelint-processor-styled-components/issues/34
import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import InputField, { StyleInput } from 'components/foundations/forms/Input'

type Props = {
  className: String,
  error: Boolean,
  label: String,
  helper: String,
  margin: String,
  disabled: Boolean,
  id: 'String',
  type: 'String',
  onChange: (e: Object) => void
}

const LabelField = styled.label`
  margin: ${props => props.margin};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  display: block;
  position: relative;
  width: 100%;
`

const StyleFakeLabelFilled = css`
  transform: translate3d(0, -22px, 0) scale(0.92);
  transition-duration: 0.4s;
  transition-delay: 0s;
`

const FakeLabel = styled.span`
  ${StyleInput} color: ${props => props.theme.colors.mainInput.placeholder};
  line-height: ${props => props.theme.sizes.mainInput.height};
  left: 0;
  position: absolute;
  top: 0;
  transform-origin: left;
  transform: ${props =>
    props.filled
      ? 'translate3d(0, -22px, 0) scale(0.92)'
      : 'translate3d(0, 0, 0) scale(1)'};
  transition-delay: ${props => (props.filled ? '0s' : '0.1s')};
  transition-duration: ${props => (props.filled ? '0.4s' : '0.5s')};
  transition-property: 'transform';
  transition-timing-function: ${props => props.theme.animation.ease.smooth};
  white-space: nowrap;

  .filled &,
  ${InputField}:focus + & {
    ${StyleFakeLabelFilled};
  }
`

const HelperLabel = styled.span`
  color: ${props => props.theme.colors.mainInput.placeholder};
  display: block;
  font-size: 12px;
  padding: 8px 1px 0 0;
  opacity: 0.7;
  text-align: right;
  white-space: nowrap;
`

class TextField extends Component<Props, void> {
  constructor (props) {
    super(props)

    this.state = {
      filled: false,
      value: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleChange (e) {
    const str = e.target.value

    this.setState({
      value: str
    })

    this.props.onChange(e)
  }

  handleKeyUp (e) {
    const str = this.state.value
    const len = str.length

    this.setState({
      filled: len > 0
    })
  }

  render () {
    return (
      <LabelField
        className={this.props.className}
        margin={this.props.margin}
        disabled={this.props.disabled}
      >
        <InputField
          value={this.state.value}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          error={this.props.error}
          id={this.props.id}
          type={this.props.type}
          disabled={this.props.disabled}
        />
        {this.props.label && (
          <FakeLabel filled={this.state.filled}>{this.props.label}</FakeLabel>
        )}
        {this.props.helper && <HelperLabel>{this.props.helper}</HelperLabel>}
      </LabelField>
    )
  }
}
export default TextField
