import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image } from "react-native";

import * as Const from '../../config/Constants';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 25,
        alignItems: 'center',
        flex: 1
    },
    h1: {
        fontWeight: "600",
        fontSize: 20,
        textAlign: 'center',
        color: "black",
    },
    tinyLogo: {
        margin: 20,
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    h2: {
        marginTop: 10,
        fontWeight: "600",
        fontSize: 18,
        textAlign: 'center',
        color: "black",
    },
    h3: {
        marginTop: 10,
        fontWeight: "300",
        fontSize: 18,
        textAlign: 'center',
        color: "black",
    },
    h4: {
        marginTop: 40,
        fontWeight: "normal",
        fontSize: 18,
        textAlign: 'center',
        color: "black",
    },
    h5: {
        marginTop: 5,
        fontWeight: "normal",
        fontSize: 18,
        textAlign: 'center',
        color: Const.COLOR_THEME,
    },
    button: {
        marginHorizontal: 'auto',
        backgroundColor: Const.COLOR_THEME,
        width: 320,
        borderRadius: 7,
    },
    buttonTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
    padding: 10,
    },
})

export default function CheckPhone({ navigation, route }){

    const navigateRegister = () => {
        navigation.navigate('Số điện thoại')
    }

    const navigateLogin = () => {
        navigation.navigate('Đăng nhập')
    }

    return(
        <View style={styles.container}>
            <Text style={{...styles.h1, marginTop: 40}}>Đã tồn tại tài khoản với số điện thoại</Text>
            <Text style={{...styles.h1, marginTop: 5}}>{route.params.user.phonenumber}</Text>
            <Image
                style={styles.tinyLogo}
                source={{
                uri: 'https://dottorato.dimes.unical.it/wp-content/uploads/2015/09/Unknown.jpg',
                }}
            />
            <Text style={styles.h2}>{route.params.user.username}</Text>
            <Text style={styles.h3}>{route.params.user.phonenumber}</Text>
            <Text style={styles.h4}>Nếu <Text style={{ fontWeight: "600"}}>{route.params.user.username}</Text> là tài khoản của bạn</Text>
            <Text style={styles.h5}>Đăng nhập <Text style={{ textDecorationLine: 'underline' }} onPress={navigateLogin}>tại đây</Text> </Text>
            <TouchableHighlight style={{...styles.button, marginTop: 200}} onPress={navigateRegister}>
                <View style={styles.button}>
                    <Text style={styles.buttonTitle}>Dùng tài khoản khác</Text>
                </View>
            </TouchableHighlight>
        </View>
    )

}
