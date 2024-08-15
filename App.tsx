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
import SearchScreen from "./screens/Search";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from "react-native";
import { WordsUnitScreen } from "./screens/WordsUnit.tsx";


const Drawer = createDrawerNavigator();

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Search" component={SearchScreen} options={{
        headerRight: () => <Button title="Logout" />,
        drawerIcon: () => <Ionicons name='home' size={30} color='#130f40' />
      }}/>
      <Drawer.Screen name="Words Unit" component={WordsUnitScreen} options={{drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />}}/>
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
