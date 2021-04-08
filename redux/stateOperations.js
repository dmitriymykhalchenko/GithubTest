
export const INITIAL_STATE = {
  items: []
}

export function setItems(state, value, searchQuery) {
  let recentSearches = state.recentSearches;
  console.log('searchQuery - ', searchQuery);
  console.log('recentSearches - ', recentSearches);
  if (recentSearches) {
    recentSearches?.unshift(searchQuery);
    console.log('recentSearches - ', recentSearches);
  } else {
    recentSearches = [searchQuery]
    console.log('recentSearches - ', recentSearches);
  }

  recentSearches = recentSearches.slice(0, 5)

  let newState = {
    ...state,
    items: value,
    fetchId: new Date().getTime(),
    recentSearches
  }

  return newState
}
