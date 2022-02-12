import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image, Button, StatusBar } from 'react-native';
import {
	Ionicons,
	MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  AntDesign
} from '@expo/vector-icons'
import VideoPlayer from 'react-native-video-controls';
import NetInfo from "@react-native-community/netinfo";

import * as Const from '../../../config/Constants';
import { GlobalContext } from '../../../utility/context';
import { PhotoList } from './Post';
import BottomPopupSelf from '../../../components/BottomPopupSelf';
import BottomPopupOther from '../../../components/BottomPopupOthers';
import CommentPopup from '../../../components/CommentPopup';
import CustomPopup from '../../../components/CustomPopup';
export const FormatTime = ({data}) => {
  let currentYear = new Date().getFullYear();
  let time = new Date(data);
  let showTime;
  let singleMinutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let minute = time.getMinutes().toString();
  if (singleMinutes.includes(minute)) minute = '0' + minute;
  if (currentYear === time.getFullYear()) {
    showTime = `${time.getDate()}/${time.getMonth()+1} lúc ${time.getHours()}:${minute}`
  } else {
    showTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} lúc ${time.getHours()}:${minute}`
  }

  return (
    <Text>{showTime}</Text>
  );
}

export default function DiaryTab(props) {

  const [postList, setPostList] = useState([]);
  const { globalState } = React.useContext(GlobalContext);
  const [showPopupSelf, setShowPopupSelf] = useState(false);
  const [showPopupOther, setShowPopupOther] = useState(false);
  const [showPopupComment, setShowPopupComment] = useState(false);
  const [postData, setPostData] = useState(null);
  const [postForComment, setPostForComment] = useState(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showCustomPopup2, setShowCustomPopup2] = useState(false);

  const deletePost = (item) => {
    setShowPopupSelf(false);
    let filterArr = postList.filter(value => value !== item);
    setPostList([...filterArr]);
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

  const closePopupComment = () => {
    setShowPopupComment(false);
  }

  const switchBlockDiary = async () => {
    try {
        await fetch(Const.API_URL+'/api/users/editBlock', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
              blockId: postData.author._id,
              blockField: "blocked_diary"
            })
          });
        getData();
    } catch (e) {
        console.log(e)
    }
}
const switchHideDiary = async () => {
    try {
        await fetch(Const.API_URL+'/api/users/editBlock', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
              blockId: postData.author._id,
              blockField: "blocked_notiDiary"
            })
          });
          getData();
    } catch (e) {
        console.log(e)
    }
}

  const heartPress = async(id, idx) => {
    let state = await NetInfo.fetch()
    if (!state.isConnected) {
      console.log(state.isConnected)
      setShowCustomPopup(true);
      setTimeout(() => {
        setShowCustomPopup(false)
      }, 2000);
      return;
    }
    let posts = [...postList];
    if (posts[idx].isLike) {
      posts[idx].isLike = false;
      posts[idx].countLikes -= 1;
    } else {
      posts[idx].isLike = true;
      posts[idx].countLikes += 1;
    }
    setPostList(posts);
    const response = await fetch(Const.API_URL+'/api/postLike/action/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalState.userToken}`,
      },
  })
  }

  const getData = async () => {
    const response = await fetch(Const.API_URL+'/api/posts/list', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalState.userToken}`,
      },
    });
    const json = await response.json();
    let newPostList = [];
    (json.data).forEach((item, idx) => {
      const newImages = [];
        item.images.forEach((value, i) => {
          newImages.push(Const.API_URL + value);
          });

        const newVideos = [];
        item.videos.forEach((value, i) => {
          newVideos.push(Const.API_URL + value);
          });

      newPostList.push({...item, images: newImages, videos: newVideos, countLikes: item.like.length});
    });
    setPostList(newPostList);
    };


  useEffect(() => {
    try {
      getData();
      const unsubscribe = props.navigation.addListener('focus', getData);
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  }, [showPopupComment]);

    return (
      <ScrollView style={styles.container}>
         <StatusBar  backgroundColor={Const.COLOR_THEME}/>
        <View style={styles.toolBar}>
          <TouchableOpacity activeOpacity={1} onPress={() => {
            props.navigation.navigate('Post');
          }}>
            <View style={styles.row}> 
              <Image source={{uri: Const.API_URL + globalState.user.avatar}} style = {styles.image} />
              <Text style={styles.input}> Hôm nay bạn thế nào?</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={{...styles.row, padding: 0}}>

            <TouchableOpacity style={styles.menu} activeOpacity={1} 
            onPress={() => props.navigation.navigate('Chọn ảnh')}>
              <Ionicons name='ios-videocam' size={22} color='#F44337' />
              <Text style={styles.menuText}>Đăng ảnh</Text>
            </TouchableOpacity>
            <View style={styles.separator}/>

            <TouchableOpacity style={styles.menu} activeOpacity={1}
             onPress={() => props.navigation.navigate('Chọn video')}>
            <MaterialIcons name='photo-size-select-actual' size={22} color='#4CAF50' />
              <Text style={styles.menuText}>Đăng video</Text>
            </TouchableOpacity>
            <View style={styles.separator}/>

            <TouchableOpacity style={styles.menu} activeOpacity={1}
             onPress={() => props.navigation.navigate('Post')}>
            <MaterialCommunityIcons name="pen" size={22} color='#E141FC' />
              <Text style={styles.menuText}>Đăng bài</Text>
            </TouchableOpacity>
    
          </View>
        </View>

        <View style={styles.bottomDivider} />

        {postList.map((item, idx) => {
          
          return(
          <View key={idx} style={styles.feedContainer}>

            <View style={styles.feedHeader}>
              <View style = {styles.headerInner}>
                <Image source={{uri: Const.API_URL + item.author.avatar}} style = {styles.imageFeed} />
                <View style = {styles.headerText}>
                  <Text style={styles.feedAuthor}
                    onPress={() => {
                      props.navigation.navigate('FriendProfile',{userId: item.author._id, username: item.author.username, avatar: item.author.avatar})}}
                  >{item.author.username}</Text>
                  <FormatTime data={item.createdAt}/>
                </View>
              </View>  
              <TouchableOpacity onPress={() => {
                setPostData(item);
                if (globalState.user._id === item.author._id)
                  setShowPopupSelf(true)
                else 
                  setShowPopupOther(true)
                }}>
                <Entypo name="dots-three-horizontal" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {(item.described)&&<Text style={styles.feedDescribed}>{item.described}</Text>}

            {(item.images.length !== 0) && <PhotoList imageList={item.images}/> }
            {(item.videos.length !== 0) &&
              <View style={styles.imageContainer}>
                <VideoPlayer style = {{width: '100%', height: 400}} source = {{uri: item.videos[0]}} disableBack
                paused = {true}/>
              </View>}

            {(item.images.length === 0 && item.videos.length === 0) && <View style={styles.feedDivide} />}

            <View style={styles.twoIcons}>
              <View style={styles.oneIcon}>
                <TouchableOpacity onPress={() => heartPress(item._id, idx)}>
                  <AntDesign name={item.isLike?"heart":"hearto"} size={24} color={item.isLike?"#f44336":'black'} />
                </TouchableOpacity>
                <Text style={styles.textIcon}>{item.countLikes}</Text>
              </View>
              <View style={styles.oneIcon}>
              <TouchableOpacity onPress={async() => {
                   let state = await NetInfo.fetch()
                   if (!state.isConnected) {
                     console.log(state.isConnected)
                     setShowCustomPopup(true);
                     setTimeout(() => {
                       setShowCustomPopup(false)
                     }, 2000);
                     return;
                   }
                setPostForComment(item);
                setShowPopupComment(true)
                }}>
                <FontAwesome name="comment-o" size={24} color="black" />
              </TouchableOpacity>
                <Text style={styles.textIcon}>{item.countComments}</Text>
              </View>
            </View>

            <View style={styles.bottomDivider} />
          </View>
        );})}

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
          report = {() => {
            closePopupOther();
            setShowCustomPopup2(true);
            setTimeout(() => {
              setShowCustomPopup2(false)
            }, 2000);
            }
          }
          blockDiary = {() => {
            closePopupOther();
            switchBlockDiary();
          }}
          hideDiary = {() => {
            closePopupOther();
            switchHideDiary();
          }}

        />}

        {postForComment&&<CommentPopup 
          show = {showPopupComment}
          closePopup={closePopupComment}
          animationType='slide'
          data = {postForComment}
        />}

        <CustomPopup 
          show = {showCustomPopup}
        />

        <CustomPopup 
          show = {showCustomPopup2}
          firstLine = "Đã báo cáo bài viết"
          secondLine = "Hệ thống sẽ xem xét và xử lí"
        />
      </ScrollView>
    );
  }

export const styles=StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    toolBar: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      backgroundColor: 'white',
      width: '100%',
      padding: 12,
      alignItems: 'center'
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    input: {
      paddingLeft: 10,
      padding:0,
      margin: 0,
      fontSize: 18,
      color: '#9e9e9e',
      fontWeight: '500',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: '#e0e0e0'
    },
    menu: {
      flex: 1,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', 
    },
    menuText: {
      paddingLeft: 10,
      fontWeight: '500',
      fontSize: 15,
    },
    separator: {
      width: 1,
      height: '100%',
      backgroundColor: '#e0e0e0'
    },
    bottomDivider: {
      width: '100%',
      height: 10,
      backgroundColor: '#e0e0e0'
    },
    feedContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    feedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
    },  
    imageFeed: {
      width: 40,
      height: 40,
      borderRadius: 25
    },
    headerInner: {
      padding: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerText: {
      marginLeft: 15,
    },
    feedAuthor: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      color: 'black',
    },
    feedDescribed: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 5,
      paddingBottom: 16,
      fontSize: 16,
      color: 'black'
    },
    feedDivide: {flex: 1, backgroundColor: '#e0e0e0', height: 1, marginLeft: 16, marginRight: 16},
    twoIcons: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center'
    },
    oneIcon: {
      flexDirection: 'row',
      paddingRight: 30,
      alignItems: 'center',
    },
    textIcon: {
      fontSize: 18,
      color: 'black',
      paddingLeft: 10,
    },
    imageContainer: {
      padding: 5,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }
  })
