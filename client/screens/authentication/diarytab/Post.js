import React, {useEffect, useState} from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StyleSheet, ScrollView, View, TextInput, KeyboardAvoidingView, TouchableOpacity, StatusBar, Button, Image} from 'react-native';
import Video from 'react-native-video';

import { GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
import * as RootNavigation from '../../../RootNavigation';

export const PhotoList = ({imageList}) => {
    if ((imageList === undefined) || (imageList === null) || (imageList.length === 0)) return null;
    if (imageList.length === 1) 
        return (
        <View style={styles.imageContainer}>
        <Image accessible={true} style = {{width: '100%', height: 400}} source = {{uri: imageList[0]}} />
        </View>);
    if (imageList.length === 2)
        return (
            <View style={styles.imageContainer}>
                {imageList.map((item, idx) => {
                    return(
                    <View key={idx} style={{flex: 1, padding: 1}}>
                    <Image accessible={true} style = {{width: '100%', height: 400}} source={{uri: item}}/>
                    </View>);
                    })}
            </View>
        )
    else return (
        <View style={styles.imageContainer}>
            <View style={{flex: 2, padding: 1}}>
                <Image accessible={true} style = {{width: '100%', height: 400}} source={{uri: imageList[0]}}/>
            </View>

            <View style={{flex: 1, padding: 1}}>
            {imageList.map((item, idx) => {
                if (idx === 0)
                    return null;
                else 
                    return(
                    <View style={{ padding: 1, flex: 1}} key={idx}>
                    <Image accessible={true} style = {{width: '100%', height: '100%'}} source={{uri: item}}/>
                    </View>);
                })}
            </View>
        </View>
    )
}

export function PostButton(props) {
    const { globalState } = React.useContext(GlobalContext);

    const handlePost = async () => {
        let postDescription = globalState.postDescription;
        let postImages = globalState.postImages;
        let postVideo = globalState.postVideo;

        const formData = new FormData();
        
        if (postDescription) formData.append("described", postDescription);

        if (postImages) {
        postImages.forEach((item, i) => {
            formData.append("images", {
                uri: item,
                type: "image/jpeg",
                name: `image${i}.jpg`,
            });
            });
        };
            
        if (postVideo) {
            formData.append("videos", {
            uri: postVideo,
            type: 'video/mp4',
            name: 'video.mp4'
        })
        }

        try {
            const response = await fetch(Const.API_URL+'/api/posts/create', {
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
            RootNavigation.navigate('Main tab');
          } catch (error) {
            console.error(error);
          }

    }
    return(
        <Button
            onPress={() => {
                handlePost();
                
            }}
            title="ĐĂNG"
            disabled={((!globalState.postVideo) &&(!globalState.postImages || globalState.postImages.length === 0)&&(!globalState.postDescription))
                ?true:false}
            color= {Const.COLOR_THEME}
        />
    );
}

export function Post(props) {

    const { globalFunction, globalState } = React.useContext(GlobalContext);
    const [textVal, setTextVal] = useState(null);

    useEffect(() => {
        globalFunction.updatePostDescription(textVal);
        globalFunction.updatePostImages(null);
        globalFunction.updatePostVideo(null);

        const unsubscribe = props.navigation.addListener('focus', () => {
            globalFunction.updatePostImages(null);
            globalFunction.updatePostVideo(null);
            if(props.route.params) {
                if (props.route.params.images) 
                    globalFunction.updatePostImages(props.route.params.images);
                if (props.route.params.video) 
                    globalFunction.updatePostVideo(props.route.params.video);
            }
        });
        return unsubscribe;
    }, [props.route.params]);

    const handleChangeText = (val) => {
        setTextVal(val);
        globalFunction.updatePostDescription(val);
    }

    return(
        <KeyboardAvoidingView style = {styles.container}>
            <StatusBar backgroundColor={Const.COLOR_THEME} hidden={false}/>
            <View style = {styles.inner}>
            <ScrollView style={{marginBottom: 70}}>
            <TextInput style = {styles.textArea} placeholder="Bạn đang nghĩ gì?" multiline={true}
            onChangeText = {(val) => handleChangeText(val)}/>

            {(props.route.params !== undefined && props.route.params !== null)&&
            <View>
                <PhotoList imageList={props.route.params.images}/>
                {(props.route.params.video !== undefined && props.route.params.video !== null)&&
                <View style={styles.imageContainer}>
                    <Video style = {{width: '100%', height: 400}} source = {{uri: props.route.params.video}}
                            resizeMode={"cover"} muted={true} repeat={true} rate={1.0} />
                </View>}
            </View>
            }

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="sticker-emoji" size={28} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('Chọn ảnh');
                }}>
                    <Ionicons name="ios-image-outline" size={28} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('Chọn video');
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