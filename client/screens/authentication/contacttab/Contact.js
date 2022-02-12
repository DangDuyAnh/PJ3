import * as React from 'react';

import { Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';

import { FlatList, StyleSheet, View, Text, StatusBar, 
  Touchable, TouchableOpacity, TextInput, Image, useWindowDimensions, Button, ScrollView,
  RefreshControl, ActivityIndicator, Alert } from 'react-native';

import { authPost } from '../../../api/api'

import { LogBox } from 'react-native';

import * as Const from '../../../config/Constants';
import { GlobalContext } from '../../../utility/context';

import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import * as RootNavigation from '../../../RootNavigation';


//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

console.warn = () => {};

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 5,
   backgroundColor: 'white'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  toolBar: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  input: {
    paddingLeft: 10,
    padding:0,
    margin: 0,
    fontSize: 18,
    color: '#9e9e9e',
    fontWeight: '500',
  },
  
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0'
  },
  menu: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  menuText: {
    paddingLeft: 10,
    fontWeight: '500',
    fontSize: 15,
  },
  separator: {
    width: '100%',
    height: 10,
    backgroundColor: '#f2f2f2'
  },
  bottomDivider: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0'
  },
  feedContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
  },  
  imageFeed: {
    width: 60,
    height: 60,
    borderRadius: 25
  },
  headerInner: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 15,
  },
  feedAuthor: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    paddingLeft: 20,
    color: 'black',
  },
  phoneNumber: {
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 20,
    color: 'black',
  },
  feedDescribed: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 16,
    fontSize: 16,
    color: 'black'
  },
  feedDivide: {flex: 1, backgroundColor: '#e0e0e0', height: 1, marginLeft: 16, marginRight: 16},
  twoIcons: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  oneIcon: {
    flexDirection: 'row',
    paddingRight: 30,
    alignItems: 'center',
  },
  textIcon: {
    fontSize: 18,
    color: 'black',
    paddingLeft: 10,
  },
  imageContainer: {
    padding: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  elm: {
    marginTop: -20
  },

  headerContainer: {
    paddingTop: 2.9,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
    backgroundColor: 'rgb(0,162,209)'
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
  inputHeader: {
    height: 50,
    width: '75%',
    fontSize: 20,
    color: 'white',
    //borderWidth: 1,
    //borderColor: 'red'
  },

  activeTabTextColor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  tabTextColor: {
    fontSize: 16,
    color: 'gray'
  },

  listHeader: {
    backgroundColor: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 5,
    paddingLeft: 15,
  },

  scrollView :{
    flex: 1,
    backgroundColor: 'white'
  },

  actionButton: {
    marginLeft: -60,
    width: 110
  }

});

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const separator = (color) =>
  <View
    style={{
      borderBottomColor: color,
      borderBottomWidth: 1,
    }}
  />;

const tabHeaderColor = 'rgb(0,162,209)';

function Header(props) {
  const change = props.onChangeText;
  const [text, onChangeText] = React.useState(props.searchText);
  const keepBackArrow = props.keepBackArrow != undefined ? props.keepBackArrow : false;
  return(
    <View style={styles.headerContainer}>
      <View style={styles.headerWrapper}>
        {
          (text.length == 0 && keepBackArrow != true) ?
          <Ionicons style={{...styles.headerChild, paddingRight: 10}} name="search-outline" size={26} color="white" />
          :
          <Ionicons style={{...styles.headerChild, paddingRight: 10}} name="arrow-back-outline" size={26} color="white" 
            onPress={()=>{onChangeText(''); change('');}}
          />
        }
      </View>
      <TextInput
        style={styles.inputHeader}
        onChangeText={(e)=>{onChangeText(e);}}
        value={text}
        placeholder="Tìm bạn bè, ..."
        placeholderTextColor='white'
        clearTextOnFocus={true}
        underlineColorAndroid={'transparent'}
        onSubmitEditing ={(e)=>{change(text);}}
      />
      <View style={{...styles.headerWrapper}}>
        <TouchableOpacity style={{paddingRight: 10}} onPress = {() => {
          //console.log('Hi');
          RootNavigation.navigate('Post')}}>
          <MaterialIcons name="post-add" size={26} color="white"  />
        </TouchableOpacity>
        <Ionicons name="ios-notifications-outline" size={26} color="white"  />
      </View>
    </View>
  )
}

function ContactElement(props) {
  const ActionButton = props.button == undefined ? null : props.button;
  const { globalState } = React.useContext(GlobalContext);

  const onPressClick = async (userId, userName) => {
    try {
    console.log('done');
    const response = await fetch(Const.API_URL+'/api/chats/createChat', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1: globalState.user._id,
        user2: userId
      })
    });
    const json = await response.json();
    console.log(json)
    RootNavigation.navigate('Conversation', {
      chatName: userName,
      chatId: json.chat._id,
      userId: globalState.user._id,
      userReceiverId: userId
    });
    } catch (e) {
      console.log(e)
    }
  }

  return(
    <>
    <TouchableOpacity activeOpacity={1} onPress={() => {
      onPressClick(props.userId, props.name);
      // console.log('done')
    }}>
      <View style={styles.feedHeader}>
        <View style = {styles.headerInner}>
          <Image source={{uri: Const.API_URL + props.avtURL}} style = {styles.imageFeed} />
          <View style = {styles.headerText}>
            <Text style={styles.feedAuthor}>{props.name}</Text>
            <Text style={styles.phoneNumber}>{`Tel: ${props.phoneNumber}`}</Text>
          </View>
          <View style={{width: '23%'}}/>
          {ActionButton != null && <ActionButton userId={props.userId} listInfo={props.listInfo} searchedData={props.searchedData} />}
        </View>
      </View>
    </TouchableOpacity>
    {separator('rgb(245,245,245)')}
    </>
  )
}

function IsContainsId(list, id) {
  let has = false;
  list.every((element, index) => { 
    if(element._id == id) {
      has = true;
      return false;
    }
    return true;
  });
  return has;
}

function ListUsers(title, list, navigation, listInfo, button, searchedData) {
  return (
    <View style={styles.container}>
      {/* <FlatList
        style={styles.elm}
        data={list}
        renderItem={({item}) => 
          <ContactElement 
            userId={item.userId}
            name={item.userName} 
            avtURL={item.avtURL} 
            navigation={navigation} 
            phoneNumber={item.phoneNumber} 
            button={button}
          />}
        ListHeaderComponent={()=>
          <>
            <Text style={styles.listHeader}>{title}</Text>
            {separator(tabHeaderColor)}
          </>
        }
      /> */}
      <Text style={styles.listHeader}>{title}</Text>
      {separator(tabHeaderColor)}
      {list.map((item, i) => {
        return(
          <ContactElement 
            key={i}
            userId={item.userId}
            name={item.userName} 
            avtURL={item.avtURL} 
            navigation={navigation} 
            phoneNumber={item.phoneNumber} 
            listInfo={listInfo}
            button={button}
            searchedData={searchedData}
          />
        )
      })}
    </View>
  )
}

function CopyElm(id, from, to) {
  let id1 = -1;
  for (let index = 0; index < from.length; index++) {
    const element = from[index];
    if(element._id == id) {
      id1 = index;
      break;
    }
  }

  if(id1 == -1) return;

  let elm = from[id1];
  to.push(elm);

}

function ButtonSendFriendReq(props) {
  const { globalState } = React.useContext(GlobalContext);
  const token = globalState.userToken;

  const setSentList = props.listInfo.setSentList;
  const sentList = props.listInfo.sentList;

  const searchedData = props.searchedData;
  const refresh = props.listInfo.refresh;

  const onClick = () => {
    let body = {
      user_id: props.userId,
    }

    let res = authPost('/friends/set-request-friend', body, token);

    res.then((data) => {
      if (data.code == 200) {
        CopyElm(props.userId, searchedData, sentList);
        let t1 = [...sentList]; 
        setSentList(t1);
        if(refresh) refresh();
      }else{
      }
      //console.log(data)
    })
  }

  return (
    <View style={styles.actionButton}>
      <Button color={tabHeaderColor} title={"Kết bạn"} onPress={onClick} />
    </View> 
  )
}

function ButtonWaitting(props) {
  return (
    <View style={styles.actionButton}>
      <Button title={"Đợi phản hồi"} disabled={true}/>
    </View>
  )
}

function MoveElm(id, from, to) {
  let id1 = -1;
  for (let index = 0; index < from.length; index++) {
    const element = from[index];
    if(element._id == id) {
      id1 = index;
      break;
    }
  }

  if(id1 == -1) return;

  let elm = from[id1];
  to.push(elm);
  from.splice(id1, 1);

}

function ButtonAcceptReject(props) {

  const { globalState } = React.useContext(GlobalContext);
  const token = globalState.userToken;

  const [sent, setSent] = React.useState(false);
  const [accept, setAccept] = React.useState(false);

  const setFriendList = props.listInfo.setFriendList;
  const friendList = props.listInfo.friendList;

  const setRequestList = props.listInfo.setRequestList;
  const requestList = props.listInfo.requestList;

  const refresh = props.listInfo.refresh;

  const onClickAccept = () => {
    let body = {
      user_id: props.userId,
      is_accept: 1
    }

    let res = authPost('/friends/set-accept', body, token);

    res.then((data) => {
      if (data.code == 200) {
        MoveElm(props.userId, requestList, friendList);

        let t1 = [...friendList];
        let t2 = [...requestList];

        setFriendList(t1);
        setRequestList(t2);

        if(refresh) refresh();
      }else{
      }
    })
  }

  const onClickReject = () => {
    let body = {
      user_id: props.userId,
      is_accept: 2
    }

    let res = authPost('/friends/set-accept', body, token);

    res.then((data) => {
      if (data.code == 200) {
        MoveElm(props.userId, requestList, []);
        let t2 = [...requestList];
        setRequestList(t2);

        if(refresh) refresh();
      }else{
      }
    })
  }

  return (
    sent ?
    <View style={styles.actionButton}>
      <Button title={accept ? "Bạn bè" : "Đã từ chối"} color={accept ? 'green' : 'gray'} />
    </View>
    :
    <View style={styles.actionButton}>
      <Button color={tabHeaderColor} title={"Chấp nhận"} onPress={onClickAccept} />
      <View style={{height:5}}/>
      <Button color='red' title={"Từ chối"} onPress={onClickReject} />
    </View>
  )
}

const showConfirm = (title, msg, onCancel, onOk) =>
  Alert.alert(
    title,
    msg,
    [
      {
        text: "Cancel",
        onPress: () => onCancel(),
        style: "cancel"
      },
      { 
        text: "OK", 
        onPress: () => onOk() 
      }
    ]
  );

function ButtonRemoveFriend(props) {
  const { globalState } = React.useContext(GlobalContext);
  const token = globalState.userToken;

  const setFriendList = props.listInfo.setFriendList;
  const friendList = props.listInfo.friendList;

  const refresh = props.listInfo.refresh;

  const onClick = () => {

    let body = {
      user_id: props.userId,
    }
    console.log(body)

    let res = authPost('/friends/set-remove', body, token);

    res.then((data) => {
      //console.log(data)
      if (data.code == 200) {
        MoveElm(props.userId, friendList, []);
        let t1 = [...friendList];
        setFriendList(t1);

        if(refresh) refresh();
      }else{
      }
      //console.log(data)
    })
  }

  const onCancel = () => {};

  return (
    <View style={styles.actionButton}>
      <Button color={'red'} title={"Xóa bạn bè"} 
        onPress={() => showConfirm('Xóa bạn bè', 'Người bạn này sẽ không còn trong danh sách bạn bè của bạn nữa ?', onCancel, onClick)} />
    </View> 
  )
}


function Search(props) {
  const { globalState } = React.useContext(GlobalContext);
  const token = globalState.userToken;
  const userId = globalState.user._id;

  /* const friendList = props.friendList;
  const requestList = props.requestList;
  const sentList = props.sentList;
 */
  const searchText = props.input;

  const [friendUsers, setFriendUsers] = React.useState([]);
  
  const [unknownUsers, setUnknownUsers] = React.useState([]);

  const [requestUsers, setRequestUsers] = React.useState([]);

  const [sentUsers, setSentUsers] = React.useState([]);

  const [load, setLoading] = React.useState(true);

  const [searchedData, setSearchedData] = React.useState([]);

  const onChangeSearchText = (e) => {
    props.onChangeText(e);
    request(e);
  }

  const request = (key) => {
    let body = {
      keyword : key, //eg: 09866092
    }

    let res = authPost('/users/search', body, token);
    res.then((data)=>{
      //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++")
      const tempList = [];
      const reqUser = [];
      const seUser = [];

      const friendUsers = [];

      if(data.data.length != 0) setSearchedData(data.data);

      data.data.map((val, i)=>{
        if(userId == val._id) {
          return;
        }

        let temp = {
          userId: val._id,
          userName: val.username,
          avtURL: val.avatar,
          phoneNumber: val.phonenumber,
          gender: val.gender,
        };

        if(IsContainsId(props.friendList, val._id)) {
          friendUsers.push(temp);
          return;
        }

        if(IsContainsId(props.requestList, val._id)) {
          reqUser.push(temp);
          return;
        }

        if(IsContainsId(props.sentList, val._id)) {
          seUser.push(temp);
          return;
        }

        tempList.push(temp);
      })

      setUnknownUsers(tempList);
      setRequestUsers(reqUser);
      setSentUsers(seUser);

      setFriendUsers(friendUsers);

      setLoading(false);
      
    })
  }

  const localRefresh = () => {
    
    const tempList = [];
    const reqUser = [];
    const seUser = [];

    const friendUsers = [];

    searchedData.map((val, i)=>{
      if(userId == val._id) {
        return;
      }

      let temp = {
        userId: val._id,
        userName: val.username,
        avtURL: val.avatar,
        phoneNumber: val.phonenumber,
        gender: val.gender,
      };

      if(IsContainsId(props.friendList, val._id)) {
        friendUsers.push(temp);
        return;
      }

      if(IsContainsId(props.requestList, val._id)) {
        reqUser.push(temp);
        return;
      }

      if(IsContainsId(props.sentList, val._id)) {
        seUser.push(temp);
        return;
      }

      tempList.push(temp);
    })

    setUnknownUsers(tempList);
    setRequestUsers(reqUser);
    setSentUsers(seUser);

    setFriendUsers(friendUsers);

    setLoading(false);
  }

  const listInfo = props.listInfo;
  listInfo.refresh = () => { localRefresh();};

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    request(searchText);
    return () => { 
      isMounted = false; 
      setUnknownUsers([]);
      setRequestUsers([]);
      setSentUsers([]);
    };
  }, []);

  //https_url/search
  return(
    <>
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={()=>{setLoading(true); props.onRefresh(); request(searchText); }}
        />
      }
    >
    <Header onChangeText={onChangeSearchText} searchText={searchText} keepBackArrow={true} />
    
    {load && <ActivityIndicator style={{marginTop:50}} size="large" color="#0000ff" />}
    {!load && unknownUsers.length != 0 
      && ListUsers("Người lạ", unknownUsers, props.navigation, listInfo, ButtonSendFriendReq, searchedData)} 
    {!load && requestUsers.length != 0 
      && ListUsers("Yêu cầu kết bạn", requestUsers, props.navigation, props.listInfo, ButtonAcceptReject)}
    {!load && sentUsers.length != 0 
      && ListUsers("Đã gửi lời mời kết bạn", sentUsers, props.navigation, props.listInfo, ButtonWaitting)}
    {!load && friendUsers.length != 0 
      && ListUsers("Bạn bè", friendUsers, props.navigation, props.listInfo, ButtonRemoveFriend)}
    {!load && unknownUsers.length == 0 && requestUsers.length == 0 && sentUsers.length == 0 
      && ListUsers("Không có kết quả", [], props.navigation, props.listInfo)}
    </ScrollView>
    </>
  )
}

function FriendList(props) {
  const [friends, setFriends] = React.useState([]);
  const [waittings, setWaittings] = React.useState([]);

  const [load, setLoading] = React.useState(true);

  React.useEffect(() => {
    let tempList = [];
    props.friendList.map((val, i)=>{
      let temp = {
        userId: val._id,
        userName: val.username,
        avtURL: val.avatar,
        phoneNumber: val.phonenumber,
        gender: val.gender,
      };

      tempList.push(temp);
    })

    setFriends(tempList);

    tempList = [];
    props.sentList.map((val, i)=>{
      let temp = {
        userId: val._id,
        userName: val.username,
        avtURL: val.avatar,
        phoneNumber: val.phonenumber,
        gender: val.gender,
      };

      tempList.push(temp);
    })

    setWaittings(tempList);
    setLoading(false);

    return () => { 
      setFriends([])
      setWaittings([])
    };
  }, []);

  if (load) return(
    <ActivityIndicator style={{marginTop:50}} size="large" color="#0000ff" />
  )

  return (
    <>
      {friends.length != 0 
        && ListUsers("Đã là bạn bè", friends, props.navigation, props.listInfo, ButtonRemoveFriend)}
      {waittings.length != 0 
        && ListUsers("Đã gửi lời mời kết bạn", waittings, props.navigation, props.listInfo, ButtonWaitting)}
    </>
  )

}

function FriendReqList(props) {
  const [reqFriends, setReqFriends] = React.useState([]);

  const [load, setLoading] = React.useState(true);

  React.useEffect(() => {
    let tempList = [];
    props.requestList.map((val, i)=>{
      let temp = {
        userId: val._id,
        userName: val.username,
        avtURL: val.avatar,
        phoneNumber: val.phonenumber,
        gender: val.gender,
      };

      tempList.push(temp);
    })

    setReqFriends(tempList);

    setLoading(false);

    return () => { 
      setReqFriends([])
    };
  }, []);

  if (load) return(
    <ActivityIndicator style={{marginTop:50}} size="large" color="#0000ff" />
  )

  return (
    <>
      {reqFriends.length != 0 
        && ListUsers("Đang đợi bạn chấp nhận", reqFriends, props.navigation, props.listInfo, ButtonAcceptReject)}
    </>
  )
}

function MainContact(props) {

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Bạn bè' },
    { key: 'second', title: 'Lời mời kết bạn' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'rgb(0,162,209)'}}
      style={{ backgroundColor: 'white' }}
      renderLabel={({route, focused}) => {
        return (
          <View>
            <Text style={focused ? styles.activeTabTextColor : styles.tabTextColor}>
              {route.title}
            </Text>
            <View style={{height: 1}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {route.title}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );

  const FirstRoute = () => (
    <FriendList friendList={props.friendList} sentList={props.sentList} 
      navigation={props.navigation} listInfo={props.listInfo} />
  );
  
  const SecondRoute = () => (
    <FriendReqList requestList={props.requestList} navigation={props.navigation} 
      listInfo={props.listInfo} />
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <>
    <StatusBar  backgroundColor={Const.COLOR_THEME}/>
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
        />
      }
    >
    <Header onChangeText={props.onChangeText} searchText={props.searchText} />
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
    </ScrollView>
    </>
  );
}

function GetFriendList(oldSetter, waitSetter, token) {
  let res = authPost('/friends/list', {}, token);
  res.then((data)=>{
    
    // let temp = [];
    const _data = data.data;
    // _data.friends.map((v, i) => {
    //   temp.push(v);
    // })
    // oldSetter(temp);

    let temp = [];
    _data.waitting.map((v, i) => {
      temp.push(v);
    })
    waitSetter(temp);
    //console.log(temp);

  });
  let res2 = authPost('/friends/listFriend', {}, token);
  res2.then((data)=>{
    
    let temp = [];
    const _data = data.data;
    _data.friends.map((v, i) => {
      temp.push(v);
    })
    console.log(temp);
    oldSetter(temp);
  })
}

function GetRequestList(setter, userId, token) {
  let body = {
    userId: userId
  }
  let res = authPost('/friends/get-requested-friend', body, token);
  res.then((data)=>{
    //console.log(data.friends);
    let temp = [];
    const _data = data.data;
    _data.friends.map((v, i) => {
      temp.push(v);
    })
    setter(temp);
  })
}


function Contact(props) {
  const { globalState } = React.useContext(GlobalContext);
  const token = globalState.userToken;
  const userId = globalState.user._id;

  const [searchText, setSearchText] = React.useState("");

  const [friendList, setFriendList] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);
  const [sentList, setSentList] = React.useState([]);

  const [load, setLoading] = React.useState(0);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    GetFriendList(_setFriendList, _setSentList, token);
    GetRequestList(_setRequestList, userId, token);

    /* console.log(friendList)
    console.log(sentList)
    console.log(requestList) */

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const onChangeSearchText = (e) => {
    setSearchText(e);
  }

  const _setFriendList = (e) => {
    setFriendList(e);
    let temp = load + 1;
    setLoading(temp);
  }

  const _setSentList = (e) => {
    setSentList(e);
    let temp = load + 1;
    setLoading(temp);
  }

  const _setRequestList = (e) => {
    setRequestList(e);
    let temp = load + 1;
    setLoading(temp);
  }

  React.useEffect(() => {
    GetFriendList(_setFriendList, _setSentList, token);
    GetRequestList(_setRequestList, userId, token);

    return () => {
      setFriendList([])
      setRequestList([])
      setSentList([])
     };
  }, []);

  if (load < 1) return (
    <ActivityIndicator style={{marginTop:50}} size="large" color="#0000ff" />
  )

  const listInfo = {
    'setFriendList': setFriendList,
    'setRequestList': setRequestList,
    'setSentList': setSentList,

    'friendList': friendList,
    'requestList': requestList,
    'sentList': sentList,
  }

  return (
    searchText.length == 0 ?
    <MainContact onChangeText={onChangeSearchText} searchText={searchText} navigation={props.navigation} 
      friendList={friendList}
      requestList={requestList}
      sentList={sentList}
      refreshing={refreshing}
      onRefresh={onRefresh}
      listInfo={listInfo}
    />
    :
    <Search onChangeText={onChangeSearchText} input={searchText} navigation={props.navigation} 
      friendList={friendList}
      requestList={requestList}
      sentList={sentList}
      refreshing={refreshing}
      onRefresh={onRefresh}
      listInfo={listInfo}
    />
  )
}

export { Contact };
