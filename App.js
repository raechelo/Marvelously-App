import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import UserScreen from './components/User/UserScreen';
import MoviesScreen from './components/Movies/MoviesScreen';
import ComicsScreen from './components/Comics/ComicsScreen';
import { privateKey, publicKey } from './apiKey';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
let md5 = require('md5');



class HomeScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      rotatingCharacters: [1009197, 1009243, 1009313, 1009417, 1009447, 1009546, 1009718, 1010979, 1010975, 1009156, 1010740, 1009699, 1009610, 1010801, 1009359, 1009512, 1009515, 1009268, 1009281, 1009463, 1009381],
      rotatingComics: [428, 291, 331, 1994, 384, 183, 1590, 38756, 22102, 37637],
      character: { thumbnail: {} },
      comic: { thumbnail: {} }
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
    .then(res => this.setState({character: res.data.results[0], isLoading: false}))
    // .then(() => console.log('character', this.state.character))
    .catch(error => console.log(error))

    fetch(`http://gateway.marvel.com/v1/public/comics/${comicNum}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(res => res.json())
    .then(res => this.setState({comic:res.data.results[0], isLoading: false}))
    .then(() => console.log('comic', this.state.comic))
    .catch(error => console.log(error))
  }

  render() {
    if (this.state.isLoading) {
      return (
       <View style={styles.loading}>
         <ActivityIndicator size='large' color='#ed1d24' />
       </View> 
      )
     } else {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Marvelously</Text>
          <ScrollView>
            <TouchableHighlight>
              <Image source={{uri : this.state.comic.thumbnail.path + '/portrait_xlarge.' + this.state.comic.thumbnail.extension }} style={{width:150, height: 225}} />
            </TouchableHighlight>
            <Text style={styles.text}>{this.state.comic.title}</Text>
            <Text style={styles.text}>{this.state.comic.description}</Text>

            <TouchableHighlight>
              <Image source={{uri: (this.state.character.thumbnail.path + '/portrait_xlarge.' + this.state.character.thumbnail.extension)}} style={{width: 150, height: 225}} />
            </TouchableHighlight>
            <Text style={styles.text}>{this.state.character.name}</Text>
          </ScrollView>
        </View>
      );
    }
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
