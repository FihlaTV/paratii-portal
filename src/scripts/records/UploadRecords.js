/* @flow */

import { Record as ImmutableRecord } from 'immutable'
import type VideoInfoRecord from './VideoInfoRecords'
import AsyncTaskStatusRecord from './AsyncTaskStatusRecord'

class Upload extends ImmutableRecord({
  videoInfo: {title: null, description: null},
  blockchainStatus: new AsyncTaskStatusRecord(),
  uploadStatus: new AsyncTaskStatusRecord(),
  transcodingStatus: new AsyncTaskStatusRecord()
}) {
  blockchainStatus: AsyncTaskStatusRecord;
  uploadStatus: AsyncTaskStatusRecord;
  transcodingStatus: AsyncTaskStatusRecord;
  videoInfo: VideoInfoRecord;
}
export default Upload
