'use strict';
import React, {
     Component } from 'react';
import {NativeModules, LayoutAnimation, StyleSheet, TouchableOpacity, View, StatusBar, BackHandler, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import CircularProgress from '../../../components/CircularProgress';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

let isRecord = 0;
let isBack = 0;
let interval
export default class CameraVideo extends Component {
    state = {
        cameraBack: true,
        cameraState: 0,
        cameraTouch: 0,
        clock: 0,
        isRecording: false,
        cameraButton: {
            w: 48,
            h: 48,
            r: 48
        },
    }

    constructor(props) {
        super(props)
        this.backAction = this.backAction.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.startClock = this.startClock.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.navigationBack = this.navigationBack.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
    }

    backAction = () => {
      if (isRecord === 0) {
        this.props.navigation.goBack(null);
      }
      if (isRecord === 1) {
      Alert.alert("Bạn đang quay video!", "Bạn chắc muốn thoát chứ?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          isBack = 1;
          // clearInterval(myInterval);
          // clearInterval(interval)
          this.stopRecording();
          this.setState(null);
          this.props.navigation.goBack(null);
        }}
      ]);
    }
      return true
    }

    componentDidMount() {
        isBack = 0;
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
      }
    
    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
        this.backHandler.remove();
    }

    startRecording = async () => {
      try {
        isRecord = 1;
        this.setState({cameraTouch: 1});
        LayoutAnimation.spring();
        this.setState({cameraButton: {w: 46, h: 46, r: 5}});
        this.setState({cameraState: 1});
        this.startClock();
        this.setState({isRecording :true});
        const promise = this.camera.recordAsync();
        if (promise) {
          let data = await promise;
          this.setState({isRecording :false});
          if (isBack === 0)
            {
              if (this.props.route.params) {
                  // this.props.navigation.navigate('PreviewVideo', {data: data, mode: 'edit'})
                  let sendObj =  {data: data,  ...this.props.route.params}
                  this.props.navigation.navigate('PreviewVideo', {data: data, ...this.props.route.params})
              } else {
                this.props.navigation.navigate('PreviewVideo', {data: data});
              }
            }
        }
      } catch (e) {
        console.error(e);
      }
    }

    stopRecording = () => {
      this.camera.stopRecording();
      LayoutAnimation.spring();
      this.setState({cameraButton: {w: 50, h: 50, r: 25}});
      this.setState({cameraState: 0});
      this.setState({cameraTouch: 0});
      // clearInterval(myInterval);
      clearInterval(interval)
    }


    startClock = () => {
      let i = 0;
      // let interval = setInterval(() => {
      interval = setInterval(() => {
        // setMyInterval(interval);
        this.setState({clock :i});
        i= i + 1;
        if (i > 39) {
          clearInterval(interval);
          this.stopRecording();
        }
      }, 1000);
    }

    handlePress = () => {
        if (this.state.cameraTouch === 0) {
          this.startRecording();
        }

        if (this.state.cameraTouch === 1) {
          if(this.state.clock < 5) {
            setTimeout(() => {
              this.stopRecording();
            }, (4 - this.state.clock)*1000);
            }

          else {
            this.stopRecording();
          }
        }
      }

    navigationBack = () => {
      this.props.navigation.goBack();
    }

    switchCamera = () => {
      this.setState({cameraBack : !this.state.cameraBack});
    }

    render() {
        return (
        <View style={styles.container}>
            <StatusBar hidden={true}/>
            <RNCamera
            ref={ref => {
                this.camera = ref;
              }}
            ratio='16:9'
            style={styles.preview}
            type={(this.state.cameraBack)?RNCamera.Constants.Type.back:RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.off}
            defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
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
            <TouchableOpacity onPress={this.navigationBack} disabled={this.state.isRecording}>
                <Feather name="arrow-left" size={40} color={this.state.isRecording?"#ffffff44":"white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.switchCamera} disabled={this.state.isRecording}>
                <MaterialIcons name="flip-camera-android" size={40} color={this.state.isRecording?"#ffffff44":"white"} />
            </TouchableOpacity>
            </View>

            <View style={styles.captureWrapper}>
                {(this.state.cameraState===1)&&<CircularProgress />}
                <TouchableOpacity style={[styles.capture, {width: this.state.cameraButton.w, 
                    height: this.state.cameraButton.h, borderRadius: this.state.cameraButton.r}]} onPress={this.handlePress}>
                    <View style={styles.capture} />
                </TouchableOpacity>

            </View>
        </View>
        );
    }

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
    backgroundColor: '#f44336',
  },
  captureWrapper: {
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

