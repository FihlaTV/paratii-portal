/* @flow */

import React from 'react'
import styled from 'styled-components'

type Props = {
  icon: string,
  onClick: (e: Object) => void
}

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 100%;
  mask-image: ${props => `url(${props.icon})`};
  mask-position: center center;
  mask-size: contain;
  mask-repeat: no-repeat;
  background-color: ${({ theme, color }) => color || theme.colors.button.white};
`

const IconButton = ({ onClick, icon, ...rest }: Props) => (
  <Button {...rest} icon={icon} onClick={onClick} />
)

export default IconButton
