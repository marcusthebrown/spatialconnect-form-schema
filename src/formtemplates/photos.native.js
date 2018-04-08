import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { OfflineImage } from 'react-native-image-offline';
import * as Progress from 'react-native-progress';
import scstyles from 'scstyles';
import { green, gray } from 'palette';

class SCFormPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: '[]',
      loading: false
    };
    this.removePhoto = this.removePhoto.bind(this);
  }

  removePhoto(photo) {
    console.log('filtering out photo', photo)
    let photos = JSON.parse(this.state.photos).filter(p => p != photo);
    let photosString = JSON.stringify(photos)
    console.log('new photos', photosString)
    this.setState({ photos: photosString });
  }

  choosePhotosVideos() {
    this.setState({ loading: true });
    // first object is request object: https://github.com/ivpusic/react-native-image-crop-picker#request-object
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.01,  
    })
      .then(images => {
        // images is an array of objects: https://github.com/ivpusic/react-native-image-crop-picker#response-object
        let newPhotos = JSON.parse(this.state.photos).concat(images.map(i => i.path));
        this.setState({
          loading: false,
          photos: JSON.stringify(newPhotos)
        });
      })
      .catch(e => {
        this.setState({ loading: false });
      });
  }

  takePicture() {
    this.setState({ loading: true });
    ImagePicker.openCamera({
      width: 300,
      height: 400
    })
      .then(image => {
        let newPhotos = JSON.parse(this.state.photos).concat(image.path);
        this.setState({
          loading: false,
          photos: JSON.stringify(newPhotos)
        });
      })
      .catch(e => {
        this.setState({ loading: false });
      });
  }

  componentWillMount() {
    if (this.props.value) {
      console.log('setting photos to', this.props.value)
      this.setState({ photos: this.props.value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.setValue(nextState.photos);
  }

  render() {
    console.log('this.state.photos', this.state.photos)
    return (
      <View style={styles.container}>
        <View>
          {this.state.loading ? (
            <Text>Loading Photos...</Text>
          ) : (
            <View style={{ justifyContent: 'flex-start' }}>
              <TouchableOpacity
                style={scstyles.buttonStyles.button}
                onPress={this.takePicture.bind(this)}
              >
                <Text style={scstyles.buttonStyles.buttonText}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={scstyles.buttonStyles.button}
                onPress={this.choosePhotosVideos.bind(this)}
              >
                <Text style={scstyles.buttonStyles.buttonText}>
                  Choose Photo
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View>
            {this.state.photos &&
              typeof this.state.photos === 'string' &&
              typeof this.state.photos != '' &&
              JSON.parse(this.state.photos).map((photo, idx) => {
                let photoUri = photo.split('?')[0];
                let accessToken = photo.split('access_token=')[1];
                let imgSrc = accessToken
                  ? {
                      uri: photoUri,
                      headers: { Authorization: `Bearer ${accessToken}` }
                    }
                  : { uri: photoUri };
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={this.takePicture.bind(this)}
                  >
                    <View style={styles.imageContainer}>
                      <OfflineImage
                        style={styles.image}
                        source={imgSrc}
                      />
                      <TouchableOpacity
                        key={idx}
                        onPress={() => this.removePhoto(photo)}
                      >
                        <Text style={styles.remove}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    );
  }
}

export default function(locals) {
  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  function setValue(photos) {
    locals.onChange(photos);
  }

  var label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  console.log('locals.value', locals.value);

  return (
    <View style={formGroupStyle}>
      {label}
      <SCFormPhotos
        value={locals.value}
        title={locals.label}
        setValue={setValue}
        error={locals.error}
      />
      {error}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    margin: 4,
    height: 100,
    width: 100,
    backgroundColor: gray,
  },
  remove: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 15
  }
});
