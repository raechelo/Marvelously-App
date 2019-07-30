import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Marvelously</Text>
      </View>
    );
  }
}

class ComicsScreen extends Component {
  render() {
    return (
      <View>
        <Text>Comics!</Text>
      </View>
    )
  }
}

class MoviesScreen extends Component {
  render() {
   return (
    <View>
      <Text>Movies!</Text>
    </View>
   )
  }
}

class UserScreen extends Component {
  render() {
    return (
      <View>
        <Text>Users!</Text>
      </View>
    )
  }
}

const TabNavigator = createMaterialBottomTabNavigator({
  Home: { screen: HomeScreen, navigationOptions: {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Icon style={[{color: tintColor}]} size={25} name={'ios-home'} />
      </View>
    )
  } },
  Comics: { screen: ComicsScreen, navigationOptions: {
    tabBarLabel: 'Comics',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Icon style={[{color: tintColor}]} size={25} name={'ios-book'} />
      </View>
    )
  } },
  Movies: { screen: MoviesScreen, navigationOptions: {
    tabBarLabel: 'Movies',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Icon style={[{color: tintColor}]} size={25} name={'ios-film'} />
      </View>
    )
  } },
  Users: { screen: UserScreen, navigationOptions: {
    tabBarLabel: 'User',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Icon style={[{color: tintColor}]} size={25} name={'md-person'} />
      </View>
    )
  } }
},
{
  initialRouteName: 'Home',
  activeColor: '#f0edf6',
  inactiveColor: 'brickred',
  barStyle: { backgroundColor: 'red' },
  
})

export default createAppContainer(TabNavigator);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
