import React, { Component } from 'react'
import styled from 'styled-components'

import type { UploadRecord } from 'records/UploadRecords'

type Props = {
  key: string,
  item: UploadRecord
};

//

const Item = styled.div`
  background-color: ${props => props.theme.colors.body.background};
  font-family: ${props => props.theme.fonts.family ? props.theme.fonts.family : 'Monospace'}, sans-serif;
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  padding: 10px;
`

const Label = styled.p`
  color: white;
`

class UploadListItem extends Component<Props, void> {
  render () {
    const { item } = this.props
    return (
      <Item>
        <Label>{item.filename}</Label>
      </Item>
    )
  }
}

export default UploadListItem
