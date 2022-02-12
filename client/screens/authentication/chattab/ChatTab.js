import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import * as Const from '../../../config/Constants';
import { GlobalContext } from '../../../utility/context';

export default function ChatTab(props) {

  const [chatList, setChatList] = useState([]);
  const { globalState } = React.useContext(GlobalContext);

  const getMessageTime = (data) => {
    let currentTime = new Date();
    let mesTime = new Date(data);
    let mesTimeText;
    let singleMinutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (mesTime.getDay() == currentTime.getDay()) {
      let hour = mesTime.getHours().toString();
      let minute = mesTime.getMinutes().toString();
      if (singleMinutes.includes(minute)) minute = '0' + minute;
      mesTimeText = `${hour}:${minute}`;
    } else if ((currentTime.getTime() - mesTime.getTime())/604800000 <= 1) {
      if (mesTime.getDay() == 0) mesTimeText = 'CN';
      else mesTimeText = `Th ${mesTime.getDay() + 1}`;
    } else {
      mesTimeText = `${mesTime.getDate()} thg ${mesTime.getMonth() + 1}`;
    }
    return mesTimeText;
  }

  useEffect(() => {
    try {
      const getData = async () => {
        const response = await fetch(Const.API_URL+'/api/chats/getListConversations', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${globalState.userToken}`,
          },
        });
        const json = await response.json();
        let newChatList = [];
        (json.data).forEach((item, idx) => {
          newChatList.push({
            id: idx, 
            chatId: item.chat._id,
            userName: item.receiver.username, 
            userImg: Const.API_URL + item.receiver.avatar, 
            messageTime: getMessageTime(item.lastMessage.createdAt),
            messageText: item.lastMessage.content,
            userId: item.sender,
            userReceiverId: item.receiver._id
          });
        });
        setChatList(newChatList);
      };
      const unsubscribe = props.navigation.addListener('focus', getData);
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <>
      <StatusBar  backgroundColor={Const.COLOR_THEME}/>
      <FlatList
        data={chatList}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.container}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => props.navigation.navigate('Conversation', {
                chatName: item.userName,
                chatId: item.chatId,
                userId: item.userId,
                userReceiverId: item.userReceiverId,
              })}
            >
              <View style={styles.userInfo}>
                <View style={styles.userImgWrapper}>
                  <Image 
                    source={{uri: item.userImg}}
                    style={styles.userImg}
                  />
                </View>
                <View style={styles.textSection}> 
                  <View style={styles.userInfoText}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.postTime}>{item.messageTime}</Text>
                  </View>
                  <Text style={styles.messageText}>{(item.messageText)?item.messageText:
                  `${item.userName} đã gửi một tệp đính kèm`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF50"
  },
  card: {
    width: "100%"
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textSection: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  },
  userInfoText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lato-Regular"
  },
  postTime: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lato-Regular"
  },
  messageText: {
    fontSize: 14,
    color: "#333333"
  }
});