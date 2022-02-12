import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, ScrollView, Text, Button, Clipboard, StyleSheet, Alert, Touchable, TouchableOpacity } from 'react-native';

import socketIOClient from "socket.io-client";

import * as Const from '../../../config/Constants';
import { GlobalContext } from '../../../utility/context';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

import { Bubble, GiftedChat, Send, Actions, ActionsProps } from 'react-native-gifted-chat';
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import * as RootNavigation from '../../../RootNavigation.js';
import {EmojiConvert} from '../../../utility/EmojiConvert';

export const HeaderConversation = (props) => {
  const [userStatus, setUserStatus] = useState(null);

  const FormatTime = ({time}) => {
    let inputTime = new Date(time);
    let today = new Date();
    if ((today - inputTime)/(1000*60) < 60) 
      return (
        <Text style={{color: '#eeeeee', fontSize: 14}}>Truy cập {Math.round((today - inputTime)/(1000*60))} phút trước </Text>
      )
    else if ((today - inputTime)/(1000*60*60) < 24) 
      return (
        <Text style={{color: '#eeeeee', fontSize: 14}}>Truy cập {Math.round((today - inputTime)/(1000*60*60))} giờ trước </Text>
        // <Text style={{color: '#eeeeee', fontSize: 14}}>Truy cập {Math.round((today - inputTime)/(1000*60))} phút trước </Text>
      )
    else {
      let showTime = `Truy cập ngày ${inputTime.getDate()}/${inputTime.getMonth()+1}/${inputTime.getFullYear()}` 
    return (
      <Text style={{color: '#eeeeee', fontSize: 14}}>{showTime}</Text>
    )
    }
  }
  
  useEffect(() => {
    
    try {
      let io = socketIOClient(Const.API_URL);
      io.emit('chat', {chatId: props.chatId, userId: props.userId});
      io.on("chat", () => {
        getStatus();
      });
      const getStatus = async () => {
        const response = await fetch(Const.API_URL+'/api/chats/getUserStatus/'+ props.userReceiverId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        setUserStatus(json.statusUser);
      };
      getStatus();
      setInterval(getStatus, 1000*60);
      // getStatus();
    } catch (error) {
      console.error(error);
    }
  }, [])

  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={styles.headerWrapper} onPress={() => {
          RootNavigation.goBack();
        }}
        >
          <Ionicons style={{paddingRight: 15}} name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={{color: 'white', fontSize: 18}}>
            {props.chatName}
          </Text>
          {(userStatus && userStatus.status === 'ONLINE') &&
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#00e676'}}/>
            <Text style={{paddingLeft: 5, color: '#eeeeee', fontSize: 14}}>Trực tuyến</Text>
          </View>
          }
          {(userStatus && userStatus.status === 'OFFLINE') &&
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Text style={{color: '#eeeeee', fontSize: 14}}>Truy cập 0 phút trước</Text> */}
            <FormatTime time={userStatus.lastSeen}/>
            {/* <Text style={{color: '#eeeeee', fontSize: 14}}>{userStatus.lastSeen}</Text> */}
          </View>
          }
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
        <TouchableOpacity style={{paddingRight: 12}}>
          <Ionicons name="call-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{paddingRight: 12}}>
          <Ionicons name="videocam-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{paddingRight: 12}} onPress={() => RootNavigation.navigate(('Tùy chọn'), 
      {chatId: props.chatId, userId: props.userId, userReceiverId: props.userReceiverId})}>
          <Ionicons name="menu" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Conversation(props) {
  const chatId = props.route.params.chatId;
  const userId = props.route.params.userId;
  const chatName = props.route.params.chatName;
  const userReceiverId = props.route.params.userReceiverId;
  const [messages, setMessages] = useState([]);
  const { globalState } = React.useContext(GlobalContext);
  const [isBlock, setIsBlock] = useState(false);
  
  // const socketRef = useRef()
  // socketRef.current = io(Const.API_URL)

  useEffect(() => {
    
    try {

      let io = socketIOClient(Const.API_URL);
      io.emit('chat', {chatId: chatId, userId: userId});
      io.on("chat", () => {
        getMessages();
      });
      const getMessages = async () => {
        const response2 = await fetch(Const.API_URL+'/api/users/show/' + globalState.user._id, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const json2 = await response2.json();

        const response3 = await fetch(Const.API_URL+'/api/users/show/' + userReceiverId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const json3 = await response3.json();
        console.log(json2.data.blocked_inbox);
        console.log(userReceiverId);
        console.log(json3.data.blocked_inbox);
        console.log(globalState.user._id);
        if ((json2.data.blocked_inbox.includes(userReceiverId)) || (json3.data.blocked_inbox.includes(globalState.user._id))) {
          setIsBlock(true);
        }
        else setIsBlock(false);
        test = chatId
        const response = await fetch(Const.API_URL+'/api/chats/getMessages/'+chatId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${globalState.userToken}`,
          },
        });
        const json = await response.json();
        let newMessagesList = [];
        (json.data).forEach((item, idx) => {
          newMessagesList.push({
            _id: item._id, 
            text: item.content, 
            createdAt: item.createdAt,
            image: (item.image)?(Const.API_URL + item.image):null,
            video: (item.video)?(Const.API_URL + item.video):null,
            user: {
              _id: item.user._id,
              name: item.user.username,
              avatar: Const.API_URL + item.user.avatar
            }
          });
        });
        setMessages(newMessagesList);
      };
      const unsubscribe = props.navigation.addListener('focus', getMessages);
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
    const socket = io(Const.API_URL)
    socket.on('id', id => {
      console.log(id)
    })
  }, [])

  const onSend = (message) => {
    let userObject = message[0].user
    message[0].text = EmojiConvert(message[0].text);
    let txt = message[0].text;
    console.log(message)
    setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    const messageObject = {
      chatId: chatId,
      type: 'PRIVATE_CHAT',
      content: txt,
    }
    // socketRef.current.emit('chat message', messageObject)
    fetch(Const.API_URL + '/api/chats/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalState.userToken}`
      },
      body: JSON.stringify(messageObject)
      }).then((res) => {
        return res.json();
      }).catch((err) => {
        console.log(err);
      });
  }

  const onDelete = (messageIdToDelete) => {
    setMessages(messages.filter(message => message._id !== messageIdToDelete))
    fetch(Const.API_URL + '/api/chats/deleteMessage/' + messageIdToDelete, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalState.userToken}`
      },
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  }

  const onLongPress = (context, message) => {
    console.log(context, message);
    const options = ['Copy', 'Delete', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          Clipboard.setString(message.text)
          break;
        case 1:
          Alert.alert(
          "Are your sure?",
          "Are you sure you want to remove this message?",
          [
            {
              text: "Yes",
              onPress: () => {
                onDelete(message._id)
              },
            },
            {
              text: "No",
            },
          ]
        );
          break;
        default:
          break;
      }
    })
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 6, marginRight: 5}}
            size={32}
            color="#00acc1"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#b2ebf2"
        },
        left: {
          backgroundColor: 'white'
        }
      }}
      textStyle={{
        right: {
          color: "#000"
        }
      }}
      timeTextStyle={{
        right: {
          color: 'black',
        }
      }}
    />
    );
  }

  const renderMessageVideo = (prop) => {
    const { currentMessage } = prop;
    return (
      <View style={{ width: 250, height: 400, justifyContent: 'center', alignItems: 'center'}}>
        <VideoPlayer style = {{flex: 1}} source={{ uri: currentMessage.video }} disableBack disableFullscreen
          paused = {true} resizeMode="cover"/>
      </View>
    );
  };


  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  };

  function renderActions(prop) {
    return (
      <Actions
        {...prop}
        options={{
          ['Chọn ảnh']: () => {
            props.navigation.navigate('Chọn ảnh', {chatId: chatId, mode: 'message', limit: 1, chatName: chatName });
          },
          ['Chọn video']: () => {
            props.navigation.navigate('Chọn video', {chatId: chatId, mode: 'message', chatName: chatName});
          },
        }}
        icon={() => (
          <AntDesign name="pluscircle" size={26} color="#00acc1"/>
        )}
        onSend={args => console.log(args)}
      />
    )
  }

  return (
    <View style={{flex: 1, width: '100%'}}>
      {isBlock&&<Text style={{backgroundColor: '#e1f5fe', color: 'black', textAlign: 'center', padding: 10}}>
        Bạn không thể trả lời cuộc trò chuyện này</Text>}
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userId,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      infiniteScroll
      onLongPress={onLongPress}
      renderActions={renderActions}
      renderMessageVideo={renderMessageVideo}
      style={{flex: 1, width: '100%'}}
      renderInputToolbar={isBlock ? () => null : undefined}
    />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
