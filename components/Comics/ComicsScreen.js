import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';
import { Image } from 'react-native-elements';
import { privateKey, publicKey } from '../../apiKey';
import { ScrollView } from 'react-native-gesture-handler';
let md5 = require('md5');

class ComicsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      modalVisible: false,
      displayComic: { thumbnail: {} },
      comics: []
    }
  }

  componentDidMount() {
    let ts = Date();
    let hash = md5(ts + privateKey + publicKey);
    return fetch(`http://gateway.marvel.com/v1/public/events?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(res => res.json())
    .then(res => this.setState({comics:res.data.results, isLoading: false}))
    .then(() => console.log(this.state.comics))
    .catch(error => console.log(error))
  }

  setModalVisible = comic => {
    this.setState({modalVisible: !this.state.modalVisible, displayComic: comic || { thumbnail: {} } })
  }

  render() {
    let displayComics = this.state.comics.map(comic => {
      let img = comic.thumbnail.path + '.' + comic.thumbnail.extension
      return (
        <View key={comic.id} >
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(comic);
            }}>
            <Image source={{ uri: img }} style={{width: 75, height: 125}} />
          </TouchableHighlight>
        </View>
        )
    })

    if (this.state.isLoading) {
     return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#ed1d24' />
      </View> 
     )
    } else {
      return (
        <View style={styles.container}>
        { console.log(this.state.displayComic) }
          <ScrollView contentContainerStyle={styles.container}>
            {displayComics}
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}>
            <View>
              <View>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible();
                  }}>
                  <Text>X</Text>
                </TouchableHighlight>
                <Image source={{ uri: this.state.displayComic.thumbnail.path + '.' + this.state.displayComic.thumbnail.extension }} style={{width: 75, height: 125}} />
                <Text>{this.state.displayComic.title}</Text>
                <Text>{this.state.displayComic.description ? this.state.displayComic.description : 'Sorry, there is no description available for this title!'}</Text>
                <Text>{this.state.displayComic.variantDescription && this.state.displayComic.variantDescription}</Text>
                <Text></Text>
                <Text></Text>
              </View>
            </View>
          </Modal>
        </View>
      )
    }
  }
}

export default ComicsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    alignContent: 'stretch',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});