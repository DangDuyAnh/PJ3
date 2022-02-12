import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Text, View, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, FlatList } from 'react-native';
import {
  Entypo,
  FontAwesome,
  AntDesign,
  Ionicons
} from '@expo/vector-icons'
import VideoPlayer from 'react-native-video-controls';

import { PhotoList } from './Post';
import { GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
import {styles, FormatTime} from './DiaryTab';
import BottomPopupSelf from '../../../components/BottomPopupSelf';
import BottomPopupOther from '../../../components/BottomPopupOthers';

export default function SinglePost(props) {

    const { globalState } = React.useContext(GlobalContext);
    const [post, setPost] = useState(null);
    const [isLoad, setIsLoad] = useState(false);
    const [showPopupSelf, setShowPopupSelf] = useState(false);
    const [showPopupOther, setShowPopupOther] = useState(false);
    const [postData, setPostData] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
            let postId = props.route.params;
            const response = await fetch(Const.API_URL+'/api/posts/show/' + postId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
                });
            const json = await response.json();
            const newImages = [];
            json.data.images.forEach((value, i) => {
              newImages.push(Const.API_URL + value);
              });
  
            const newVideos = [];
            json.data.videos.forEach((value, i) => {
              newVideos.push(Const.API_URL + value);
              });
  
            setPost({...json.data, images: newImages, videos: newVideos, countLikes: json.data.like.length});
            // setPost(json.data);

            const response2 = await fetch(Const.API_URL+'/api/postComment/list/'+postId, {
              method: 'GET',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${globalState.userToken}`,
              },
              });
              const json2 = await response2.json();
              setComments(json2.data);

            }   catch (error) {
                console.error(error);
            }
            setIsLoad(true);
        } 
        getData();
    }, []);

    const deletePost = (item) => {
      }
    
      const editPost = () => {
        setShowPopupSelf(false);
      }
    
      const closePopupSelf = () => {
        setShowPopupSelf(false);
      }
    
      const closePopupOther = () => {
        setShowPopupOther(false);
      }

    const heartPress = async(id) => {
        if (post.isLike) {
          setPost({...post, isLike: false, countLikes: post.countLikes - 1})
        } else {
          setPost({...post, isLike: true, countLikes: post.countLikes + 1})
        }
        const response = await fetch(Const.API_URL+'/api/postLike/action/' + id, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${globalState.userToken}`,
          },
      })
      }

      const renderItem = ({item, index}) => {
        return(
        <View style={{flexDirection: 'row', margin: 10}}>
            <Image source={{uri: Const.API_URL + item.user.avatar}} style={styles2.image}/>

            <View style={{flex: 1}}>
                <View style={styles2.textContainer}>
                    <Text style = {{fontSize: 18, color: 'black', fontWeight: '700'
                    , paddingBottom: 4}}>{item.user.username}</Text>
                    <Text style={{fontSize: 18, color: 'black'}}>{item.content}</Text>
                </View>
                <FormatTime data={item.createdAt} style={{paddingLeft: 10, fontSize: 16, fontWeight: '900'
            , paddingTop: 2}}/>
            </View> 
        </View>
        );
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
        <ScrollView style={styles.container}>
        {(isLoad)&&<View style={styles.feedContainer}>

            <View style={styles.feedHeader}> 
              <View style = {styles.headerInner}>
                <Image source={{uri: Const.API_URL + post.author.avatar}} style = {styles.imageFeed} />
                <View style = {styles.headerText}>
                  <Text style={styles.feedAuthor}>{post.author.username}</Text>
                  <FormatTime data={post.createdAt}/>
                </View>
              </View>  
              <TouchableOpacity onPress={() => {
                setPostData(post);
                if (globalState.user._id === post.author._id)
                  setShowPopupSelf(true)
                else 
                  setShowPopupOther(true)
                }}>
                <Entypo name="dots-three-horizontal" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {(post.described)&&<Text style={styles.feedDescribed}>{post.described}</Text>}

            {(post.images.length !== 0) && <PhotoList imageList={post.images}/> }
            {(post.videos.length !== 0) &&
              <View style={styles.imageContainer}>
                <VideoPlayer style = {{width: '100%', height: 400}} source = {{uri: post.videos[0]}} disableBack
                paused = {true}/>
              </View>}

            {(post.images.length === 0 && post.videos.length === 0) && <View style={styles.feedDivide} />}

            <View style={styles.twoIcons}>
              <View style={styles.oneIcon}>
                <TouchableOpacity onPress={() => heartPress(post._id)}>
                  <AntDesign name={post.isLike?"heart":"hearto"} size={24} color={post.isLike?"#f44336":'black'} />
                </TouchableOpacity>
                <Text style={styles.textIcon}>{post.countLikes}</Text>
              </View>
              <View style={styles.oneIcon}>
              <FontAwesome name="comment-o" size={24} color="black" />
                <Text style={styles.textIcon}>{post.countComments}</Text>
              </View>
            </View>

            <View style={{flex: 1, width: '100%'}}>
              <FlatList
                  data={comments}
                  renderItem={renderItem}
              /> 
            </View>           
        </View>}
        <BottomPopupSelf
          show={showPopupSelf}
          closePopup={closePopupSelf}
          data = {postData}
          deletePost = {deletePost}
          editPost = {editPost}
        />

        {postData&&<BottomPopupOther
          show={showPopupOther}
          closePopup={closePopupOther}
          data = {postData}
        />}

        </ScrollView>
        <View style={{maxHeight: 160,borderTopColor:'#757575', borderTopWidth: 1 , width: '100%'
                , backgroundColor: 'white', paddingRight: 15, paddingLeft: 15, paddingBottom: 10, paddingTop: 10}}>
                        <ScrollView style={{flexGrow:0, width: '100%', backgroundColor: '#eeeeee', borderRadius: 20}}>
                            <TextInput value={text} placeholder='Viết bình luận...' multiline={true}
                            style={{width: '100%', fontSize: 20,}}
                            onChangeText = {(val) => setText(val)}
                            />
                        </ScrollView>

                        {(text !== '')&&
                        <View style={{width: '100%', flexDirection: 'row-reverse', paddingTop: 7}}>
                            <TouchableOpacity>
                                <Ionicons name="send" size={24} color={Const.COLOR_THEME} />
                            </TouchableOpacity>
                        </View>
                        }
              </View> 
        </KeyboardAvoidingView>
    );
}

const styles2 = StyleSheet.create({
  divider: {
      width: '100%',
      height: 1,
      backgroundColor: '#bdbdbd',
      marginBottom: 1
  },
  image: {
      width : 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
  },
  textContainer: {
      borderRadius: 8,
      backgroundColor: "#eeeeee",
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      paddingTop: 5
  }
})