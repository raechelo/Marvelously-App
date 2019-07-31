import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class MoviesScreen extends Component {
  render() {
   return (
    <View style={styles.container}>
      <Text style={styles.text}>Movies!</Text>
    </View>
   )
  }
}

export default MoviesScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  }
});