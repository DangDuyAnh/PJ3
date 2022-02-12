import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import {View, Text} from 'react-native';

import { GlobalContext } from './utility/context';
import WaitScreen from './screens/unauthenticattion/WaitScreen';
import LoginStack from './screens/unauthenticattion/LoginStack';
import MainStack from './screens/authentication/MainStack';
import ChatStack from './screens/authentication/ChatStack';
import { navigationRef } from './RootNavigation';
import axios from 'axios';
import * as Const from './config/Constants'
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './RootNavigation';
import NotificationController from './components/Notification'

function App() {
  const initialLoginState = {
    isLoading: true,
    userToken: null,
    user: null,
    postVideo: [],
    postImages: [],
    postDescription: null,
    oldImages: [],
    oldVideo: [],
    postId: null,
  };

  const globalReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          user: action.user,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          user: action.user,
        };
      case 'CHANGE_USER_INFO': {
        return {
          ...prevState,
          user: action.user
        }
      }
      case 'LOGOUT': 
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'UPDATE_POST_DESCRIPTION':
        return {
          ...prevState,
          postDescription: action.post
        }
      case 'UPDATE_POST_IMAGES':
        return {
          ...prevState,
          postImages: action.images
        }
      case 'UPDATE_POST_VIDEO':
        return {
          ...prevState,
          postVideo: action.video
        }
      case 'UPDATE_OLD_IMAGES':
        return {
          ...prevState,
          oldImages: action.oldimages
        }
      case 'UPDATE_OLD_VIDEO':
        return {
          ...prevState,
          oldVideo: action.oldvideo
        }
      case 'UPDATE_POST_ID':
        return {
          ...prevState,
          postId: action.postId
        }
      case 'UPDATE_COUNT_NOTI':
        return {
          ...prevState,
          countNoti: action.countNoti
        }
    }
  };
  const [globalState, dispatch] = React.useReducer(globalReducer, initialLoginState);

  const globalFunction = React.useMemo(
    () => ({
      updatePostDescription: (data) => {
        dispatch({ type: 'UPDATE_POST_DESCRIPTION', post: data });
      },
      updatePostImages: (data) => {
        dispatch({ type: 'UPDATE_POST_IMAGES', images: data });
      },
      updatePostVideo: (data) => {
        dispatch( {type: 'UPDATE_POST_VIDEO', video: data});
      },
      updateOldImages: (data) => {
        dispatch({ type: 'UPDATE_OLD_IMAGES', oldimages: data})
      },
      updatePostId: (data) => {
        dispatch({ type: 'UPDATE_POST_ID', postId: data})
      },
      updateOldVideo: (data) => {
        dispatch({ type: 'UPDATE_OLD_VIDEO', oldvideo: data})
      },
      updateCountNoti: (data) => {
        dispatch({ type: 'UPDATE_COUNT_NOTI', countNoti: data})
      },
      signIn: async (data) => {
        try {
          await SecureStore.setItemAsync('userToken', data.token);
          await SecureStore.setItemAsync('user', JSON.stringify(data.user));
          await sendFcmToken(data.token);
        } catch(e) {
          console.log(e);
        }
        dispatch({ type: 'LOGIN', token: data.token, user: data.user });
      },
      changeUserInfo: async (data) => {
        try {
          await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'CHANGE_USER_INFO', user: data.user});
      },
      signOut: async() => {
        try {
          let userToken = await SecureStore.getItemAsync('userToken');
          await SecureStore.deleteItemAsync('user');
          await SecureStore.deleteItemAsync('userToken');
          await destroyFcmToken(userToken);
        } catch(e) {
          console.log(e);
        }
        dispatch({ type: 'LOGOUT' });
      },
    }),
    []
  );

  React.useEffect(() => {
    setTimeout(async() => {
    // const bootstrapAsync = async () => {
      let userToken;
      let user;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
        user = await SecureStore.getItemAsync('user');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, user: JSON.parse(user) });

      messaging().onNotificationOpenedApp(remoteMessage => {
        // console.log(
        //   'Notification caused app to open from background state:',
        //   remoteMessage.data.custom,
        // );
        if (remoteMessage.data.type === 'post') {
          RootNavigation.navigate('Bài viết', remoteMessage.data.postId);
        }
      });
  
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'notification 2'
          // );
          if (remoteMessage.data.type === 'post') {
            RootNavigation.navigate('Bài viết', remoteMessage.data.postId);
          }
        }
      });
    // bootstrapAsync();
    }, 1000);
  }, []);

  const sendFcmToken = async (userToken) => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();

      const response = await fetch(Const.API_URL+'/api/notifications/register-token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          token: token,
        })
      });
      const json = await response.json();
    } catch (err) {
      console.log(err.response.data);
      return;
    }
  };

  const destroyFcmToken = async (userToken) => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      const response = await fetch(Const.API_URL+'/api/notifications/destroy-token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          token: token,
        })
      });
      const json = await response.json();
    } catch (err) {
      console.log(err.response.data);
      return;
    }
  };


  if( globalState.isLoading ) {
    return(
      <WaitScreen />
    );
  }

  return (
    <GlobalContext.Provider value={{globalState: globalState, globalFunction}}>
      <NavigationContainer ref={navigationRef}>
      { globalState.userToken !== null ? 
      <>
      <MainStack />
      <NotificationController />
      </>
      // <MainStack /> && <ChatStack />
      : <LoginStack /> }
      </NavigationContainer>
    </GlobalContext.Provider>
  )
}

export default App;
