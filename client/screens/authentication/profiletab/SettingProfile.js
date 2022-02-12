import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Touchable, TouchableOpacity} from 'react-native';
import{ GlobalContext } from '../../../utility/context';

export default function SettingProfile(props) {
    const { globalFunction, globalState } = React.useContext(GlobalContext);
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.group}>
                <Text style={styles.smallText}>Cá nhân</Text>

                <TouchableOpacity onPress={() => props.navigation.navigate('Thông tin', {userId: globalState.user._id})}>
                    <Text style={styles.text}>Thông tin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Chọn ảnh', 
                {mode: 'change avatar', limit: 1})}>
                <Text style={styles.text}>Đổi ảnh đại diện</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Chọn ảnh', 
                {mode: 'change cover_image', limit: 1})}>
                <Text style={styles.text}>Đổi ảnh bìa</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.bottomDivider} />
            <View style={styles.group}>
                <Text style={styles.smallText}>Quyền riêng tư</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Bạn bè bị chặn')}>
                    <Text style={styles.text}>Danh sách bạn bè bị chặn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Bạn bè bị ẩn nhật ký')}>
                <Text style={styles.text}>Danh sách bạn bè bị ẩn nhật ký</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate('Bạn bè bị chặn tin nhắn')}>
                <Text style={styles.text}>Danh sách bạn bè bị chặn tin nhắn</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomDivider} />
            <View style={styles.group}>
                <Text style={styles.smallText}>Tài khoản và bảo mật</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Cập nhật mật khẩu')}>
                    <Text style={styles.text}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomDivider} />
            <View style={styles.group}>
                <Text style={[styles.text, {color: 'red', paddingTop: 0}]} onPress={globalFunction.signOut}>Đăng xuất</Text>
            </View>
        </View>
        
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
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    bottomDivider: {
        width: '100%',
        height: 10,
        backgroundColor: '#e0e0e0'
      },
})