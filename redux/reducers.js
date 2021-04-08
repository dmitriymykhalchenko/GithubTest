//преобразователь

import { combineReducers } from 'redux'

import * as stateOps from './stateOperations'

import * as ActionTypes from './types'

const appData = (state = stateOps.INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.SET_ITEMS:
      return stateOps.setItems(state, action.data, action.searchQuery)


    default:
      return state
  }
}

const rootReducer = combineReducers({
  appData
})

export default rootReducer
