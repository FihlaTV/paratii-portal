/* @flow */

import VideoRecord from 'records/VideoRecords'
import UserRecord from 'records/UserRecords'

import type { RootState } from 'types/ApplicationTypes'

/* Videos */
export const getVideo = (state: RootState): ?VideoRecord => state.video

/* Users */
export const getUser = (state: RootState): ?UserRecord => state.user
export const isLoggingIn = (state: RootState): boolean => (state.user) ? state.user.isLoggingIn : false
export const isLogged = (state: RootState): boolean => {
  const user = state.user
  return !!(user && user.email && !isLoggingIn(state))
}
export const shouldKeepUrl = (state: RootState): ?boolean => !!((state.user) && (state.user.keepUrl))
