'use strict';
import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function Camera (props) {

    const camera = useRef(null);
    const [cameraBack, setCameraBack] = useState(true);
    const [image, setImage] = useState();

    const takePicture = async () => {
          const options = { quality: 0.5, base64: true };
          const data = await camera.current.takePictureAsync(options);
          setImage(data);
          // props.navigation.navigate('Preview', {data: data});
          if (props.route.params) {
            //props.navigation.navigate('Preview', {data: data, mode: 'edit'})
              props.navigation.navigate('Preview', {data: data, ...props.route.params})
          } else {
            props.navigation.navigate('Preview', {data: data});
          }
      };

    const navigationBack = () => {
      props.navigation.goBack();
    }

    const switchCamera = () => {
      setCameraBack(!cameraBack);
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <RNCamera
          ref = {camera}
          style={styles.preview}
          type={(cameraBack)?RNCamera.Constants.Type.back:RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={navigationBack}>
            <Feather name="arrow-left" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={switchCamera}>
            <MaterialIcons name="flip-camera-android" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.captureWrapper}>
          <TouchableOpacity style={styles.capture} onPress={takePicture}>
            <View style={styles.capture} />
          </TouchableOpacity>
        </View>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  captureWrapper: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderColor: 'white',
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%'
  },
});
