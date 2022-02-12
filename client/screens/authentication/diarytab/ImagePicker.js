import React, {useEffect, useState} from "react";
import {PermissionsAndroid, View, TouchableOpacity, Image, Text } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import {Picker} from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

import { GlobalContext } from '../../../utility/context';
import { hasAndroidPermission } from "../../../utility/PermissionsAndroid";
import * as Const from '../../../config/Constants';

export default function ImagePicker(props){

    const { globalFunction, globalState  } = React.useContext(GlobalContext);
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [selectedPhotos, setSelectedPhotos] = useState([])
    const [currentAlbum, setCurrentAlbum] = useState('All')

    const getAlbums = () => {
        CameraRoll.getAlbums({assetType: 'Photos'})
        .then(r => {
            setAlbums(r);
            getPhotos('All');
        })
        .catch(err => console.log(e));
    };

    const getPhotos = (album) => {
      if (album === 'All'){
        CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
        })
        .then(r => {
          setPhotos(r.edges);
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
      CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
        groupTypes: 'Album',
        groupName: album
      })
      .then(r => {
        setPhotos(r.edges);
      })
      .catch((err) => {
         console.log(err);
      });
      }
    }

    const tappedPhotos = (item) => {
      if (!(selectedPhotos.includes(item.node.image.uri))) {
        if (props.route.params && props.route.params.limit) {
          if (selectedPhotos.length >= props.route.params.limit) {
            let arr = selectedPhotos;
            arr.splice(0, 1);
            setSelectedPhotos([...arr, item.node.image.uri]);
          } else {
            setSelectedPhotos([...selectedPhotos, item.node.image.uri]);
          }
        } else {
          setSelectedPhotos([...selectedPhotos, item.node.image.uri]);
        }

      } else {
        for (let i = 0; i < selectedPhotos.length; i++) {
          if (selectedPhotos[i] === item.node.image.uri) {
            let arr = selectedPhotos;
            arr.splice(i, 1);
            setSelectedPhotos([...arr]);
          }
        }
      }
    }

    const changeAlbum = (name) => {
      setCurrentAlbum(name);
      getPhotos(name);
    };

    const handleImageClick = () => {
      
      if (props.route.params) {
          // props.navigation.navigate('Camera', {mode: 'edit'})
          props.navigation.navigate('Camera', {...props.route.params});
          return;
      }
      else props.navigation.navigate('Camera')
    }

    const handleNext = async () => {
      if (props.route.params) {
        if (props.route.params.mode === 'edit') {
          props.navigation.navigate('EditPost',{images: selectedPhotos});
          return;
        }
        if (props.route.params.mode === 'message') {
          if (selectedPhotos.length !== 1)  {
            props.navigation.navigate('Conversation', {
              chatId: props.route.params.chatId,
              userId: globalState.user._id,
              chatName: props.route.params.chatName
            })
          } else {
            await sendImage();
          }
        }
        if (props.route.params.mode === 'change cover_image') {
          if (selectedPhotos.length !== 1)  {
            props.navigation.navigate('SettingProfile')
          } else {
            await changeImage('cover_image');
          }
        }
        if (props.route.params.mode === 'change avatar') {
          if (selectedPhotos.length !== 1)  {
            props.navigation.navigate('SettingProfile')
          } else {
            await changeImage('avatar');
          }
        }

      }
      else props.navigation.navigate('Post',{images: selectedPhotos});
    }

    const sendImage = async () => {
      try {
        const formData = new FormData();

        formData.append("chatId", props.route.params.chatId);
        formData.append("type", "PRIVATE_CHAT");
        formData.append("images", {
          uri: selectedPhotos[0],
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
        props.navigation.navigate('Conversation', {
          chatId: props.route.params.chatId,
          userId: globalState.user._id,
          chatName: props.route.params.chatName
        })
      } catch (error) {
        console.error(error);
      }
    }

    const changeImage = async (imageKind) => {
      try {
        const formData = new FormData();

        formData.append("changeImage", imageKind);
        formData.append("images", {
          uri: selectedPhotos[0],
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
      
    useEffect(() =>{
    if(hasAndroidPermission()){
        getAlbums();
      }
    }, []);

      return(
        <View style = {{backgroundColor: 'white', flex: 1}}>
          <View style={{position: 'absolute', top: 0, width: '100%', height: 70,
            backgroundColor: 'white', left: 0, right: 0, elevation: 10, zIndex: 3, padding: 10,}}>
            <Picker
              selectedValue={currentAlbum}
              style={{ height: 50, width: 150, fontSize: 20, color: 'black'}}
              onValueChange={(itemValue, idxValue) => changeAlbum(itemValue)}
              >
              <Picker.Item label = 'All' value = 'All'/>
              {albums.map((item, idx) => {
                return <Picker.Item key={idx} label = {item.title} value = {item.title} />
              })}
            </Picker>

            <TouchableOpacity style={{backgroundColor: "#1878f3", padding: 10, width: 80, right: 20, position: 'absolute',
            top: 15, borderRadius: 10, zIndex: 5}} onPress={handleNext}>
              <Text style={{color: 'white', textAlign: 'center'}}>Next</Text>
            </TouchableOpacity>

          </View>
            <View style={{paddingLeft: 5, backgroundColor: 'white', flex: 1, paddingTop: 80, flexDirection: 'row', flexWrap: 'wrap'}}>

              <TouchableOpacity style={{backgroundColor: 'white', width: '32%', height: 150, margin: 2, justifyContent: 'center', alignItems: 'center',
              borderColor: 'black', borderRadius: 5, borderWidth: 1}}
              onPress = {handleImageClick}>
                <Ionicons name="camera-outline" size={40} color="black" />
                <Text style={{fontSize: 16, color: 'black'}}>Chụp ảnh</Text>
              </TouchableOpacity>

              {photos.map((item, idx) =>{
                return(
                  <TouchableOpacity key={idx} style={{width: '32%', height: 150, margin: 2}}
                  onPress = {() => {tappedPhotos(item)}}>
                    {selectedPhotos.includes(item.node.image.uri)&&
                    <Text style={{padding: 5, height: 30, width: 30, borderRadius: 15, textAlign: 'center',
                    position: 'absolute', top: 10, right: 10, elevation: 20, backgroundColor: '#1878f3', color: 'white'}}>
                      {selectedPhotos.indexOf(item.node.image.uri) + 1}</Text>}
                      <Image source = {{uri: item.node.image.uri}} 
                      style={{flex: 1, borderWidth: selectedPhotos.includes(item.node.image.uri)?3:0,
                              borderColor: selectedPhotos.includes(item.node.image.uri)?'#1878f3':'transparent'}}               
                      />
                  </TouchableOpacity>
                );
              })}
            </View>
        </View>
      );
}
