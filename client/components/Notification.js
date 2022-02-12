import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import * as RootNavigation from '../RootNavigation';

const NotificationController = (props) => {
  PushNotification.configure({
    onNotification: function(notification) {
      if (notification.data.type === 'post') {
        RootNavigation.navigate('Bài viết', notification.data.postId);
      }
    }
   }); 
  useEffect(() => {

    PushNotification.createChannel(
        {
          channelId: "default-channel-id", // (required)
          channelName: `Default channel`, // (required)
          channelDescription: "A default channel", // (optional) default: undefined.
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
//        (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data.type === 'post') {
        PushNotification.localNotification({
          channelId: "default-channel-id",
          message: remoteMessage.notification.body,
          data: remoteMessage.data,
          title: remoteMessage.notification.title,
          bigPictureUrl: remoteMessage.notification.android.imageUrl,
          smallIcon: remoteMessage.notification.android.imageUrl,
        });
    }
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;