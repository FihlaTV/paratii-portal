/* stylelint-disable */
// Stylint issue will be fixed in future:
// https://github.com/styled-components/stylelint-processor-styled-components/issues/34
import React, { Component } from 'react'
import styled from 'styled-components'

type Props = {
  name: String,
  value: String,
  children: Object,
  onChange: (e: Object) => void
}

export const RadioWrapper = styled.div`
  width: 100%;
`

export const RadioTitle = styled.p`
  font-size: ${props => props.theme.fonts.form.helper};
  color: ${props => props.theme.colors.Radio.title};
  margin-bottom: 15px;
`

const RadioInput = styled.label`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  font-size: ${props => props.theme.fonts.form.input};
  margin-right: 20px;
  position: relative;

  input {
    opacity: 0;
    position: absolute;
  }
`

const RadioInputBox = styled.span`
  background-color: transparent;
  border: 2px solid ${props => props.theme.colors.Radio.border};
  border-radius: 2px;
  height: ${props => props.theme.sizes.radio};
  margin-right: 15px;
  transition: all ${props => props.theme.animation.time.repaint};
  width: ${props => props.theme.sizes.radio};

  input:checked + & {
    background-color: ${props => props.theme.colors.Radio.active};
    border-color: ${props => props.theme.colors.Radio.active};

    svg {
      transform: scale(1);
      transition: transform 0.5s ${props => props.theme.animation.ease.smooth}
        0.1s;
    }
  }
`
const RadioInputIcon = styled.svg`
  display: block;
  height: 100%;
  transform: scale(0);
  transition: transform 0.5s ${props => props.theme.animation.ease.smooth};
  width: 100%;
`

const RadioInputLabel = styled.span`
  color: ${props => props.theme.colors.Radio.label};
  white-space: nowrap;
`

class RadioCheck extends Component<Props, void> {
  render () {
    return (
      <RadioInput>
        <input type="radio" name={this.props.name} value={this.props.value} />
        <RadioInputBox>
          <RadioInputIcon>
            <use xlinkHref="#icon-check" />
          </RadioInputIcon>
        </RadioInputBox>
        <RadioInputLabel>{this.props.children}</RadioInputLabel>
      </RadioInput>
    )
  }
}
export default RadioCheck
