import React, { Component } from 'react'
import styled from 'styled-components'

import NavLink from 'components/foundations/buttons/NavLink'
import type { UploadRecord } from 'records/UploadRecords'

type Props = {
  id: string,
  item: UploadRecord,
  onClick: (id: string) => void
}

const Item = styled.div`
  background-color: ${props => props.theme.colors.body.background};
  font-family: ${props =>
    props.theme.fonts.family ? props.theme.fonts.family : 'Monospace'},
    sans-serif;
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  padding: 10px;
`

const Label = styled.p`
  color: white;
`

class UploadListItem extends Component<Props, void> {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick(this.props.id)
  }

  render () {
    const item = this.props.item
    let progress = 0
    if (item.getIn(['uploadStatus', 'name']) === 'running') {
      progress = item.getIn(['uploadStatus', 'data', 'progress'])
    }
    let linkToVideo = ''
    if (item.transcodingStatus.name === 'success') {
      let link = `/play/${item.videoInfo.id}`
      linkToVideo = <NavLink to={link}>Play video</NavLink>
    }

    return (
      <Item onClick={this.handleClick} id="video-list-item-{item.id}">
        <Label>video id: {item.videoInfo.id}</Label>
        <Label>Filename: {item.filename}</Label>
        <Label>
          Upload Status: <b>{item.uploadStatus.name}</b> ({progress}%)
        </Label>
        <Label>
          Blockchain Status (is the video info saved on the blockchain?):{' '}
          <b>{item.blockchainStatus.name}</b>
        </Label>
        <Label>
          Transcoding Status: <b>{item.transcodingStatus.name}</b>
          <br />
          {linkToVideo}
        </Label>
      </Item>
    )
  }
}

export default UploadListItem
