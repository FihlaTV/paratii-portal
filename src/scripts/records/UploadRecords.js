/* @flow */

import { Record as ImmutableRecord } from 'immutable'
import type { UploadProgress, VideoInfo } from 'types/ApplicationTypes'

class Upload extends ImmutableRecord({
  id: '',
  isUploading: false,
  progress: null,
  source: '',
  video: null
}) {
  id: string;
  isUploading: boolean;
  progress: UploadProgress;
  source: string;
  video: VideoInfo;
}

export default Upload
