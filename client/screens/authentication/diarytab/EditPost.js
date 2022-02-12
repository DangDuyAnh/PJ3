import React, {useEffect, useState} from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StyleSheet, ScrollView, View, TextInput, KeyboardAvoidingView, TouchableOpacity, StatusBar, TouchableHighlight, Text, Button, Image} from 'react-native';
import Video from 'react-native-video';
import { AntDesign } from '@expo/vector-icons';

import { GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
import * as RootNavigation from '../../../RootNavigation';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';

export function EditPostButton(props) {
    const { globalState } = React.useContext(GlobalContext);

    const handlePost = async () => {
        let postId = globalState.postId;
        let postDescription = globalState.postDescription;
        let postImages = globalState.postImages;
        let postVideo = globalState.postVideo;
        let oldImages = globalState.oldImages;
        let oldVideo = globalState.oldVideo;

        let newImages = postImages.filter(item => (!oldImages.includes(item)));
        oldImages = postImages.filter(item => (oldImages.includes(item)));
        let newVideo = postVideo.filter(item => (!oldVideo.includes(item)));
        oldVideo = postVideo.filter(item => (oldVideo.includes(item)));


        const formData = new FormData();
        
        if (postDescription) formData.append("described", postDescription);
        if (oldImages &&  oldImages.length > 0) {
            oldImages.forEach((item, i) => {
                formData.append("oldImage", item); 
            });
        } 
        
        if (oldVideo && oldVideo.length > 0) {
            formData.append('oldVideo', oldVideo[0])
        };

        if (newImages.length !== 0) {
            newImages.forEach((item, i) => {
            formData.append("images", {
                uri: item,
                type: "image/jpeg",
                name: `image${i}.jpg`,
            });
            });
        };
            
        if (newVideo.length !== 0) {
            formData.append("videos", {
            uri: newVideo[0],
            type: 'video/mp4',
            name: 'video.mp4'
        })
        }

        try {
            const response = await fetch(Const.API_URL+'/api/posts/edit/' + postId, {
                method: 'POST',
                headers: {
                  // Accept: "application/x-www-form-urlencoded",
                  'Content-Type': 'multipart/form-data',
                  Accept: "application/json",
                  Authorization: `Bearer ${globalState.userToken}`,
                },
                body: formData,
              });
            const json = await response.json();
            RootNavigation.navigate('Main tab', {post: json.data});
            console.log(json)
          } catch (error) {
            console.error(error);
          }

    }
    return(
        <Button
            onPress={() => {
                handlePost();
                
            }}
            title="SỬA"
            disabled={((!globalState.postVideo) &&(!globalState.postImages || globalState.postImages.length === 0)&&(!globalState.postDescription))
                ?true:false}
            color= {Const.COLOR_THEME}
        />
    );
}

export function EditPost(props) {

    const { globalFunction, globalState } = React.useContext(GlobalContext);

    useEffect(() => {
        if (props.route.params) {
            if (props.route.params.post) {
                globalFunction.updatePostDescription(props.route.params.post.described);
                globalFunction.updatePostImages(props.route.params.post.images);
                globalFunction.updatePostVideo(props.route.params.post.videos);
            }
            if (props.route.params.images) {
                if (props.route.params.images.length > 0) {
                globalFunction.updatePostImages([...globalState.postImages,...props.route.params.images]);
                globalFunction.updatePostVideo([]);
                }
            }
            if (props.route.params.video) {
                globalFunction.updatePostVideo([props.route.params.video]);
                globalFunction.updatePostImages([]);
            }
        }
    }, [props.route.params]);

    const handleChangeText = (val) => {
        globalFunction.updatePostDescription(val);
    }

    const deletePhoto = (val) => {
        for (let i = 0; i < globalState.postImages.length; i++) {
            if (globalState.postImages[i] === val) {
              let arr = [...globalState.postImages];
              arr.splice(i, 1);
              globalFunction.updatePostImages([...arr]);
            }
          }
    }

    const deleteVideo = () => {
        globalFunction.updatePostVideo([]);
    }

    const PhotoList = ({imageList}) => {
        if ((imageList === undefined) || (imageList === null) || (imageList.length === 0)) return null;
        if (imageList.length === 1) 
            return (
            <View style={styles.imageContainer}>
                <TouchableOpacity style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                position: 'absolute', top: 10, right: 10, zIndex: 20, backgroundColor: '#000000AA', color: 'white'}}
                onPress = {() => deletePhoto(imageList[0])}>
                <AntDesign name="closecircleo" size={24} color="black" style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                zIndex: 20, color: 'white'}} />
                </TouchableOpacity>
            <Image accessible={true} style = {{width: '100%', height: 400}} source = {{uri: imageList[0]}} />
            </View>);
        if (imageList.length === 2)
            return (
                <View style={styles.imageContainer}>
                    {imageList.map((item, idx) => {
                        return(
                        <View key={idx} style={{flex: 1, padding: 1}}>
                            <TouchableOpacity style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                            position: 'absolute', top: 10, right: 10, backgroundColor: '#000000AA', color: 'white', zIndex: 20}}
                            onPress = {() => deletePhoto(item)}>
                            <AntDesign name="closecircleo" size={24} color="black" style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                            zIndex: 20, color: 'white'}} />
                            </TouchableOpacity>
                        <Image accessible={true} style = {{width: '100%', height: 400}} source={{uri: item}}/>
                        </View>);
                        })}
                </View>
            )
        else return (
            <View style={styles.imageContainer}>
                <View style={{flex: 2, padding: 1}}>
                    <TouchableOpacity style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                    position: 'absolute', top: 10, right: 10, zIndex: 20, backgroundColor: '#000000AA', color: 'white'}}
                    onPress = {() => deletePhoto(imageList[0])}>
                    <AntDesign name="closecircleo" size={24} color="black" style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                    zIndex: 20, color: 'white'}} />
                    </TouchableOpacity>
                    <Image accessible={true} style = {{width: '100%', height: 400}} source={{uri: imageList[0]}}/>
                </View>
    
                <View style={{flex: 1, padding: 1}}>
                {imageList.map((item, idx) => {
                    if (idx === 0)
                        return null;
                    else 
                        return(
                        <View style={{ padding: 1, flex: 1}} key={idx}>
                            <TouchableOpacity style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                            position: 'absolute', top: 10, right: 10, zIndex: 20, backgroundColor: '#000000AA', color: 'white'}}
                            onPress = {() => deletePhoto(item)}>
                            <AntDesign name="closecircleo" size={24} color="black" style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                            zIndex: 20, color: 'white'}} />
                            </TouchableOpacity>
                            <Image accessible={true} style = {{width: '100%', height: '100%'}} source={{uri: item}}/>
                        </View>);
                    })}
                </View>
            </View>
        )
    }

    return(
        <KeyboardAvoidingView style = {styles.container}>
            <StatusBar backgroundColor={Const.COLOR_THEME} hidden={false}/>
            <View style = {styles.inner}>
            <ScrollView style={{marginBottom: 70}}>
            <TextInput style = {styles.textArea} placeholder="Bạn đang nghĩ gì?" multiline={true}
            value={globalState.postDescription} onChangeText = {(val) => handleChangeText(val)}/>

            <View>
                <PhotoList imageList={globalState.postImages}/>
                {((globalState.postVideo !== null) && (globalState.postVideo.length !== 0)) && 
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                    position: 'absolute', top: 10, right: 10, backgroundColor: '#000000AA', color: 'white', zIndex: 20}}
                    onPress = {() => deleteVideo()}>
                    <AntDesign name="closecircleo" size={24} color="black" style={{height: 24, width: 24, borderRadius: 15, textAlign: 'center',
                    zIndex: 20, color: 'white'}} />
                    </TouchableOpacity>
                    <Video style = {{width: '100%', height: 400}} source = {{uri: globalState.postVideo[0]}}
                            resizeMode={"cover"} muted={true} repeat={true} rate={1.0} />
                </View>}
            </View>


            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="sticker-emoji" size={28} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('Chọn ảnh', {mode: 'edit', limit: 4 - globalState.postImages.length});
                }}>
                    <Ionicons name="ios-image-outline" size={28} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('Chọn video',{mode: 'edit'});
                }}>
                    <Feather name="youtube" size={28} color="#616161" />
                </TouchableOpacity>
            </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    inner: {
        flex: 1,
    },
    textArea: {
        paddingLeft: 15,
        fontSize: 20,
        marginBottom: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-around",
        padding: 10,
        borderTopColor: "#bdbdbd",
        borderTopWidth: 1,
    },
    imageContainer: {
        padding: 5,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
    }
})