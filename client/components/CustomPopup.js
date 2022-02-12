import React, { Component } from 'react';
import {Modal, View, Text} from 'react-native';

export default class CustomPopup extends Component {
    static defaultProps = {
        animationType: 'fade',
        firstLine: 'Không có kết nối',
        secondLine: 'Vui lòng thử lại sau'
    }

    render() {
        const { animationType, firstLine, secondLine, show } = this.props;

        return(
            <Modal
            animationType={animationType}
            transparent={true}
            visible={show}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{padding: 10, backgroundColor: '#000000bb', alignItems: 'center', borderRadius: 12}}>
                        <Text style={{fontSize: 16, color: 'white'}}>{firstLine}</Text>
                        <Text style={{fontSize: 16, color: 'white'}}>{secondLine}</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}