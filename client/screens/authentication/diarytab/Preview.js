import React from 'react';
import { EvilIcons, Feather } from '@expo/vector-icons'; 
import {ImageBackground, TouchableOpacity, StatusBar, StyleSheet, View, PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";

import { hasAndroidPermission } from '../../../utility/PermissionsAndroid';
import { GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';

export default function preview(props) {

    const { globalFunction, globalState  } = React.useContext(GlobalContext);

    const handleSave = async () => {
        if (await hasAndroidPermission()) {
            try {
            CameraRoll.save(props.route.params.data.uri, {album: 'Dask'});
            // props.navigation.navigate('Post', {images: [props.route.params.data.uri]});
            if (props.route.params.mode) {
                if (props.route.params.mode === 'edit') {
                props.navigation.navigate('EditPost', {images: [props.route.params.data.uri]});
                }
                if (props.route.params.mode === 'message') {
                await sendImage();
                }
                if (props.route.params.mode === 'change avatar') {
                    await changeImage('avatar');
                }
                if (props.route.params.mode === 'change cover_image') {
                    await changeImage('cover_image');
                }

            }
            else {
                props.navigation.navigate('Post', {images: [props.route.params.data.uri]});
            }
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    const changeImage = async (imageKind) => {
        try {
          const formData = new FormData();
  
          formData.append("changeImage", imageKind);
          formData.append("images", {
            uri: props.route.params.data.uri,
            type: "image/jpeg",
            name: `image.jpg`,
          })
  
          const response = await fetch(Const.API_URL+'/api/users/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: "application/json",
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: formData,
          });
          const json = await response.json();
          globalFunction.changeUserInfo({user: json.data});
          props.navigation.navigate('Main tab')
        } catch (error) {
          console.error(error);
        }
      }

    const sendImage = async () => {
        try {
          const formData = new FormData();
  
          formData.append("chatId", props.route.params.chatId);
          formData.append("type", "PRIVATE_CHAT");
          formData.append("images", {
            uri: props.route.params.data.uri,
            type: "image/jpeg",
            name: `image.jpg`,
          })
  
          const response = await fetch(Const.API_URL+'/api/chats/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: "application/json",
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: formData,
          });
          const json = await response.json();
          console.log(json);
          props.navigation.navigate('Conversation', {
            chatId: props.route.params.chatId,
            userId: globalState.user._id,
            chatName: props.route.params.chatName
          })
        } catch (error) {
          console.error(error);
        }
      }

    return(
        <View style={styles.container}>
            <StatusBar hidden={true}/>

            <ImageBackground source={props.route.params.data} resizeMode="cover" style={styles.image}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {props.navigation.goBack()}}>
                        <EvilIcons name="close" size={30} color="white" style={{paddingTop: 30, paddingLeft: 15}}/>
                    </TouchableOpacity>
                </View> 

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleSave}>
                        <View style={styles.iconWrapper}>
                            <Feather name="check" size={40} color="#0091ea" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    image: {
        flex: 1,
        justifyContent: 'space-between'
    },
    header: {
        backgroundColor: "#000000c0",
        width: '100%',
        height: 70
    },
    footer: {
        backgroundColor: "#000000c0",
        width: '100%',
        height: 50,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        backgroundColor: 'white',
        borderRadius: 28,
        alignSelf: 'center',
        position: 'absolute',
        top: -28,
        justifyContent: 'center',
        alignItems: 'center'
    }
});