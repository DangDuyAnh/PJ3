import * as React from 'react';
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput } from "react-native";
import DatePicker from 'react-native-date-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

import { GlobalContext } from '../../utility/context';
import * as Const from '../../config/Constants';

const styles = StyleSheet.create({
  backGround: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'black',
    textAlign: 'center',
  },
  buttonOut: {
    backgroundColor: 'white',
    position: 'absolute',
    marginTop: 500,
    marginHorizontal: 'auto',
    backgroundColor: Const.COLOR_THEME,
    width: 320,
    borderRadius: 7,
  },
  button: {
    marginHorizontal: 'auto',
    backgroundColor: Const.COLOR_THEME,
    width: 320,
    borderRadius: 7,
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
  textInput: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Const.COLOR_THEME,
    fontSize: 24,
    marginTop: 50,
    width: 350
  },
});


export const Register1 = ({ navigation }) => {

    const onPress1 = () => navigation.navigate('Số điện thoại');

    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Tham gia App</Text>
          <Text style={styles.description}>Chúng tôi sẽ giúp bạn tạo tài khoản mới sau vài bước dễ dàng</Text>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress1}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    );
  };

  export const Register2 = ({ navigation }) => {

    const textInputRef = React.useRef();
    const focusOnInput = e => {
      textInputRef.current.focus();
    };
    navigation.addListener("focus", focusOnInput);

    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [phoneStatus, setPhoneStatus] = React.useState('normal');

    const onPress2 = async () => {
      if (phoneNumber === "") {
        setPhoneStatus('null');
        return;
      };

      const reg = (/^[0-9\b]+$/);
      if(!reg.test(phoneNumber) || (phoneNumber.length < 9) || (phoneNumber.length > 11)){
         // Its not a number
         setPhoneStatus('not-phonenumber');
         return;
      };

      try {
        const response = await fetch(Const.API_URL+'/api/users/find-number', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phonenumber: phoneNumber,
          })
        });
        const json = await response.json();
        console.log(json)
        if ((json.data !== undefined) && (json.data !== null)) {
          navigation.navigate('Xác nhận tài khoản', {
            user: json.data
          });
          console.log(json.data)
          return;
        } else {
          navigation.navigate('Tên',
            {
              phonenumber: phoneNumber
            });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const changePhonenumber = (text) => {
      setPhoneNumber(text);
      setPhoneStatus('normal');
    }

    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Nhập số di động của bạn</Text>
          {(phoneStatus === 'null')&&
          <View style={{flexDirection:"row", alignItems: "center", width:350, justifyContent: "space-evenly"}}>
            <Text style={ {...styles.description, color: "red", width:330 }}>Hãy nhập số điện thoại của bạn</Text>
            <AntDesign style = {{bottom: 0, right: 0}} name="exclamationcircle" size={20} color="red" />
          </View>}
          {(phoneStatus === 'not-phonenumber')&&
          <View style={{flexDirection:"row", alignItems: "center", width:350, justifyContent: "space-evenly"}}>
            <Text style={ {...styles.description, color: "red", width:330 }}>Số điện thoại không hợp lệ</Text>
            <AntDesign style = {{bottom: 0, right: 0}} name="exclamationcircle" size={20} color="red" />
          </View>}
          {(phoneStatus === 'normal')&&
          <Text style={styles.description}>Nhập số điện thoại để mọi người có thể liên hệ với bạn</Text>}
          <TextInput ref={textInputRef} style={styles.textInput} keyboardType="phone-pad" 
          placeholder="Nhập số di động" value={phoneNumber} onChangeText={changePhonenumber}/>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress2}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    );
  };

  export const Register3 = ({ route, navigation }) => {

    const textInputRef = React.useRef();

    const focusOnInput = e => {
      textInputRef.current.focus();
    };
  
    navigation.addListener("focus", focusOnInput);

    const [name, setName] = React.useState("");
    const [isNameNull, setIsNameNull] = React.useState(false);
    const onPress3 = () => {
      if (name === "") {
        setIsNameNull(true);
        return;
      };

      navigation.navigate('Ngày sinh', {
      ...route.params,
      name: name,
      });
    }

    const changeName = (text) => {
      setName(text);
      setIsNameNull(false);
    }


    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Bạn tên gì?</Text>
          {isNameNull?
          <View style={{flexDirection:"row", alignItems: "center", width:350, justifyContent: "space-evenly"}}>
            <Text style={ {...styles.description, color: "red", width:330 }}>Hãy nhập tên của bạn</Text>
            <AntDesign style = {{bottom: 0, right: 0}} name="exclamationcircle" size={20} color="red" />
          </View>
          :<Text style={styles.description}>Nhập tên bạn sử dụng trong đời thực</Text>}
          <TextInput ref={textInputRef} style={styles.textInput} placeholder="Tên đầy đủ"
          value={name} onChangeText={changeName}/>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress3}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    )
  }

  export const Register4 = ({ route, navigation }) => {

    const [date, setDate] = React.useState(new Date());
    const onPress4 = () => navigation.navigate('Giới tính',
    {
      ...route.params,
      birthday: date.toString(),
    });

    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Sinh nhật của bạn khi nào?</Text>
          <Text style={styles.description}>Chọn ngày sinh của bạn</Text>
          <DatePicker style={{ marginTop:5 }} DatePicker date={date} onDateChange={setDate}
           locale='vi' mode="date" androidVariant = 'nativeAndroid' />
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress4}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    )
  }

  export const Register5 = ({ route, navigation }) => {

    const [gender, setGender] = React.useState(Const.GENDER_FEMALE);
    const onPress4 = () => navigation.navigate('Mật khẩu', 
    {
      ...route.params,
      gender: gender,
    });

    return (
      <View style={styles.backGround}>
      <View style={{...styles.container, marginTop: 50}}>
          <Text style={styles.title}>Giới tính của bạn là gì?</Text>
          <Text style={styles.description}>Chọn giới tính của bạn</Text>
      <View style={{ marginTop: 40}}>
        <View style={{ marginBottom: 25}}>
          <View style={{ flexDirection:"row", width: 350, justifyContent: "space-between"}}>
            <Text style={{ fontWeight: "600", fontSize: 22, color:"black"}}>{Const.GENDER_FEMALE}</Text>
            <TouchableOpacity onPress={() => setGender(Const.GENDER_FEMALE)}>
              <MaterialIcons name={(gender===Const.GENDER_FEMALE)?"radio-button-checked":"radio-button-unchecked"} 
              size={30} color={(gender===Const.GENDER_FEMALE)?"#2740C9":"black"} />
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: '#8D8686', borderBottomWidth: 1, width: 350, marginTop: 20}} />
        </View>

        <View style={{ marginBottom: 25}}>
          <View style={{ flexDirection:"row", width: 350, justifyContent: "space-between"}}>
            <Text style={{ fontWeight: "600", fontSize: 22, color:"black"}}>{Const.GENDER_MALE}</Text>
            <TouchableOpacity onPress={() => setGender(Const.GENDER_MALE)}>
              <MaterialIcons name={(gender===Const.GENDER_MALE)?"radio-button-checked":"radio-button-unchecked"} 
              size={30} color={(gender===Const.GENDER_MALE)?"#2740C9":"black"} />
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: '#8D8686', borderBottomWidth: 1, width: 350, marginTop: 20}} />
        </View>

        <View style={{ marginBottom: 25}}>
          <View style={{ flexDirection:"row", width: 350, justifyContent: "space-between"}}>
            <View style={{ width: 300}}>
              <Text style={{ fontWeight: "600", fontSize: 22, color:"black"}}>{Const.GENDER_SECRET}</Text>
              <Text style={{ fontWeight: "normal", fontSize: 16, color:"black", paddingTop:10}}>
              Chọn Tùy chỉnh nếu bạn thuộc giới tính khác hoặc không muốn tiết lộ
              </Text>
            </View>
            <View style={{ justifyContent: "center"}}>
            <TouchableOpacity onPress={() => setGender(Const.GENDER_SECRET)}>
              <MaterialIcons name={(gender===Const.GENDER_SECRET)?"radio-button-checked":"radio-button-unchecked"} 
              size={30} color={(gender===Const.GENDER_SECRET)?"#2740C9":"black"} />
            </TouchableOpacity>
            </View>
          </View>
          <View style={{ borderBottomColor: '#8D8686', borderBottomWidth: 1, width: 350, marginTop: 10}} />
        </View>

      </View>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress4}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    )
  }

  export const Register6 = ({ route, navigation }) => {

    const textInputRef = React.useRef();

    const focusOnInput = e => {
      textInputRef.current.focus();
    };
  
    navigation.addListener("focus", focusOnInput);

    const [password, setPassword] = React.useState("");
    const [validPasswrod, setValidPassword] = React.useState(true);
    const onPress6 = () => {

      if ((password.length < 6) || (password.length > 10)){
        setValidPassword(false);
        return;
      }

      navigation.navigate('Điều khoản và quyền riêng tư', {
      ...route.params,
      password: password,
      });
    }

    const changePassword = (text) => {
      setPassword(text);
      setValidPassword(true);
    }

    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Chọn mật khẩu</Text>
          {validPasswrod?
          <View>
            <Text style={styles.description}>Tạo mật khẩu dài từ 6 đến 10 ký tự. </Text>
            <Text style={styles.description}>Đó là mật khẩu người khác không thể đoán được</Text>
          </View>
          :
          <View style={{flexDirection:"row", alignItems: "center", width:350, justifyContent: "space-evenly"}}>
            <Text style={ {...styles.description, color: "red", width:330 }}>Hãy nhập mật khẩu có độ dài 6 đến 10 ký tự</Text>
            <AntDesign style = {{bottom: 0, right: 0}} name="exclamationcircle" size={20} color="red" />
          </View>}
          <TextInput style={styles.textInput} ref={textInputRef} placeholder="Mật khẩu" secureTextEntry={true}
          value={password} onChangeText={changePassword}/>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress={onPress6}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Tiếp</Text>
            </View>
      </TouchableHighlight>
      </View>
    )
  }

  export const Register7 = ({ route, navigation }) => {

    const { globalFunction } = React.useContext(GlobalContext);

    const handleRegister = async () => {
      try {
        const response = await fetch(Const.API_URL+'/api/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phonenumber: route.params.phonenumber,
            username: route.params.name,
            password: route.params.password,
            gender: route.params.gender,
            birthday: new Date(route.params.birthday)

          })
        });
        const json = await response.json();
        if ((json.user === undefined) || (json.user === null)) {
          Alert.alert('Đăng ký thất bại!', 'Đăng ký thật bại, hãy thử lại.', [{text: 'Okay'}]);
          navigation.navigate('Đăng nhập');
          return;
        }
        globalFunction.signIn({token:json.token, user:json.user});
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <View style={styles.backGround}>
      <View style={styles.container}>
          <Text style={styles.title}>Hoàn tất đăng ký</Text>
          <Text style={styles.description}>Bằng cách nhấn vào nút Đăng ký, 
          bạn đồng ý tạo tài khoản sử dụng dịch vụ của chúng tôi </Text>
      </View>
      <TouchableHighlight style={styles.buttonOut} onPress = {handleRegister}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>Đăng ký</Text>
            </View>
      </TouchableHighlight>
      </View>
    )
  }
