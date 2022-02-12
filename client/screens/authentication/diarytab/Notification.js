import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Touchable  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import socketIOClient from "socket.io-client";

import * as Const from '../../../config/Constants';
import { GlobalContext} from '../../../utility/context';
import {FormatTime} from '../../../utility/FormatTime'
import * as RootNavigation from '../../../RootNavigation';

export default function Notification (props) {
    const { globalState, globalFunction } = React.useContext(GlobalContext);
    const [notiList, setNotiList] = useState([]);
    const [finishGetData, setFinishGetData] = useState(false);

    useEffect(() => {
        try {
            let io = socketIOClient(Const.API_URL);
            io.emit('notification', globalState.user._id);
            io.on("notification", () => {
                getData();
              });
            const getData = async () => {  
            const response = await fetch(Const.API_URL+'/api/notifications/list', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
                });
                const json = await response.json();
                setNotiList(json.data);
                setFinishGetData(true);
            }
            const unsubscribe = props.navigation.addListener('focus', getData);
            return unsubscribe;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const _onPress = async (item) => {
        RootNavigation.navigate('Bài viết', item.postId);
        try {
            if (item.status === 0) {
            await fetch(Const.API_URL+'/api/notifications/change-status/' + item._id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
            });
            let response = await fetch(Const.API_URL+'/api/notifications/list', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
                });
                let json = await response.json();
                setNotiList(json.data);

            response = await fetch(Const.API_URL+'/api/notifications/list', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
                });
            json = await response.json();
            globalFunction.updateCountNoti(json.data.filter(noti => noti.status === 0).length);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = ({item, index}) => {
        return(
        <View>
            <TouchableOpacity onPress={() => {_onPress(item);}}>
                <View style={[styles.notiContainer, (item.status !== 0) && {backgroundColor: 'white'}]}>
                    <Image source={{uri: Const.API_URL + item.activeUserId.avatar}} style={styles.image}/>
                    <View style={{flexShrink: 1, paddingRight: 2, justifyContent:'center'}}>
                        <Text style={styles.text}>
                            <Text style={{fontWeight: 'bold'}}>{item.activeUserId.username} </Text>{item.description} 
                        </Text>
                        <View style={styles.time}>
                            <MaterialCommunityIcons name="clock" size={20} color="orange" style={{paddingRight: 3}} />
                            <FormatTime data = {item.createdAt}/>
                        </View>

                    </View>
                </View>

                <View style={styles.divider}/>
            </TouchableOpacity>
        </View>
        );
    }

    return(
        <View style={styles.container}>
            {!finishGetData?<ActivityIndicator size="large" style={{paddingTop: 30}}/>
            :
            <FlatList
                data={notiList}
                renderItem={renderItem}
            /> 
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    notiContainer: {
        flexDirection: 'row',
        flexShrink: 1,
        alignItems: 'center',
        backgroundColor: '#e0f7fa'
    },
    image: {
        width : 44,
        height: 44,
        borderRadius: 22,
        margin: 15,
    },
    text : {
        color: 'black',
        fontSize: 16,
        flexShrink: 1,
        flexDirection: 'row',
        margin: 0,
        paddingBottom: 3
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#e0e0e0'
    }
})
