/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './gesture-handler';
import "reflect-metadata"
import React, { type PropsWithChildren, useEffect } from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from "react-native";
import WordsUnitScreen from "./screens/WordsUnitScreen.tsx";
import WordsTextbookScreen from "./screens/WordsTextboookScreen.tsx";
import WordsLangScreen from "./screens/WordsLangScreen.tsx";
import PhrasesUnitScreen from "./screens/PhrasesUnitScreen.tsx";
import PhrasesTextbookScreen from "./screens/PhrasesTextboookScreen.tsx";
import PhrasesLangScreen from "./screens/PhrasesLangScreen.tsx";
import PatternsScreen from "./screens/PatternsScreen.tsx";
import SettingsScreen from "./screens/SettingsScreen.tsx";
import { MMKVLoader } from "react-native-mmkv-storage";

const Drawer = createDrawerNavigator();

export const storage = new MMKVLoader().initialize();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Search">
        <Drawer.Screen name="Search" component={SearchScreen} options={{
          headerRight: () => <Button title="Logout" />,
          drawerIcon: () => <Ionicons name='home' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Settings" component={SettingsScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Words in Unit" component={WordsUnitScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Phrases in Unit" component={PhrasesUnitScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Words in Textbook" component={WordsTextbookScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Phrases in Textbook" component={PhrasesTextbookScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Words in Language" component={WordsLangScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Phrases in Language" component={PhrasesLangScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
        <Drawer.Screen name="Patterns in Language" component={PatternsScreen} options={{
          drawerIcon: () => <Ionicons name='notifications' size={30} color='#130f40' />
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
