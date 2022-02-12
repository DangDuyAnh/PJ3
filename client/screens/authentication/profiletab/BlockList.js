import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator} from 'react-native';
import{ GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';

export default function BlockList(props) {
    const { globalFunction, globalState } = React.useContext(GlobalContext);
    const [finishGetData, setFinishGetData] = useState(false);
    const [listBlock, setListBlock] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
            const response = await fetch(Const.API_URL+'/api/users/showWithBlockFriend', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                }
                });
            const json = await response.json();
            console.log(json);
            setListBlock(json.data.blocked_diary);
            setFinishGetData(true);
        }
            catch (error) {
            console.error(error);
        }
        }
        getData();
        const unsubscribe = props.navigation.addListener('focus', getData);
        return unsubscribe;
    }, []);

    const deleteItem = async (item) => {
        try {
        let newList = listBlock.filter(val => val !== item)
        setListBlock([...newList]);
        await fetch(Const.API_URL+'/api/users/editBlock', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
              blockId: item._id,
              blockField: "blocked_diary"
            })
          });
        } catch (e) {
            console.log(e)
        }
    }

    const renderItem = ({item, index}) => {
        return(
        <View>
            <View style={styles.notiContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: Const.API_URL + item.avatar}} style={styles.image}/>
                    <View style={{flexShrink: 1, paddingRight: 2, justifyContent:'center'}}>
                        <Text style={styles.text}>
                            {item.username} 
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => deleteItem(item)}>
                    <Text style={styles.buttonTitle}>Xóa</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider}/>
        </View>
        );
    }

    return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
         <Text style={{textAlign: 'center', width: '100%', backgroundColor: '#eeeeee', fontSize: 14,
        padding: 10, color: 'black'}}>
            Những người trong danh sách này sẽ không thể xem nhật ký của bạn</Text>
        <View style={styles.container}>
            {finishGetData&&
            <FlatList
                data={listBlock}
                renderItem={renderItem}
            /> 
        }
        </View>
    </View>
    );
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
        backgroundColor: 'white',
        justifyContent: 'space-between'
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
    },
    button: {
        borderRadius: 20,
        marginHorizontal: 'auto',
        backgroundColor: '#e1f5fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
      },
      buttonTitle: {
        fontSize: 14,
        color: "#01579b",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 10,
        fontWeight: "600",
        textAlign: 'center',
      },
})
