import React, {useState} from 'react';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import { TouchableOpacity, StatusBar, StyleSheet, View, PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import Video from 'react-native-video';

import { hasAndroidPermission } from '../../../utility/PermissionsAndroid';
import { GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';

export default function preview(props) {

    const { globalFunction, globalState  } = React.useContext(GlobalContext);
    const [isMute, setIsMute] = useState(false)

    const handleSave = async () => {
        if (await hasAndroidPermission()) {
            try {
            CameraRoll.save(props.route.params.data.uri, {album: 'Dask'});
            // props.navigation.navigate('Post', {video: props.route.params.data.uri});
            console.log(props.route.params)
            if (props.route.params.mode ) {
                if (props.route.params.mode === 'edit') {
                props.navigation.navigate('EditPost', {video: props.route.params.data.uri});
                }
                if (props.route.params.mode === 'message') {
                    await sendVideo();
                }
            }
            else {
                props.navigation.navigate('Post', {video: props.route.params.data.uri});
            }
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    const sendVideo = async () => {
        try {
          const formData = new FormData();
  
          formData.append("chatId", props.route.params.chatId);
          formData.append("type", "PRIVATE_CHAT");
          formData.append("videos", {
            uri: props.route.params.data.uri,
            type: 'video/mp4',
            name: 'video.mp4'
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

            <Video source={props.route.params.data} resizeMode="cover" style={styles.image} muted={isMute} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => {props.navigation.goBack()}}>
                    <Ionicons name="close-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIsMute(!isMute)}}>
                    <Ionicons name={isMute?"volume-mute-outline":"volume-high-outline"} size={30} color="white" />
                </TouchableOpacity>
            </View> 

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleSave}>
                    <View style={styles.iconWrapper}>
                        <Feather name="check" size={40} color="#0091ea" />
                    </View>
                </TouchableOpacity>
            </View>
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
        height: 70,
        position: 'absolute',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingTop: 25,
        paddingRight: 15,
        flexDirection: 'row'
    },
    footer: {
        backgroundColor: "#000000c0",
        width: '100%',
        height: 50,
        position: 'absolute',
        bottom: 0
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