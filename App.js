import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import UserScreen from './components/User/UserScreen';
import MoviesScreen from './components/Movies/MoviesScreen';
import ComicsScreen from './components/Comics/ComicsScreen';
import { privateKey, publicKey } from './apiKey';
let md5 = require('md5');



class HomeScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      rotatingCharacters: [1009197, 1009243, 1009313, 1009417, 1009447, 1009546, 1009718, 1010979, 1010975, 1009156, 1010740, 1009699, 1009610, 1010801, 1009359, 1009512, 1009515, 1009268, 1009281, 1009463, 1009381],
      rotatingComics: [428, 291, 331, 1994, 384, 183, 1590, 38756, 22102, 37637],
      character: {},
      comic: {}
    }
  }

  componentDidMount() {
    let ts = Date();
    let hash = md5(ts + privateKey + publicKey);

    let characterNum = Math.floor(Math.random() * (this.state.rotatingCharacters.length))
    characterNum = this.state.rotatingCharacters[characterNum]

    let comicNum = Math.floor(Math.random() * (this.state.rotatingComics.length))
    comicNum = this.state.rotatingComics[comicNum]


    fetch(`http://gateway.marvel.com/v1/public/characters/${characterNum}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(res => res.json())
    .then(res => console.log(res))
    .then(res => this.setState({character:res, isLoading: false}))
    .catch(error => console.log(error))

    fetch(`http://gateway.marvel.com/v1/public/comics/${comicNum}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(res => res.json())
    .then(res => console.log(res))
    .then(res => this.setState({comic:res, isLoading: false}))
    .catch(error => console.log(error))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Marvelously</Text>
      </View>
    );
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
  activeColor: '#fff',
  inactiveColor: '#7f0f0b',
  barStyle: { backgroundColor: '#ed1d24' },
  
})

export default createAppContainer(TabNavigator);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  }
});
