import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import * as Register from './Register';
import CheckPhonenumber from './CheckPhonenumber';

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Đăng nhập" component={Login}/>
        <Stack.Screen name="Tạo tài khoản" component={Register.Register1} />
        <Stack.Screen name="Số điện thoại" component={Register.Register2} />
        <Stack.Screen name="Tên" component={Register.Register3} />
        <Stack.Screen name="Ngày sinh" component={Register.Register4} />
        <Stack.Screen name="Giới tính" component={Register.Register5} />
        <Stack.Screen name="Mật khẩu" component={Register.Register6} />
        <Stack.Screen name="Điều khoản và quyền riêng tư" component={Register.Register7} />
        <Stack.Screen name="Xác nhận tài khoản" component={CheckPhonenumber} />
      </Stack.Navigator>
  );
};

export default LoginStack;