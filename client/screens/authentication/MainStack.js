import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Camera from './diarytab/Camera';
import MainTab from './MainTab';
import {Post, PostButton} from './diarytab/Post';
import {EditPost, EditPostButton} from './diarytab/EditPost';
import ImagePicker from './diarytab/ImagePicker';
import VideoPicker from './diarytab/VideoPicker';
import Preview from './diarytab/Preview';
import VideoCamera from './diarytab/VideoCamera';
import PreviewVideo from './diarytab/PreviewVideo';
import Notification from './diarytab/Notification';
import SinglePost from './diarytab/SinglePost';
import Conversation, {HeaderConversation} from './chattab/Conversation';
import ChatSetting from './chattab/ChatSetting'
import * as Const from '../../config/Constants';
import SettingProfile from './profiletab/SettingProfile';
import { GlobalContext } from '../../utility/context';
import ProfileTab from './profiletab/ProfileTab';
import Information from './profiletab/Information';
import EditProfile from './profiletab/EditProfile';
import EditPassword from './profiletab/EditPassword';
import BlockList from './profiletab/BlockList';
import BlockList2 from './profiletab/BlockList2';
import BlockList3 from './profiletab/BlockList3';
import FriendProfile, {HeaderFriendProfile} from './profiletab/FriendProfile';
import FriendSetting from './profiletab/FriendSetting';
import DiaryTab2 from './diarytab/DiaryTab2';
const Stack = createNativeStackNavigator();

export default function MainStack(){
    const { globalState } = React.useContext(GlobalContext);
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Main tab" component={MainTab}/>
            <Stack.Screen name="Post" component={Post} 
            options = {{
                title: 'Tạo bài viết',
                headerRight: () => (
                    <PostButton />
                  ),
            }} />
            <Stack.Screen name="EditPost" component={EditPost} 
            options = {{
                title: 'Sửa bài viết',
                headerRight: () => (
                    <EditPostButton />
                  ),
            }} />
            <Stack.Screen name='Chọn ảnh' component={ImagePicker} />
            <Stack.Screen name='Chọn video' component={VideoPicker} />
            <Stack.Screen options={{headerShown: false}} name='Camera' component={Camera} />
            <Stack.Screen options={{headerShown: false}} name='Preview' component={Preview} />
            <Stack.Screen options={{headerShown: false}} name= 'VideoCamera' component={VideoCamera} />
            <Stack.Screen options={{headerShown: false}} name= 'PreviewVideo' component={PreviewVideo} />
            <Stack.Screen name='Thông báo' component={Notification}/>
            <Stack.Screen name='Bài viết' component={SinglePost} />
            <Stack.Screen name='Tùy chọn'component={ChatSetting} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='SettingProfile'component={SettingProfile} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
                title: globalState.user.username,
            })}/>
            <Stack.Screen name='FriendSetting'component={FriendSetting} 
            options={({route}) => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
                title: route.params.username,
            })}/>
            <Stack.Screen name='SearchPost'component={DiaryTab2} 
            options={({route}) => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
                title: route.params.content,
            })}/>
            <Stack.Screen name='Chỉnh sửa thông tin'component={EditProfile} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='Cập nhật mật khẩu'component={EditPassword} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='Bạn bè bị chặn'component={BlockList} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='Bạn bè bị ẩn nhật ký'component={BlockList2} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='Bạn bè bị chặn tin nhắn'component={BlockList3} 
            options={() => ({
                headerStyle: {
                    backgroundColor: Const.COLOR_THEME,
                },
                headerTintColor: '#fff',
            })}/>
            <Stack.Screen name='Thông tin'component={Information} 
            options={() => ({
                headerShown: false
            })}/>
            <Stack.Screen name="Conversation" component={Conversation}
                options={({route}) => ({
                    headerTitle: ()=>{return (<HeaderConversation chatName={route.params.chatName} 
                        userReceiverId = {route.params.userReceiverId}
                        chatId = {route.params.chatId}
                        userId = {route.params.userId}/>)}, 
                    headerBackVisible: false,
                    headerStyle: {
                        backgroundColor: Const.COLOR_THEME,
                      }
                })}
            />
            <Stack.Screen name="FriendProfile" component={FriendProfile}
                options={({route}) => ({
                    headerTitle: ()=>{return (<HeaderFriendProfile username={route.params.username} 
                        avatar = {route.params.avatar}
                        userId = {route.params.userId}/>)}, 
                    headerBackVisible: false,
                    headerStyle: {
                        backgroundColor: 'white',
                      }
                })}
            />
        </Stack.Navigator>
    );
}
