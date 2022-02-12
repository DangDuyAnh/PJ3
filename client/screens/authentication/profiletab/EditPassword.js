import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet, TextInput, ImageBackground, Image, TouchableHighlight, TouchableOpacity, Touchable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Const from '../../../config/Constants';
import { GlobalContext } from '../../../utility/context';
import {httpStatus} from '../../../utility/httpStatus';

export default function EditPassword(props) {
    const {globalState} = React.useContext(GlobalContext);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [renewPass, setRenewPass] = useState('');
    const [secure1, setSecure1] = useState(true);
    const [secure2, setSecure2] = useState(true);
    const [secure3, setSecure3] = useState(true);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);

    const submit = async () => {
        try {

        if (newPass.length > 10 || newPass.length < 6) {
            setError2(true);
            return;
        }
        if (renewPass !== newPass) {
            setError3(true);
            return;
        }
        const response = await fetch(Const.API_URL + '/api/users/change-password', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
            body: JSON.stringify({
                currentPassword: currentPass,
                newPassword: newPass
            }),
          });
        const status = response.status.toString();
        if (status === httpStatus.BAD_REQUEST) {
            setError1(true);
            return
        } else {
            props.navigation.navigate('SettingProfile')
        }
        } catch(e) {
            console.log(e)
        }
    }

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Text style={{textAlign: 'center', width: '100%', backgroundColor: '#eeeeee', fontSize: 14,
        padding: 10, color: 'black'}}>
                Mật khẩu phải bao gồm từ 6 đến 10 kí tự</Text>

            <View style={{padding: 20, width: '100%'}}>
                <Text style={styles.smallText}>
                    Mật khẩu hiện tại
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput style={styles.firstText} placeholder='Nhập mật khẩu hiện tại'
                    value={currentPass} onChangeText={(val) => {
                        setError1(false);
                        setCurrentPass(val); 
                    }} secureTextEntry={secure1}/>
                    <TouchableOpacity onPress={() => {setSecure1(!secure1)}}>
                    <Ionicons name={secure1?"ios-eye-off":"ios-eye"} size={24} color="#757575" />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
                {error1&&<Text style={styles.warnText}>
                    Mật khẩu không đúng
                </Text>}

                <Text style={[styles.smallText, {marginTop: 20}]}>
                    Mật khẩu mới
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput style={styles.firstText} placeholder='Nhập mật khẩu mới'
                    value={newPass} onChangeText={(val) => {
                        setError2(false);
                        setNewPass(val)}}
                    secureTextEntry={secure2}/>
                    <TouchableOpacity onPress={() => {setSecure2(!secure2)}}>
                        <Ionicons name={secure2?"ios-eye-off":"ios-eye"} size={24} color="#757575" />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
                {error2&&<Text style={styles.warnText}>
                    Mật khẩu phải chứa từ 6 đến 10 kí tự
                </Text>}

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                    <TextInput style={styles.firstText} placeholder='Nhập lại mật khẩu mới'
                    value={renewPass} onChangeText={(val) => {
                        setError3(false);
                        setRenewPass(val);
                        }}
                    secureTextEntry={secure3}/>
                    <TouchableOpacity onPress={() => {setSecure3(!secure3)}}>
                        <Ionicons name={secure3?"ios-eye-off":"ios-eye"} size={24} color="#757575" />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}/>
                {error3&&<Text style={styles.warnText}>
                    Mật khẩu không trùng khớp
                </Text>}

                <View style={styles.buttonContainer}>
                <TouchableHighlight style={styles.button} onPress={() => submit()}>
                    <View style={styles.button}>
                    <Text style={styles.buttonTitle}>CẬP NHẬT</Text>
                    </View>
                </TouchableHighlight>
                </View>

            </View>
        </View>
    );
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
        flex: 1,
        padding: 0,
        margin: 0,
        marginRight: 8,
        marginTop: 10,
        marginBottom: 10
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
        marginTop: 40,
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
      smallText: {
        fontWeight: 16,
        color: "#01579b",
        fontWeight: "500"
    },
    warnText : {
        color: 'red',
        marginTop: 10,
        marginBottom: 5
    }
})