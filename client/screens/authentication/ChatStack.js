import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Conversation, {headerConversation} from './chattab/Conversation';
import MainTab from './MainTab';

const Stack = createNativeStackNavigator();

export default function ChatStack() {

    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Main tab" component={MainTab}/>
            <Stack.Screen name="Conversation" component={Conversation}
            options={({route}) => ({
                title: route.params.chatName,
                //headerBackTitleVisible: false
            })}
            />
        </Stack.Navigator>
    );
}