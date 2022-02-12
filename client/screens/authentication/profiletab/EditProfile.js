import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ImageBackground, Image, TouchableHighlight, TouchableOpacity, Touchable} from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import{ GlobalContext } from '../../../utility/context';
import * as Const from '../../../config/Constants';
import BirthdayPicker from '../../../components/BirthdayPicker';

export default function EditProfile(props){
    const { globalFunction, globalState } = React.useContext(GlobalContext);
    const [showPopup, setShowPopup] = useState(false);
    const [user, setUser] = useState(globalState.user);
    const [date, setDate] = useState(new Date(globalState.user.birthday));
    const [targetDate, setTargetDate] = useState(new Date(globalState.user.birthday));

    const onChangeDate = (val) => {
        setDate(val);
    }

    const closePopup = () => {
        setShowPopup(false);
    }

    const OK = () => {
        setTargetDate(date);
        setUser({...user, birthday: date})
        setShowPopup(false);
    }

    const FormatTime = ({time}) => {
        let showTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`

        return (
            <Text style={styles.firstText} onPress={() => {setShowPopup(true)}}>{showTime}</Text>
          );
    }

    const update = async () => {
        try {
            const response = await fetch(Const.API_URL+'/api/users/edit', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${globalState.userToken}`,
                },
                body: JSON.stringify(user)
              });
              const json = await response.json();
              console.log(json.data)
              globalFunction.changeUserInfo({user: json.data});
              props.navigation.navigate('Main tab');
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1, fustifyContent: 'center', backgroundColor: 'white'}} >
            <View style={{flexDirection: 'row', backgroundColor: 'white', paddingBottom: 10}}>
                <View style={{position: 'relative'}}>
                    <Image source={{uri: Const.API_URL+ globalState.user.avatar}} style={styles.image} resizeMode="cover"/>
                    <TouchableOpacity style={styles.camera} onPress={() => props.navigation.navigate('Chọn ảnh', 
                        {mode: 'change avatar', limit: 1})}>
                        <FontAwesome name="camera" size={14} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, marginTop: 10, marginRight: 15}}>
                    <View style={styles.textContainer}>
                        <TextInput style={styles.firstText} placeholder='Nhập họ tên' 
                        value = {user.username} onChangeText = {(val) => setUser({...user, username: val})}/>
                        <FontAwesome name="pencil" size={18} color="#9e9e9e" />
                    </View>
                    <View style={styles.divider}/>

                    <View style={[styles.textContainer, {justifyContent: 'space-between'}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity onPress = {() => {setUser({...user, gender: Const.GENDER_MALE})}}>
                                <MaterialIcons name={(user.gender===Const.GENDER_MALE)?"radio-button-checked":"radio-button-unchecked"}
                                 size={28} color={(user.gender===Const.GENDER_MALE)?"#2740C9":"black"} />
                            </TouchableOpacity>
                            <Text style={{color: 'black', fontSize: 16, marginLeft: 4}}>Nam</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity onPress = {() => {setUser({...user, gender: Const.GENDER_FEMALE})}}>
                                <MaterialIcons name={(user.gender===Const.GENDER_FEMALE)?"radio-button-checked":"radio-button-unchecked"}
                                size={28} color={(user.gender===Const.GENDER_FEMALE)?"#2740C9":"black"} />
                            </TouchableOpacity>
                            <Text style={{color: 'black', fontSize: 16, marginLeft: 4}}>Nữ</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity onPress = {() => {setUser({...user, gender: Const.GENDER_SECRET})}}>
                                <MaterialIcons name={(user.gender===Const.GENDER_SECRET)?"radio-button-checked":"radio-button-unchecked"}
                                size={28} color={(user.gender===Const.GENDER_SECRET)?"#2740C9":"black"} />
                            </TouchableOpacity>
                            <Text style={{color: 'black', fontSize: 16, marginLeft: 4}}>Tùy chỉnh</Text>
                        </View>
                    </View>
                    <View style={styles.divider}/>

                    <View style={styles.textContainer}>
                        {/* <Text style={styles.firstText} onPress={() => {setShowPopup(true)}}>1/9/2000</Text> */}
                        <FormatTime time = {targetDate}/>
                        <FontAwesome name="pencil" size={18} color="#9e9e9e" />
                    </View>
                </View>
            </View>

            <View style={styles.bottomDivider}/>

            <View style={styles.buttonContainer}>
                <TouchableHighlight style={styles.button} onPress={() => update()}>
                    <View style={styles.button}>
                    <Text style={styles.buttonTitle}>CẬP NHẬT</Text>
                    </View>
                </TouchableHighlight>
            </View>

            <BirthdayPicker 
                show = {showPopup}
                closePopup = {closePopup}
                animationType='fade'
                haveOutsideTouch={true}        
                date={targetDate} 
                setDate={onChangeDate}
                OK={OK}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    camera: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'black',
        top: 63,
        left: 58,
        backgroundColor: 'white',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginTop: 20,
        marginLeft: 15,
        marginRight: 20,
        borderColor: '#9e9e9e',
        borderWidth: 1

    },
    firstText: {
        fontSize: 16,
        color: 'black',
        flex: 1,
        padding: 0,
        margin: 0,
        marginRight: 8
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
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: 'center',
      },
      button: {
        width: 140,
        borderRadius: 20,
        marginHorizontal: 'auto',
        backgroundColor: Const.COLOR_THEME,
      },
      buttonTitle: {
        fontSize: 16,
        color: "white",
        padding: 10,
        fontWeight: "600",
        textAlign: 'center',
      },
      bottomDivider: {
        width: '100%',
        height: 10,
        backgroundColor: '#e0e0e0'
      },
})
