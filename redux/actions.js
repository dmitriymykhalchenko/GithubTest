import * as ActionTypes from './types'

export function setItems(items, query) {
  return {
    type: ActionTypes.SET_ITEMS,
    data: items,
    searchQuery: query,
    recentSearches
  }
}
