import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Overlay, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import UserScreen from './components/User/UserScreen';
import MoviesScreen from './components/Movies/MoviesScreen';
import ComicsScreen from './components/Comics/ComicsScreen';
import { privateKey, publicKey } from './apiKey';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import uuid from 'uuid';
import { Linking } from 'expo';
let md5 = require('md5');



class HomeScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      comicModal: false,
      charModal: false,
      rotatingCharacters: [1009197, 1009243, 1009313, 1009417, 1009447, 1009546, 1009718, 1009156, 1010740, 1009699, 1009610, 1010801, 1009359, 1009512, 1009515, 1009268, 1009281, 1009463, 1009381],
      rotatingComics: [428, 291, 1994, 1590, 38756, 37637],
      character: { thumbnail: {} },
      comic: { description: '', thumbnail: {}, creators: {items: [] }, characters: { items: [] }, series: {}, urls: [ { url: '' } ] }
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

  setComicModal = () => {
    this.setState({comicModal: !this.state.comicModal})
  }

  handleInfoClick = () => {
    Linking.canOpenURL(this.state.comic.urls[0].url).then(supported => {
      if (supported) {
        Linking.openURL(this.state.comic.urls[0].url);
      } else {
        console.log("Don't know how to open URI: " + this.state.comic.url[0].url);
      }
    })
  }

  handlePurchaseClick = () => {
    Linking.canOpenURL(this.state.comic.urls[1].url).then(supported => {
      if (supported) {
        Linking.openURL(this.state.comic.urls[1].url);
      } else {
        console.log("Don't know how to open URI: " + this.state.comic.url[1].url);
      }
    })
  }

  render() {
    if (this.state.isLoading) {
      return (
       <View style={styles.loading}>
        <Image source={ require('./assets/logo.png') } style={{height: 100, width: 200}} />
         <ActivityIndicator size='large' color='#ed1d24' />
       </View> 
      )
     } else {
      return (
        <View style={styles.container}>
        <Image source={ require('./assets/logo.png') } style={styles.logo} />
          <ScrollView style={styles.scroll}>

            <Text style={styles.header}>Featured Comic</Text>
            <View style={styles.random}>
              <TouchableHighlight onPress={() => {
                    this.setComicModal();
                  }} 
                  style={styles.scroll}>
                <Image source={{uri : this.state.comic.thumbnail.path + '/portrait_xlarge.' + this.state.comic.thumbnail.extension }} style={styles.image} />
              </TouchableHighlight>
              <View>
                <Text style={styles.text}>{this.state.comic.title}</Text>
                <Text style={styles.desc}>{this.state.comic.description.slice(30) + '...'}</Text>
              </View>
            </View>

            <Overlay
              windowBackgroundColor="hsla(360, 100%, 6%, 0.5)"
              overlayBackgroundColor="darkred"
              onBackdropPress={() => this.setState({ comicModal: false})}
              isVisible={this.state.comicModal}>
              <ScrollView>
                <View style={styles.random}>
                  <Image source={{uri : this.state.comic.thumbnail.path + '/portrait_xlarge.' + this.state.comic.thumbnail.extension }} style={styles.modalImage} />
                  <View style={styles.info}>
                    <Text style={styles.text}>{this.state.comic.title}</Text>
                    <Text style={styles.modalSeries}>{this.state.comic.series.name}</Text>
                  </View>
                  {/* <Text style={styles.text}>Released {new Date(this.state.comic.dates[0].date).toUTCString()}</Text> */}
                </View>
                <View>
                  <Button type='solid' 
                    icon={<Icon name={'ios-information-circle-outline'} />}
                    onPress={this.handleInfoClick}
                    raised={true} />
                    
                  {this.state.comic.urls.find(u => u.type === 'purchase') ?
                    <Button
                      icon={<Icon name={'ios-cart'} />}
                      onPress={() => this.handlePurchaseClick()}
                      raised={true} />
                      :
                      <Button
                      icon={<Icon name={'ios-cart'} />}
                      onPress={() => this.handlePurchaseClick()}
                      raised={true} 
                      disabled={true} />
                    }
                </View>

                <Text style={styles.desc}>{this.state.comic.description}</Text>
                <View style={styles.modalCharacters}>
                  <Text style={styles.modalHeader}>Characters</Text>
                    { this.state.comic.characters.items ?
                      this.state.comic.characters.items.map(c => {
                      return (<Text key={uuid.v4()}>{c.name}</Text>)
                      // url for fetch indiv char info is at c.resourceURI
                      })
                      : <Text>Sorry, character information is unavailable for this title.</Text>
                    }
                </View>
                <View style={styles.modalCreators}>
                  <Text style={styles.modalHeader}>Creators</Text>
                    {
                      this.state.comic.creators.items.map(c => {
                      return (<Text key={uuid.v4()}>{c.name + ', ' + c.role}</Text>)
                      })
                    }
                </View>
              </ScrollView>
            </Overlay>

            <Text style={styles.header}>Featured Character</Text>
            <View style={styles.random}>
              <TouchableHighlight>
                <Image source={{uri: (this.state.character.thumbnail.path + '/portrait_xlarge.' + this.state.character.thumbnail.extension)}} style={styles.image} />
              </TouchableHighlight>
              <Text style={styles.text}>{this.state.character.name}</Text>
            </View>
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
  barStyle: { backgroundColor: '#ed1d24' }
})

export default createAppContainer(TabNavigator);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    paddingTop: '7%',
    width: '100%'
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
    width: 120
  },
  desc: {
    fontSize: 12,
    width: '100%'
  },
  image: {
    margin: 10,
    width: 150,
    height: 225
  },
  logo: {
    height: 35,
    resizeMode: 'cover',
    width: 330,
    width: '95%'
  },
  random: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 20,
    color: '#ed1d24',
    fontWeight: 'bold',
    margin: 5,
  },
  modalHeader: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCharacters: {

  },
  modalCreators: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  modalText: {
    width: '50%'
  },
  modalSeries: {
    alignContent: 'center',
    fontSize: 12,
    flex: 1,
    justifyContent: 'center',
    width: '50%'
  },
  modalImage: {
    width: '40%',
    height: 170,
    margin: '3%'
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    width: '50%'
  },
  x: {
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 25,
    fontWeight: 'bold'
  }
});
