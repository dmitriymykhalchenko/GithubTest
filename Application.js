/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { debounce, isEqual } from 'lodash';
import { connect } from 'react-redux';
import { setItems } from './redux/actions';
import { newState } from './redux/stateOperations';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      isLoadingApiResults: false,
    };
  }

  changeText = text => {
    this.setState({ searchQuery: text });
    this.onChangeText(text);
  };

  onChangeText = debounce(
    text => {
      console.log('debounce');
      this.getApiResults(text);
    },
    400,
    { trailing: true, leading: false },
  );

  getApiResults = q => {
    this.setState({ isLoadingApiResults: true });

    fetch(`https://api.github.com/search/repositories?q=${q}`)
      .then(response => response.json())
      .then(data => {
        console.log('data - ', data);

        if (data.message) {
          Alert.alert('error', data.message);
          this.setState({ isLoadingApiResults: false });
          return;
        }

        const convertedData = data.items?.map(i => {
          return {
            full_name: i.full_name,
            description: i.description,
            id: i.id,
          };
        });
        console.log('convertedData - ', convertedData);

        this.props.setItems(convertedData, q);
        this.setState({ isLoadingApiResults: false });
      })
      .catch(err => {
        console.log('error - ', err);
        this.setState({ isLoadingApiResults: false });
      });
  };

  renderItem({ item, index }) {
    return (
      <View
        key={item.id}
        style={{ alignSelf: 'stretch', marginBottom: 10, padding: 15 }}>
        <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>
          {item.full_name}
        </Text>
        <Text style={{ fontSize: 15, color: 'black' }} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    );
  }

  render() {
    console.log('items11 ', this.props.recentSearches)

    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          autoCorrect={false}
          value={this.state.searchQuery}
          onChangeText={this.changeText}
          style={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            alignSelf: 'stretch',
            height: 50,
            paddingHorizontal: 15,
            marginBottom: 20,
          }}
          placeholder={'Enter search query'}
        />

        {this.state.isLoadingApiResults && (
          <ActivityIndicator style={{ marginBottom: 10 }} />
        )}
        <Text>{this.props.newState}</Text>

        <FlatList
          data={this.props.items}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

function mapStateToProps(state) {
  return {
    items: state.appData.items,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setItems(items, query) {
      dispatch(setItems(items, query));
    },
    recentSearches(state, value, searchQuery) {
      dispatch(newState(state, value, searchQuery));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
