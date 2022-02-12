import React, { Component } from 'react';
import {Modal, View, StyleSheet,TouchableOpacity, TouchableHighlight, Text} from 'react-native';
import { Octicons, Ionicons, MaterialIcons  } from '@expo/vector-icons';

export default class BottomPopupOther extends Component {

    static defaultProps = {
        animationType: 'fade',
        haveOutsideTouch: true,
        data: []
      }

    render() {
    const { show, animationType, closePopup, haveOutsideTouch, data, report, blockDiary, hideDiary } = this.props;

    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={show}
        >
            <View style={{ flex: 1, backgroundColor: '#00000077' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        if (!haveOutsideTouch) return;
                        closePopup()
                    }}
                    style={{flex: 1}}
                />

                <View style={{
                    bottom: 0,
                    position: 'absolute',
                    width: '100%',
                    backgroundColor: 'white',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    paddingBottom: 5,
                    paddingTop: 5,
                }}>
                    <TouchableHighlight style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
                    onPress = {hideDiary}> 
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                        <Ionicons name="ios-notifications-off-outline" style={styles.icon} size={26} color="black" />
                            <View style={{flex: 1}}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.firstText}>Ẩn nhật ký của {data.author.username}</Text>
                                    <Text style={styles.secondText}>Toàn bộ bài đăng và khoảnh khắc của người này sẽ bị ẩn đi</Text>
                                </View>
                                <View style={styles.divider}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
                    onPress = {blockDiary}> 
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                        <MaterialIcons name="block" style={styles.icon} size={26} color="black" />
                            <View style={{flex: 1}}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.firstText}>Chặn {data.author.username} xem nhật ký của tôi</Text>
                                    <Text style={styles.secondText}>Người này sẽ không thể thấy toàn bộ bài đăng và khoảnh khắc của bạn</Text>
                                </View>
                                <View style={styles.divider}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
                    onPress = {report}> 
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                        <Octicons name="report" style={styles.icon} size={26} color="black" />
                            <View style={{flex: 1}}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.firstText}>Báo xấu</Text>
                                    {/* <Text style={styles.secondText}> Xóa bài đăng này của bạn</Text> */}
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>

                </View>
            </View>
        </Modal>
    )
    }
}

const styles = StyleSheet.create({
    icon: {
        padding: 17,
    },
    firstText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5, 
    },
    secondText: {
        fontSize: 14,
        paddingRight: 12,
    },
    textWrapper: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    divider: {
        width: '95%',
        height: 1,
        backgroundColor: '#bdbdbd',
        marginBottom: 1
    },

})