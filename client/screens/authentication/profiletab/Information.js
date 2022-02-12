import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, ImageBackground, Image, TouchableHighlight, TouchableOpacity, Touchable} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

import{ GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';

export default function Information(props){
    const { globalFunction, globalState } = React.useContext(GlobalContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const getData = async () => {
                const response = await fetch(Const.API_URL+'/api/users/show/' + props.route.params.userId, {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                });
                const json = await response.json();
                console.log(json);
                setUser(json.data)
                };
            getData();
        } catch (e) {
            console.log(e)
        }
    }, []);

    const FormatTime = ({data, style}) => {
        let time = new Date(data);
        let showTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`

        return (
            <Text style={style}>{showTime}</Text>
          );
    }

    return (
        <>{user&&
        <View style={{flex: 1, fustifyContent: 'center'}} >
            <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0.5)"/>
            <ImageBackground source={{uri: Const.API_URL+ user.cover_image}} style={styles.imageCover} resizeMode="cover">
                <View style={styles.innerDarker} />
                <TouchableOpacity style={{marginLeft: 15, marginTop: 50}} onPress={() => {props.navigation.goBack();}}>
                    <Feather name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{flexDirection: 'row', backgroundColor: 'white', paddingBottom: 10}}>
                <View style={{position: 'relative'}}>
                    <Image source={{uri: Const.API_URL+ user.avatar}} style={styles.image} resizeMode="cover"/>
                    {/* <TouchableOpacity style={styles.camera}>
                        <FontAwesome name="camera" size={14} color="black" />
                    </TouchableOpacity> */}
                </View>

                <View style={{flex: 1, marginTop: 7}}>
                    <View style={styles.textContainer}>
                        <Text style={styles.firstText}>Tên Dask</Text>
                        <Text style={styles.secondText}>{user.username}</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.firstText}>Giới tính</Text>
                        <Text style={styles.secondText}>{user.gender}</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.firstText}>Ngày sinh</Text>
                        <FormatTime style={styles.secondText} data={user.birthday} />
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.firstText}>Điện thoại</Text>
                        <Text style={styles.secondText}>{user.phonenumber}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                {(props.route.params.userId === globalState.user._id)?
                <TouchableHighlight style={styles.button} onPress={() => props.navigation.navigate('Chỉnh sửa thông tin')}>
                    <View style={styles.button}>
                    <Text style={styles.buttonTitle}>ĐỔI THÔNG TIN</Text>
                    </View>
                </TouchableHighlight>
                :
                <TouchableHighlight style={styles.button}>
                    <View style={styles.button}>
                    <Text style={styles.buttonTitle}>Nhắn tin</Text>
                    </View>
                </TouchableHighlight>
                }
            </View>
        </View>
        }</>
    )
}

const styles = StyleSheet.create({
    imageCover: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    camera: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'black',
        top: 70,
        left: 80,
        backgroundColor: 'white',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerDarker: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.1)',
        position: 'absolute'
    },
    image: {
        width: 74,
        height: 74,
        borderRadius: 37,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        borderColor: '#9e9e9e',
        borderWidth: 1

    },
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    firstText: {
        fontSize: 16,
        color: 'black',
        width: 100
    },
    secondText: {
        fontSize: 16,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#bdbdbd',
        marginBottom: 1
    },
    textContainer: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: 'center',
      },
      button: {
        width: 170,
        borderRadius: 20,
        marginHorizontal: 'auto',
        backgroundColor: Const.COLOR_THEME,
      },
      buttonTitle: {
        fontSize: 17,
        color: "white",
        padding: 10,
        fontWeight: "600",
        textAlign: 'center',
      },
})