import React from 'react'
import {Text} from 'react-native'

export const FormatTime = ({data}) => {
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
      <Text>{showTime}</Text>
    );
  }
