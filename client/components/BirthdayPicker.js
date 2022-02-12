import React from 'react'
import {Modal, View, StyleSheet,TouchableOpacity, TouchableHighlight, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function BirthdayPicker(props) {
    const { show, title, animationType, closePopup, haveOutsideTouch, date, setDate, OK } = props;
    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={show}
        >
            <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        if (!haveOutsideTouch) return;
                        closePopup()
                    }}
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={{alignItems: 'center', backgroundColor: 'white'}}>
                        <Text style={{color: 'black', fontSize: 28, fontWeight: '400', marginTop: 20,
                    marginBottom: 20}}>Ngày sinh</Text>
                        <DatePicker style={{ marginTop:5 }} DatePicker date={date} onDateChange={(val) => setDate(val)}
                        locale='vi' mode="date" androidVariant = 'nativeAndroid' 
                        style={{padding: 0, margin: 0}}/>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 150
                    , marginTop: 20, marginBottom: 20}}>
                            <Text style={{color: 'black', fontSize: 20}} onPress={() => {closePopup()}}>Hủy</Text>
                            <Text style={{color: 'black', fontSize: 20}} onPress={() => {OK()}}>Đồng ý</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}