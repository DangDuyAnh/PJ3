import React, {useEffect, useState} from 'react';
import { Button, View, StatusBar, StyleSheet, ImageBackground, Image, TouchableOpacity
, Text, ScrollView, TouchableHighlight } from 'react-native';

import{ GlobalContext } from '../../../utility/context';
import {FormatTime} from '../diarytab/DiaryTab'
import * as Const from '../../../config/Constants';
import BottomPopupSelf from '../../../components/BottomPopupSelf';
import BottomPopupOther from '../../../components/BottomPopupOthers';
import CommentPopup from '../../../components/CommentPopup';
import { PhotoList } from '../diarytab/Post';
import {
	Ionicons,
	MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  AntDesign,
  SimpleLineIcons
} from '@expo/vector-icons'
import VideoPlayer from 'react-native-video-controls';
import * as RootNavigation from '../../../RootNavigation';
import { authPost } from '../../../api/api'

export const HeaderFriendProfile = (props) => {
    return(
        <View style={[styles.headerContainer, {paddingRight: 30}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {
            RootNavigation.goBack();
            }}
            >
            <Ionicons style={{paddingRight: 10}} name="arrow-back" size={24} color={Const.COLOR_THEME} />
            </TouchableOpacity>
            <Image source={{uri: Const.API_URL + props.avatar}} style = {{width: 40, height: 40, 
              borderRadius: 20, marginRight: 15, borderWidth: 1, borderColor: '#e0e0e0'}}/>
            <Text style={{fontSize: 24, fontWeight: '700', color: Const.COLOR_THEME}}>
              {props.username}
            </Text>
          </View>
          <TouchableOpacity onPress={() => {RootNavigation.navigate('FriendSetting', {userId: props.userId,
        username: props.username})}}>
            <SimpleLineIcons name="menu" size={24} color={Const.COLOR_THEME} />
          </TouchableOpacity>
        </View>
      );
}

export default function FriendProfile(props) {
  const { globalFunction, globalState } = React.useContext(GlobalContext);
  const [postList, setPostList] = useState([]);
  const [showPopupSelf, setShowPopupSelf] = useState(false);
  const [showPopupOther, setShowPopupOther] = useState(false);
  const [showPopupComment, setShowPopupComment] = useState(false);
  const [postData, setPostData] = useState(null);
  const [postForComment, setPostForComment] = useState(null);
  const [user, setUser] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);
  const [isBlock, setIsBlock] = useState(false);

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
  const heartPress = async(id, idx) => {
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

  useEffect(() => {
    try {
      const getData = async () => {
      const response = await fetch(Const.API_URL+'/api/posts/list?userId='+props.route.params.userId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
      });
      const json = await response.json();
      const response2 = await fetch(Const.API_URL+'/api/users/show/' + props.route.params.userId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json2 = await response2.json();
      setUser(json2.data);
      if (json2.data.blocked_diary.includes(globalState.user._id)) setIsBlock(true)
      const response3 = await fetch(Const.API_URL+'/api/friends/findFriend', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
        body: JSON.stringify({
          userId: props.route.params.userId
        }),
      });
      const json3 = await response3.json();

      setFriendStatus(json3.status)
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
      getData();
      const unsubscribe = props.navigation.addListener('focus', getData);
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  }, [showPopupComment]);

  const addFriend = () => {
    let body = {
      user_id: props.route.params.userId,
    }
    let res = authPost('/friends/set-request-friend', body, globalState.userToken);
    res.then((data) => {
      if (data.code === 200) {
        setFriendStatus('0')
      }
    });

  }

  const sendMessage = async () => {
    try {
    const response = await fetch(Const.API_URL+'/api/chats/createChat', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1: globalState.user._id,
        user2: props.route.params.userId
      })
    });
    const json = await response.json();
    console.log(json)
    RootNavigation.navigate('Conversation', {
      chatName: props.route.params.username,
      chatId: json.chat._id,
      userId: globalState.user._id,
      userReceiverId: props.route.params.userId,
    });
    } catch (e) {
      console.log(e)
    }
  }

  const cancelAskFriend = async () => {
    try {
      const response = await fetch(Const.API_URL+'/api/friends/changeStatus', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
        body: JSON.stringify({
          status: "2",
          userId: props.route.params.userId
        })
      });
      const json = await response.json();
      console.log(json)
      setFriendStatus("2");
    } catch (e) {
      console.log(e)
    }
  }

  const acceptFriend = async () => {
    try {
      const response = await fetch(Const.API_URL+'/api/friends/changeStatus', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
        body: JSON.stringify({
          status: "1",
          userId: props.route.params.userId
        })
      });
      const json = await response.json();
      console.log(json)
      setFriendStatus("1");
    } catch (e) {
      console.log(e)
    }
  }

  const declineFriend = async () => {
    try {
      const response = await fetch(Const.API_URL+'/api/friends/changeStatus', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
        body: JSON.stringify({
          status: "2",
          userId: props.route.params.userId
        })
      });
      const json = await response.json();
      console.log(json)
      setFriendStatus("2");
    } catch (e) {
      console.log(e)
    }
  }

  if (!isBlock)
  return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Button title="Đăng xuất" onPress={globalFunction.signOut}/>
      // </View>
    <ScrollView>
     {user&&<View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        <View style={{width: '100%', position: 'relative',  alignItems: 'center', paddingBottom: 50}}>
          <ImageBackground source={{uri: Const.API_URL+ user.cover_image}} style={styles.imageCover} resizeMode="cover">
              <View style={styles.innerDarker} />
          </ImageBackground>
          <Image source={{uri: Const.API_URL+ user.avatar}} style={styles.image} resizeMode="cover"/>
        </View>
        <Text style={{fontWeight: '500', color: 'black', fontSize: 22, marginBottom: 20}}>{user.username}</Text>
        <View style={styles.bottomDivider} />

        {(friendStatus==="1" || (globalState.user._id === props.route.params.userId))&&
        <ScrollView style={styles.container}>
        {postList.map((item, idx) => {
          
          return(
          <View key={idx} style={styles.feedContainer}>

            <View style={styles.feedHeader}>
              <View style = {styles.headerInner}>
                <Image source={{uri: Const.API_URL + item.author.avatar}} style = {styles.imageFeed} />
                <View style = {styles.headerText}>
                  <Text style={styles.feedAuthor}>{item.author.username}</Text>
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
              <TouchableOpacity onPress={() => {
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
        />}

        {postForComment&&<CommentPopup 
          show = {showPopupComment}
          closePopup={closePopupComment}
          animationType='slide'
          data = {postForComment}
        />}
      </ScrollView>
      }

      {(friendStatus==="0")&&
        <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <Text style={{color: 'black', textAlign: 'center', fontSize: 16}}>Hãy đợi {props.route.params.username + ' '}
           chấp nhận lời mời kết bạn nhé.</Text>

           <TouchableOpacity style={styles.button} onPress={cancelAskFriend}>
                <Text style={styles.buttonTitle}>Hủy yêu cầu kết bạn</Text>
            </TouchableOpacity>
        </View>
      }

      {(friendStatus==="4")&&
        <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <Text style={{color: 'black', textAlign: 'center', fontSize: 16}}>{props.route.params.username + ' '}
           đã gửi cho bạn lời mời kết bạn</Text>

           <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center'}}>
           <TouchableOpacity style={[styles.button2, {marginTop: 0, marginRight: 30}]} onPress={declineFriend}>
                <Text style={styles.buttonTitle2}>Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {marginTop: 0}]} onPress={acceptFriend}>
                <Text style={styles.buttonTitle}>Chấp nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      }

      {(friendStatus==="2" || friendStatus==="3")&&
        <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <Text style={{color: 'black', textAlign: 'center', fontSize: 16}}>Kết bạn với {props.route.params.username + ' '}
           ngay để cùng tạo nên những cuộc trò chuyện thú vị và đáng nhớ.</Text>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center'}}>
           <TouchableOpacity style={[styles.button2, {marginTop: 0, marginRight: 30}]} onPress={sendMessage}>
                <Text style={styles.buttonTitle2}>Nhắn tin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {marginTop: 0}]} onPress={addFriend}>
                <Text style={styles.buttonTitle}>Kết bạn</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
     </View>}
    </ScrollView>
    );

    if (isBlock) 
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Button title="Đăng xuất" onPress={globalFunction.signOut}/>
      // </View>
    <ScrollView>
     {user&&<View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        <View style={{width: '100%', position: 'relative',  alignItems: 'center', paddingBottom: 50}}>
          <ImageBackground source={{uri: Const.API_URL+ user.cover_image}} style={styles.imageCover} resizeMode="cover">
              <View style={styles.innerDarker} />
          </ImageBackground>
          <Image source={{uri: Const.API_URL+ user.avatar}} style={styles.image} resizeMode="cover"/>
        </View>
        <Text style={{fontWeight: '500', color: 'black', fontSize: 22, marginBottom: 20}}>{user.username}</Text>
        <View style={styles.bottomDivider} />

        <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <Text style={{color: 'black', textAlign: 'center', fontSize: 16}}>Không thể xem nhật ký của {props.route.params.username}</Text>
        </View>
     </View>}
    </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    imageCover: {
        height: 150,
        width: '100%',
    },
    innerDarker: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.1)'
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
        position: 'absolute',
        top: 100,
        borderWidth: 3,
        borderColor: 'white'
    },
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: 'black',
        paddingTop: 10,
        paddingBottom: 10
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#bdbdbd',
        marginBottom: 1
    },
    container: {
      flex: 1,
      backgroundColor: 'white',
      width: '100%'
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
    image2: {
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
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        width: '100%',
      },
    headerWrapper: {
    flexDirection: 'row', 
    alignItems: "center",
    },
    button: {
      marginTop: 20,
      borderRadius: 20,
      marginHorizontal: 'auto',
      // backgroundColor: '#e1f5fe',
      backgroundColor: Const.COLOR_THEME,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button2: {
      marginTop: 20,
      borderRadius: 20,
      marginHorizontal: 'auto',
      backgroundColor: '#e1f5fe',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTitle: {
      fontSize: 18,
      // color: "#01579b",
      color: "white",
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
      paddingTop: 10,
      fontWeight: "600",
      textAlign: 'center',
    },
    buttonTitle2: {
      fontSize: 18,
      color: "#01579b",
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
      paddingTop: 10,
      fontWeight: "600",
      textAlign: 'center',
    },
})