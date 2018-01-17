import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Wrapper from './foundations/Wrapper'
import { paratii } from '../utils/ParatiiLib'

const Title = styled.header`
  background-color: #fff;
  height: 50px;
  padding: 20px;
  display: flex;
  align-items: center;
  color: blue;
`

class Debug extends Component {
  render () {
    delete paratii.config.paratii
    let config = JSON.stringify(paratii.config, null, 2)
    return (
      <Wrapper>
        <pre>
          <Title>Debug page</Title>
          <Link to="/play/foo">Play a video</Link>
          <br />
<<<<<<< HEAD
          <Link to="/uploader/upload-file">Upload a file</Link>
          <br />
          {config}
=======
          <Link to="/uploader">Upload a file</Link>
>>>>>>> a418520949bba2953d692ad32c41e13700f41f50
        </pre>
      </Wrapper>
    )
  }
}

export default Debug
