/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent } from 'react';
import { AsyncStorage, View } from 'react-native';
import { Provider } from 'react-redux';
import createStore from './redux/setup';
import { throttle } from 'lodash';
import Application from './Application';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };

    const init = initialState => {
      this._store = createStore({ appData: initialState });

      this._store.subscribe(
        throttle(() => {
          const data = this._store.getState().appData;
          if (data) {
            const items = data.items;
            const recentSearches = data.recentSearches;
            saveState({
              items,
              recentSearches
            });
          }
        }, 1000),
      );
      this.setState({ isLoading: false });
    };

    loadState()
      .then(state => {
        init(state);
      })
      .catch(e => {
        console.log('loadState error - ', e);
        init();
      });
  }

  render() {
    if (this.state.isLoading) {
      return <View />
    }

    return (
      <Provider store={this._store}>
        <Application />
      </Provider>
    );
  }
}

const saveState = state => AsyncStorage.setItem('STATE', JSON.stringify(state));
const loadState = () => AsyncStorage.getItem('STATE').then(raw => JSON.parse(raw));

export default App;
