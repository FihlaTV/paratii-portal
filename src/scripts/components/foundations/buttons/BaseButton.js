import styled, { css } from 'styled-components'

export const ButtonStyleColor = css`
  ${props => {
    let _color: String

    if (props.white) {
      _color = props.theme.colors.button.white
    } else if (props.purple) {
      _color = props.theme.colors.button.purple
    } else {
      _color = props.theme.colors.button.gray
    }

    return css`
      color: ${_color};
    `
  }};
  `

export const ButtonStyleHover = css`
  transition: opacity ${props => props.theme.animation.time.repaint};

  &:hover {
    opacity: ${props => props.theme.animation.opacity.hover};
  }
  `

const BaseButton = styled.div`
  ${ButtonStyleColor} ${ButtonStyleHover} cursor: pointer;
  `

export default BaseButton
