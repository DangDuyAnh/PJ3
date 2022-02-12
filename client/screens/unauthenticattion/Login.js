import * as React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableHighlight, Alert} from 'react-native';

import * as Const from '../../config/Constants';
import { GlobalContext } from '../../utility/context';

const Login = (props) => {

  // const { signIn } = React.useContext(AuthContext);
  const { globalFunction } = React.useContext(GlobalContext);
  const [dataUser, setDataUser] = React.useState({
    phone: '',
    password: ''
  });
  const [focusPhone, setFocusPhone] = React.useState(false);
  const [focusPassword, setFocusPassword] = React.useState(false);

  const register = () => props.navigation.navigate('Tạo tài khoản');

  const handlePhoneChange = (val) => {
    setDataUser({
        ...dataUser,
        phone: val,
    });
  };

  const handlePasswordChange = (val) => {
    setDataUser({
        ...dataUser,
        password: val,
    });
  };

  const handleLogin = async () => {
    if (dataUser.phone === ''){
      Alert.alert('Hãy điền đầy đủ thông tin!', 'Số điện thoại không nên để trống.', [{text: 'Okay'}]);
      return;
      }
    if (dataUser.password === ''){
      Alert.alert('Hãy điền đầy đủ thông tin!', 'Mật khẩu không nên để trống.', [{text: 'Okay'}]);
      return;
      }

    try {
      const response = await fetch(Const.API_URL+'/api/users/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phonenumber: dataUser.phone,
          password: dataUser.password,
        })
      });
      const json = await response.json();
      console.log(json)
      //if (typeof json.data === 'undefined')
      if (json.user === undefined) {
        Alert.alert('Tài khoản không tồn tại!', 'Số điện thoại hoặc mật khẩu không đúng.', [
          {text: 'Okay'}
        ]);
        return;
      } else {
        globalFunction.signIn({token:json.token, user:json.user});
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}> App </Text>
      <View style={{marginTop: 50}}>
          <TextInput style={[styles.textInput, focusPhone ? styles.textFocus : styles.textNotFocus]} 
          keyboardType="phone-pad" placeholder="Số điện thoại" onChangeText={(val) => handlePhoneChange(val)} 
          onFocus={() => {
            setFocusPhone(true);
            setFocusPassword(false);
          }}/>
          <TextInput style={[styles.textInput, focusPassword ? styles.textFocus : styles.textNotFocus]} 
          secureTextEntry={true} placeholder="Mật khẩu" onChangeText={(val) => handlePasswordChange(val)}
          onFocus={() => {
            setFocusPhone(false);
            setFocusPassword(true);
          }}/>
      </View>

      <View style={styles.buttonContainer}>
      <TouchableHighlight style={styles.button} onPress={handleLogin}>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>Đăng nhập</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={{...styles.button, marginTop: 200}} onPress={register}>
        <View style={{...styles.button, backgroundColor: "#42B72A"}}>
          <Text style={styles.buttonTitle}>Tạo tài khoản App mới</Text>
        </View>
      </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 25,
      justifyContent: 'center',
      backgroundColor: 'white'
    },
    title: {
      marginTop: 80,
      textAlign: 'center',
      fontFamily: 'cookieRegular',
      fontSize: 72,
      fontWeight: "normal",
      color: "black",
    },
    textInput: {
      paddingBottom: 8,
      fontSize: 24,
      margin: 6,
    },
    textFocus: {
      borderBottomWidth: 2,
      borderBottomColor: Const.COLOR_THEME,
    },
    textNotFocus: {
      borderBottomWidth: 1,
      borderBottomColor: "#8D8686",
    },
    buttonContainer: {
      marginTop: 40,
      justifyContent: "center",
      alignItems: 'center',
    },
    button: {
      width: 320,
      borderRadius: 7,
      marginHorizontal: 'auto',
      backgroundColor: Const.COLOR_THEME,
    },
    buttonTitle: {
      fontSize: 24,
      color: "white",
      padding: 10,
      fontWeight: "600",
      textAlign: 'center',
    },
  });
  
export default Login;