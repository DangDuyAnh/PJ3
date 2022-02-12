import React, { Component } from 'react';
import {Modal, View, StyleSheet,TouchableOpacity, TouchableHighlight, Text} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

import * as Const from '../config/Constants'
import { GlobalContext } from '../utility/context';
import {httpStatus} from '../utility/httpStatus';
import * as RootNavigation from '../RootNavigation';
export default class BottomPopupSelf extends Component {

    static contextType = GlobalContext
    constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.state = {
            globalState: this.context,
            globalFunction: null,
        }
    }

    static defaultProps = {
        animationType: 'fade',
        haveOutsideTouch: true,
      }

    componentDidMount() {
        const {globalState, globalFunction} = this.context;
        this.setState({globalState: globalState, globalFunction: globalFunction})
    }

    handleDelete = async () => {
        try {
            const response = await fetch(Const.API_URL + '/api/posts/delete/' + this.props.data._id, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.globalState.userToken}`,
              },
            });
            const status = response.status.toString();
            if (status === httpStatus.OK) {
                console.log("Delete successfully");
                this.props.deletePost(this.props.data);
            }
            else if (status === httpStatus.NOT_FOUND) console.log("Can not find post");
            else console.log("ERROR");
            
          } catch (error) {
            console.error(error);
          }
    }

    handleEdit = () => {
        this.props.editPost();
        this.state.globalFunction.updateOldImages(this.props.data.images);
        this.state.globalFunction.updateOldVideo(this.props.data.videos);
        this.state.globalFunction.updatePostId(this.props.data._id);
        RootNavigation.navigate('EditPost',{post: this.props.data});
    }
    render() {
    const { show, title, animationType, closePopup, haveOutsideTouch } = this.props;

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
                    onPress = {this.handleEdit}> 
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                            <EvilIcons style={styles.icon} name="pencil" size={35} color="black" />
                            <View style={{flex: 1}}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.firstText}>Chỉnh sửa bài đăng</Text>
                                    <Text style={styles.secondText}>Chỉnh sửa nội dung, ảnh và video</Text>
                                </View>
                                <View style={styles.divider}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
                    onPress = {this.handleDelete}> 
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                            <EvilIcons style={styles.icon} name="trash" size={35} color="black" />
                            <View style={{flex: 1}}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.firstText}>Xóa bài đăng</Text>
                                    <Text style={styles.secondText}>Xóa bài đăng này của bạn</Text>
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
        padding: 12,
    },
    firstText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5, 
    },
    secondText: {
        fontSize: 14
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