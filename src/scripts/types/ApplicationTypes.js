/* @flow */

import Immutable from 'immutable'

import VideoRecord from 'records/VideoRecords'
import UserRecord from 'records/UserRecords'
import PlayerRecord from 'records/PlayerRecords'

export type RouteMatch = {
  path: string,
  url: string,
  isExact: boolean,
  params: Object
}

export type Location = {
  pathname: string,
  search: string,
  state: Object
}

export type AsyncTaskStatusName = 'idle' | 'running' | 'success' | 'error'

export type VideoInfo = {
  title: ?string,
  description: ?string
}

export type Action<T> = {
  type: string,
  payload: T
}

export type VideoRecordMap = Immutable.Map<string, VideoRecord>

export type RootState = {
  selectedVideo: ?string,
  user: ?UserRecord,
  videos: VideoRecordMap,
  player: PlayerRecord
}

export type ParatiiLibConfig = {
  provider: string
}

type EventEmitter = {
  on: (eventType: string, callback: (e: Object) => void) => void
}

// TODO move this into paratii-mediaplayer repo
type ClapprCore = EventEmitter & {}

export type ClapprPlayer = EventEmitter & {
  core: {
    getCurrentPlayback: () => ClapprCore
  },
  play: () => void
}

// TODO move this into paratii-lib repo
export type ParatiiLib = {
  config: {
    account: {
      address: string,
      privateKey: string
    }
  },
  core: {
    vids: {
      get: (id: string) => ?Object,
      create: Object => Object
    }
  },
  eth: {
    wallet: {
      decrypt: (string, password: string) => Object,
      encrypt: (password: string) => Object,
      // newMnemonic: () => string,
      getMnemonic: () => string,
      create: () => Object
    },
    vids: {
      get: (id: string) => ?Object,
      makeId: () => string
    }
  },
  ipfs: {
    uploader: {
      add: Object => Object,
      transcode: (string, Object) => Object
    }
  }
}
