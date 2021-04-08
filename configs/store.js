import { createStore, applyMiddleware, combineReducers, compose  } from 'redux'
import thunk from 'redux-thunk'
import devToolsEnhancer, { composeWithDevTools } from 'remote-redux-devtools';
import reducer from '../redux/reducers'
import {INITIAL_STATE} from '../redux/stateOperations'
export default (initialState) => {
    const store = compose(
        applyMiddleware(thunk),
        global.reduxNativeDevTools
            ? global.reduxNativeDevTools(/*options*/)
            : devToolsEnhancer()
    )
    (createStore)(reducer, {
      appData: {
        ...INITIAL_STATE,
        ...initialState.appData
      }
    })
    // If you have other enhancers & middlewares
    // update the store after creating / changing to allow devTools to use them
    if (global.reduxNativeDevTools) {
        global.reduxNativeDevTools.updateStore(store);
    }
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('../redux/reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}
