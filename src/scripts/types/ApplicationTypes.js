/* @flow */

import VideoRecord from 'records/VideoRecords'
import UserRecord from 'records/UserRecords'
import UploadRecord from 'records/UploadRecords'

export type RouteMatch = {
  path: string,
  url: string,
  isExact: boolean,
  params: Object
};

export type Location = {
  pathname: string,
  search: string,
  state: Object
};

export type UploadProgress = {
  value: number
}

export type VideoInfo = {
  title: string,
  description: string
}

export type Action<T> = {
  type: string,
  payload: T
};

export type RootState = {
  video: ?VideoRecord,
  user: ?UserRecord,
  upload: ?UploadRecord
};

export type ParatiiLibConfig = {
  provider: string
};

// TODO move this into paratii-lib repo
export type ParatiiLib = {
  core: {
    vids: {
      get: (id: string) => ?Object
    }
  }
};
