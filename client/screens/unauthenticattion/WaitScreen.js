import * as React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import logo from "../../config/logo.png";
import * as Const from '../../config/Constants';

export default function WaitScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }