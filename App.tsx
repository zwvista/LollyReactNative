/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './gesture-handler';
import "reflect-metadata"
import React, {type PropsWithChildren} from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";
import {HomeScreen, NotificationsScreen} from "./screens/Search";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from "react-native";


const Drawer = createDrawerNavigator();

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{
        headerRight: () => <Button title="Logout" />,
        drawerIcon: () => <Ionicons name='home' size={30} color='#130f40' />
      }}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />}}/>
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <DrawerComponent />
    </NavigationContainer>
  );
};

export default App;
