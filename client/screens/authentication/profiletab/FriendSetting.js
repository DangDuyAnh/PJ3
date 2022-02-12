import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Touchable, TouchableOpacity, Switch} from 'react-native';
import{ GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
export default function FriendSetting(props) {
    const [blockDiary, setBlockDiary] = useState(false);
    const [hideDiary, setHideDiary] = useState(false);
    const [blockInbox, setBlockInbox] = useState(false);
    const { globalFunction, globalState } = React.useContext(GlobalContext);
    const [friendStatus, setFriendStatus] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
            const response2 = await fetch(Const.API_URL+'/api/users/show/'+globalState.user._id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                }
                });
            const json2 = await response2.json();
            console.log(json2)
            setBlockDiary(json2.data.blocked_diary.includes(props.route.params.userId));
            setHideDiary(json2.data.blocked_notiDiary.includes(props.route.params.userId));
            setBlockInbox(json2.data.blocked_inbox.includes(props.route.params.userId));
            const response = await fetch(Const.API_URL+'/api/friends/findFriend', {
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
            const json = await response.json();
            setFriendStatus(json.status)
        }
            catch (error) {
            console.error(error);
        }
        }
        getData();
        const unsubscribe = props.navigation.addListener('focus', getData);
        return unsubscribe;
    }, []);

    const deleteFriend = async () => {
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

    const switchBlockDiary = async () => {
        setBlockDiary(previousState => !previousState);
        try {
            await fetch(Const.API_URL+'/api/users/editBlock', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${globalState.userToken}`,
                },
                body: JSON.stringify({
                  blockId: props.route.params.userId,
                  blockField: "blocked_diary"
                })
              });
        } catch (e) {
            console.log(e)
        }
    }
    const switchHideDiary = async () => {
        setHideDiary(previousState => !previousState);
        try {
            await fetch(Const.API_URL+'/api/users/editBlock', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${globalState.userToken}`,
                },
                body: JSON.stringify({
                  blockId: props.route.params.userId,
                  blockField: "blocked_notiDiary"
                })
              });
        } catch (e) {
            console.log(e)
        }
    }

    const switchBlockInbox = async () => {
        setBlockInbox(previousState => !previousState);
        try {
            await fetch(Const.API_URL+'/api/users/editBlock', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${globalState.userToken}`,
                },
                body: JSON.stringify({
                  blockId: props.route.params.userId,
                  blockField: "blocked_notiInbox"
                })
              });
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
        {friendStatus==='1'&&
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.group}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Thông tin', {userId: props.route.params.userId})}>
                    <Text style={styles.text}>Thông tin</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomDivider} />
            <View style={styles.group}>
                <Text style={styles.smallText}>Cài đặt riêng tư</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Chặn xem nhật ký của tôi</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={blockDiary ? "#03a9f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={switchBlockDiary}
                        value={blockDiary}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Ẩn nhật ký của người này</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={hideDiary ? "#03a9f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={switchHideDiary}
                        value={hideDiary}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Chặn tin nhắn của người này</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={blockInbox ? "#03a9f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={switchBlockInbox}
                        value={blockInbox}
                    />
                </View>
            </View>

            <View style={styles.bottomDivider} />
            <TouchableOpacity onPress={deleteFriend}>
            <View style={styles.group}>
                <Text style={[styles.text, {color: 'red', paddingTop: 0}]}>Xóa bạn</Text>
            </View>
            </TouchableOpacity>
        </View>}
        {(friendStatus!==null)&&(friendStatus!=='1')&& 
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.group}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Thông tin', {userId: props.route.params.userId})}>
                    <Text style={styles.text}>Thông tin</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomDivider} />
            <View style={styles.group}>
                <Text style={styles.smallText}>Cài đặt riêng tư</Text>
                
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Chặn tin nhắn của người này</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={blockInbox ? "#03a9f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={switchBlockInbox}
                        value={blockInbox}
                    />
                </View>
            </View>

        </View>
        }
        </>
    )
}

const styles = StyleSheet.create({
    group: {
        paddingLeft: 20,
        paddingTop: 15,
        paddingRight: 10
    },
    smallText: {
        fontWeight: 16,
        color: "#01579b",
        fontWeight: "500"
    },
    text: {
        color: 'black',
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    bottomDivider: {
        width: '100%',
        height: 10,
        backgroundColor: '#e0e0e0'
      },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        justifyContent: 'space-between'
    }
})