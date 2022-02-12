import React, {useEffect, useState} from 'react';
import { Text, View, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import{ GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
export default function ChatSetting(props) {
  const [user, setUser] = useState(null);
  const [blockInbox, setBlockInbox] = useState(false);
  const [blockNotiInbox, setBlockNotiInbox] = useState(false);
  const { globalFunction, globalState } = React.useContext(GlobalContext);
  useEffect(() => {
    const getData = async () => {
        try {
            const response2 = await fetch(Const.API_URL+'/api/users/show/' + globalState.user._id, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              const json2 = await response2.json();
              console.log(json2.data.blocked_inbox);
              console.log(props.route.params.userReceiverId);
              setBlockInbox(json2.data.blocked_inbox.includes(props.route.params.userReceiverId));
              setBlockNotiInbox(json2.data.blocked_notiInbox.includes(props.route.params.userReceiverId));

            const response = await fetch(Const.API_URL+'/api/users/show/' + props.route.params.userReceiverId, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            const json = await response.json();
            setUser(json.data)
        } catch(e) {
            console.error(e)
        }
            };
    getData();
  }, []);

  const blockInboxPress = async () => {
    try {
        setBlockInbox(!blockInbox);
        await fetch(Const.API_URL+'/api/users/editBlock', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
              blockId: props.route.params.userReceiverId,
              blockField: "blocked_inbox"
            })
          });
        } catch (e) {
            console.log(e)
        }
  }

  const blockNotiInboxPress = async () => {
    try {
        setBlockNotiInbox(!blockNotiInbox);
        await fetch(Const.API_URL+'/api/users/editBlock', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
              blockId: props.route.params.userReceiverId,
              blockField: "blocked_notiInbox"
            })
          });
        } catch (e) {
            console.log(e)
        }
  }

  return (
    <>
    {user &&<View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        <View style={{width: '100%', position: 'relative',  alignItems: 'center', paddingBottom: 50}}>
            <ImageBackground source={{uri: Const.API_URL+ user.cover_image}} style={styles.imageCover} resizeMode="cover">
                <View style={styles.innerDarker} />
            </ImageBackground>
            <Image source={{uri: Const.API_URL+ user.avatar}} style={styles.image} resizeMode="cover"/>
        </View>
        <Text style={{fontWeight: '500', color: 'black', fontSize: 22}}>{user.username}</Text>

        <View style={{width: '100%', paddingTop: 60, paddingLeft: 20, paddingRight: 20}}>
            <TouchableOpacity style={styles.line} onPress={() => {
                props.navigation.navigate('FriendProfile',{userId: user._id, username: user.username, avatar: user.avatar})}}>
                <Text style={styles.text}>Xem trang cá nhân</Text>
                <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.divider}/>
            {blockNotiInbox?
            <TouchableOpacity style={styles.line} onPress={blockNotiInboxPress}>
                <Text style={styles.text}>Bật thông báo tin nhắn</Text>
                <Ionicons name="ios-notifications-off-outline" size={24} color="black" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.line} onPress={blockNotiInboxPress}>
                <Text style={styles.text}>Tắt thông báo tin nhắn</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
            }
            <View style={styles.divider}/>
            <TouchableOpacity style={styles.line} onPress={blockInboxPress}>
                <Text style={styles.text}>{blockInbox?'Bỏ chặn tin nhắn từ người này':'Chặn tin nhắn từ người này'}</Text>
                <MaterialIcons name="block" size={24} color="black" />
            </TouchableOpacity>
        </View>
      </View>
    }
    </>
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
})