import * as React from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, StatusBar, Touchable, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import socketIOClient from "socket.io-client";

import ChatTab from './chattab/ChatTab';
import Conversation from './chattab/Conversation';
import DiaryTab from './diarytab/DiaryTab';
import ProfileTab from './profiletab/ProfileTab';
import {Contact} from './contacttab/Contact';
import * as Const from '../../config/Constants';
import * as RootNavigation from '../../RootNavigation';
import { GlobalContext} from '../../utility/context';
import { setTextRange } from 'typescript';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
  },
  headerWrapper: {
    flexDirection: 'row', 
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
  },
  input: {
    height: 50,
    width: '70%',
    fontSize: 20,
    color: 'white',
    //borderWidth: 1,
    //borderColor: 'red'
  }
});

function Header(props) {
  const change = props.onChangeText;
  const [text, onChangeText] = React.useState(props.searchText);
  const { globalState, globalFunction } = React.useContext(GlobalContext);

  React.useEffect(() => {
    try {
      let io = socketIOClient(Const.API_URL);
      io.emit('notification', globalState.user._id);
      io.on("notification", () => {
        getData();
      });
      const getData = async () => {
      const response = await fetch(Const.API_URL+'/api/notifications/list', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalState.userToken}`,
        },
      });
      const json = await response.json();
      let notiCount = json.data.filter(noti => noti.status === 0).length
      globalFunction.updateCountNoti(notiCount);
      setNotiCount(notiCount)
      };
      getData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return(
    <View style={styles.headerContainer}>
      <View style={styles.headerWrapper}>
        <Ionicons style={{...styles.headerChild, paddingRight: 10}} name="search-outline" size={26} color="white" />
      </View>
      <TextInput
            style={styles.input}
            onChangeText={(e)=>{onChangeText(e); }}
            value={text}
            placeholder="Tìm bạn bè, bài viết..."
            placeholderTextColor='white'
            clearTextOnFocus={true}
            /* selectionColor={'white'} */
            underlineColorAndroid={'transparent'}
            onSubmitEditing={() => {
              if (text && text!=='') {
                RootNavigation.navigate('SearchPost', {content: text})
              }
              onChangeText(null);
            }}
          />
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={{paddingRight: 10}} onPress = {() => {
          RootNavigation.navigate('Post')}}>
          <MaterialIcons name="post-add" size={26} color="white"  />
        </TouchableOpacity>
        <TouchableOpacity style={{position: 'relative'}} onPress={() => {
          RootNavigation.navigate('Thông báo')
        }}>
          {(globalState.countNoti === undefined || globalState.countNoti === null || globalState.countNoti === 0)?null
          :<View style={{position: 'absolute', zIndex:3, left: '50%', top: '-30%', backgroundColor: 'red'
          , justifyContent: 'center', alignItems: 'center', borderRadius: 30}}>
            <Text style={{color: 'white', fontSize: 12, paddingLeft: 5, paddingRight: 5,
             paddingBottom: 1, paddingTop: 1, }}>{globalState.countNoti}</Text>
          </View>}
          <Ionicons style={{marginRight: 5}} name="ios-notifications-outline" size={26} color="white"  />
        </TouchableOpacity> 
      </View>
    </View>
  )
}

function ProfileHeader(props) {
  const { globalState, globalFunction } = React.useContext(GlobalContext);
  return(
    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: Const.API_URL + globalState.user.avatar}} style = {{width: 40, height: 40, 
          borderRadius: 20, marginRight: 15, borderWidth: 1, borderColor: '#e0e0e0'}}/>
        <Text style={{fontSize: 24, fontWeight: '700', color: Const.COLOR_THEME}}>
          {globalState.user.username}
        </Text>
      </View>
      <TouchableOpacity onPress={() => RootNavigation.navigate('SettingProfile')}>
        <SimpleLineIcons name="menu" size={24} color={Const.COLOR_THEME} />
      </TouchableOpacity>
    </View>
  );
}

export default function MainTab() {

  const [searchText, setSearchText] = React.useState("");
  const [searchTextContact, setSearchTextContact] = React.useState("");
  //const [header, setHeader] = React.useState(<Header onChangeText={setChangeSearchText} searchText={searchText}/>);

  return (
    <>
      <StatusBar  backgroundColor={Const.COLOR_THEME}/>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'ChatTab') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'DiaryTab') {              
              iconName = focused ? 'clock-time-eight' : 'clock-time-eight-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Contact') {
              iconName = focused ? 'contacts' : 'contacts-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            }
          },

          tabBarActiveTintColor: Const.COLOR_THEME,
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="ChatTab" component={ChatTab} 
          options={{ 
            headerTitle: ()=>{return (<Header onChangeText={setSearchText} searchText={searchText}/>)}, 
            headerStyle: {
              backgroundColor: Const.COLOR_THEME,
            }
          }}
        />
        <Tab.Screen name="Contact" 
          component={Contact}
          options={{ 
            headerShown:false
          }}
        />
        <Tab.Screen name="DiaryTab" component={DiaryTab} 
          options={{ 
            headerTitle: ()=>{return (<Header onChangeText={setSearchText} searchText={searchText}/>)}, 
            headerStyle: {
              backgroundColor: Const.COLOR_THEME,
            }
          }}
          />
        <Tab.Screen name="ProfileTab" component={ProfileTab}
          options={{ 
            headerTitle: ()=>{return (<ProfileHeader/>)}, 
            headerStyle: {
              backgroundColor: 'white',
            }
          }}
        />
      </Tab.Navigator>
    </>
  );
}
