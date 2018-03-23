/* @flow */

import { createAction } from 'redux-actions'

import {
  OPEN_MODAL,
  CLOSE_MODAL,
  DISABLE_MODAL
} from 'constants/ActionConstants'

export const openModal = createAction(OPEN_MODAL)
export const closeModal = createAction(CLOSE_MODAL)
export const disableModal = createAction(DISABLE_MODAL)
