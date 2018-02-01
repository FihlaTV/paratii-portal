/* @flow */

import VideoRecord from 'records/VideoRecords'
import UploadRecord from 'records/UploadRecords'
import UserRecord from 'records/UserRecords'
import type { RootState } from 'types/ApplicationTypes'

/* Videos */
export const getVideo = (state: RootState): ?VideoRecord => state.selectedVideo

/* Users */
export const getUser = (state: RootState): ?UserRecord => state.user

export const getIsLoggingIn = (state: RootState): boolean =>
  !!(state.user && state.user.isLoggingIn)

export const getShouldKeepUrl = (state: RootState): boolean =>
  !!(state.user && state.user.keepUrl)

/* Upload */
// get the files to be shown in the upload manager
export const getUploads = (state: RootState): ?UploadRecord => {
  return state.videos
}
