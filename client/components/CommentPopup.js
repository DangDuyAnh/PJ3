import React, { useState, useEffect, useRef } from 'react';
import {Modal, ScrollView, View, StyleSheet,TouchableOpacity, Image, Text , StatusBar, FlatList
, ActivityIndicator, KeyboardAvoidingView, TextInput, Touchable} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import { GlobalContext } from '../utility/context';
import * as Const from '../config/Constants';

const SmallPopup = ({show, closePopup, deleteComment, updateComment}) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={show}
            >
            <View style={{flex: 1, backgroundColor: '#00000077'}}>
                <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            closePopup()
                        }}
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                    >
                    <View style={{backgroundColor: 'white'}}>
                        <TouchableOpacity onPress={updateComment}>
                        <Text style={{fontSize: 16, paddingTop: 17, paddingBottom: 12, paddingLeft: 20, paddingRight: 80, color: 'black'}}>
                            Chỉnh sửa bình luận</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={deleteComment}>
                        <Text style={{fontSize: 16, paddingTop: 12, paddingBottom: 22, paddingLeft: 20, paddingRight: 80, color: 'black'}}>
                        Xóa bình luận</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    )       
}

const UpdatePopUp = ({post, show, closePopup, updateData}) => {

    const [text, setText] = useState(post.content);

    const updatePost = async () => {
        await fetch(Const.API_URL+'/api/postComment/update/' + post._id, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: text
            })
        })
        updateData();
        closePopup();
    }
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={show}
        >
            {post&&
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <View style={{flex: 1, backgroundColor: 'white', borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, alignItems: 'center', position: 'relative'}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', position:'relative'}}>
                        <Text style={{fontWeight: '700', fontSize: 18, color: 'black', paddingTop: 15
                        , paddingBottom: 15}}>Chỉnh sửa bình luận</Text>
                        <TouchableOpacity onPress={() => {closePopup()}} style={{position: 'absolute'
                            , right: 10, alignSelf: 'center'}}> 
                            <Ionicons name="close-outline" size={26}/>
                        </TouchableOpacity>   
                    </View>
                    <View style={styles.divider}/>
                    <View style={{flexDirection: 'row', margin: 10}}>
                        <Image source={{uri: Const.API_URL + post.user.avatar}} style={styles.image}/>

                        <View style={{flex: 1}}>
                            <TouchableOpacity activeOpacity={1} style={styles.textContainer} onLongPress={() => {
                                setComment(item);
                                setIdx(index);
                                setShowSmallPop(true);
                                }}>
                                <Text style = {{fontSize: 18, color: 'black', fontWeight: '700'
                                , paddingBottom: 4}}>{post.user.username}</Text>
                                <TextInput style={{fontSize: 18, color: 'black', padding: 0, margin: 0}} value={text} autoFocus={true}
                                onChangeText={setText}
                                />
                            </TouchableOpacity>
                        </View> 
                    </View>

                    <View style={{flexDirection: 'row-reverse', width: '100%', paddingLeft: 10}}>
                        <TouchableOpacity style={{borderRadius: 5, backgroundColor: '#2962ff', justifyContent: 'center', alignItems: 'center', marginLeft: 20}}
                        onPress={updatePost}>
                        <Text style = {{paddingLeft: 15, paddingRight: 15, paddingBottom: 8, paddingTop: 8, fontSize: 16, color: 'white'}}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{borderRadius: 5, backgroundColor: '#eeeeee', justifyContent: 'center', alignItems: 'center'}}
                        onPress={closePopup}>
                        <Text style = {{paddingLeft: 15, paddingRight: 15, paddingBottom: 8, paddingTop: 8, fontSize: 16, color: 'black'}}>Hủy bỏ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            }
        </Modal>
    );
}
export default function CommentPopup(props){
    
    const { show, title, animationType, closePopup, haveOutsideTouch, data } = props;
    const [comments, setComments] = useState([]);
    const { globalState } = React.useContext(GlobalContext);
    const [finishGetData, setFinishGetData] = useState(false);
    const [text, setText] = useState('');
    const [isLike, setIsLike] = useState(data.isLike);
    const [countLikes, setCountLikes] = useState(data.countLikes);
    const [showSmallPop, setShowSmallPop] = useState(false);
    const [showUpdatePopUp, setShowUpdatePopup] = useState(false);
    const [idx, setIdx] = useState(null);
    const [text2, setText2] = useState('test');
    const [comment, setComment] = useState(null);

    const closeSmallPop = () => {
        setShowSmallPop(false)
    }

    const closeUpdatePopup = () => {
        setShowSmallPop(false);
        setShowUpdatePopup(false);
    }

    const deleteComment = async (index) => {
        let newData = comments;
        newData.splice(index, 1);
        setComments([...newData]);
        closeSmallPop();
        await fetch(Const.API_URL+'/api/postComment/delete/' + comment._id, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
        })
    }

    const updateComment= () => {
        setShowUpdatePopup(true);
    }

    const getData = async () => {  
        const response = await fetch(Const.API_URL+'/api/postComment/list/'+data._id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${globalState.userToken}`,
            },
            });
            const json = await response.json();
            setComments(json.data);
            setFinishGetData(true);
        }

    const heartPress = async () => {
        if (isLike) {
            setIsLike(false);
            setCountLikes(countLikes - 1);
        } else {
            setIsLike(true);
            setCountLikes(countLikes + 1);
        }
        const response = await fetch(Const.API_URL+'/api/postLike/action/' + data._id, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${globalState.userToken}`,
            },
        })
    }

    useEffect(() => {
        try {
            getData();
            setIsLike(data.isLike);
            setCountLikes(data.countLikes);
            return(() => {
                setComments([]);
                setFinishGetData(false);
            })
        } catch(e) {
            console.log(e)
        }
    }, [data._id]);

    const sendComment = async () => {
        try {
            const response = await fetch(Const.API_URL+'/api/postComment/create/'+data._id, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${globalState.userToken}`,
                },
                body: JSON.stringify({
                    content: text
                }),
                });
            setText('');
            getData();
            
            }
        catch(e) {
            console.log(e)
        }
    }

    const FormatTime = ({data, style}) => {
        let currentYear = new Date().getFullYear();
        let time = new Date(data);
        let showTime;
        let singleMinutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let minute = time.getMinutes().toString();
        if (singleMinutes.includes(minute)) minute = '0' + minute;
        if (currentYear === time.getFullYear()) {
          showTime = `${time.getDate()}/${time.getMonth()+1} lúc ${time.getHours()}:${minute}`
        } else {
          showTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} lúc ${time.getHours()}:${minute}`
        }
      
        return (
          <Text style={style}>{showTime}</Text>
        );
      }

    const renderItem = ({item, index}) => {
        return(
        <View style={{flexDirection: 'row', margin: 10}}>
            <Image source={{uri: Const.API_URL + item.user.avatar}} style={styles.image}/>

            <View style={{flex: 1}}>
                <TouchableOpacity activeOpacity={1} style={styles.textContainer} onLongPress={() => {
                    setComment(item);
                    setIdx(index);
                    setShowSmallPop(true);
                    }}>
                    <Text style = {{fontSize: 18, color: 'black', fontWeight: '700'
                    , paddingBottom: 4}}>{item.user.username}</Text>
                    <TextInput style={{fontSize: 18, color: 'black', padding: 0, margin: 0}} value={item.content} editable={false}
                    />
                </TouchableOpacity>
                <FormatTime data={item.createdAt} style={{paddingLeft: 10, fontSize: 16, fontWeight: '900'
            , paddingTop: 2}}/>
            </View> 
        </View>
        );
    }
    
    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={show}
        >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <SmallPopup show = {showSmallPop} closePopup={closeSmallPop} deleteComment={() => {deleteComment(idx)}} updateComment={updateComment}/>
            {comment&&<UpdatePopUp show = {showUpdatePopUp} closePopup={closeUpdatePopup} post={comment} updateData={getData}/>}
            <StatusBar translucent backgroundColor="rgba(0,0,0,0.7)"/>

                {finishGetData?
                <View style={{flex: 1, backgroundColor: 'white', borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, alignItems: 'center', position: 'relative'}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', position:'relative'}}>
                        <Text style={{fontWeight: '700', fontSize: 18, color: 'black', paddingTop: 15
                        , paddingBottom: 15}}>Bình luận</Text>
                        <TouchableOpacity onPress={() => {closePopup()}} style={{position: 'absolute'
                            , right: 10, alignSelf: 'center'}}> 
                            <Ionicons name="close-outline" size={26}/>
                        </TouchableOpacity>   
                    </View>

                    <View style={styles.divider}/>
                    <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                        <TouchableOpacity style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 15, paddingRight: 10}}
                        onPress = {() => heartPress()}>
                            <AntDesign name={isLike?"heart":"hearto"} size={24} color={isLike?"#f44336":'black'} />
                        </TouchableOpacity>
                        <Text style={{fontSize: 18, color: 'black'}}>{countLikes}</Text>
                    </View>
                    <View style={styles.divider}/>

                    <View style={{flex: 1, width: '100%'}}>
                        <FlatList
                            data={comments}
                            renderItem={renderItem}
                        /> 
                    </View>
                    <View style={{maxHeight: 160,borderTopColor:'#757575', borderTopWidth: 1 , width: '100%'
                , backgroundColor: 'white', paddingRight: 15, paddingLeft: 15, paddingBottom: 10, paddingTop: 10}}>
                        <ScrollView style={{flexGrow:0, width: '100%', backgroundColor: '#eeeeee', borderRadius: 20}}>
                            <TextInput value={text} placeholder='Viết bình luận...' multiline={true}
                            style={{width: '100%', fontSize: 20,}}
                            onChangeText = {(val) => setText(val)}
                            />
                        </ScrollView>

                        {(text !== '')&&
                        <View style={{width: '100%', flexDirection: 'row-reverse', paddingTop: 7}}>
                            <TouchableOpacity onPress={() => sendComment()}>
                                <Ionicons name="send" size={24} color={Const.COLOR_THEME} />
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                </View>
                :
                <View style={{flex: 1, backgroundColor: 'white', borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, alignItems: 'center', position: 'relative'}}>
                    <ActivityIndicator size="large" style={{paddingTop: 30}}/>
                </View>
                }
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#bdbdbd',
        marginBottom: 1
    },
    image: {
        width : 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    textContainer: {
        borderRadius: 8,
        backgroundColor: "#eeeeee",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 5
    }
})