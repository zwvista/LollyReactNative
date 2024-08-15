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
import SearchScreen from "./screens/Search";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from "react-native";
import WordsUnitScreen from "./screens/WordsUnit.tsx";
import { container } from "tsyringe";
import { AppService } from "./view-models/misc/app.service.ts";
import WordsTextbookScreen from "./screens/WordsTextboook.tsx";
import WordsLangScreen from "./screens/WordsLang.tsx";
import PhrasesUnitScreen from "./screens/PhrasesUnit.tsx";
import PhrasesTextbookScreen from "./screens/PhrasesTextboook.tsx";
import PhrasesLangScreen from "./screens/PhrasesLang.tsx";
import PatternsScreen from "./screens/Patterns.tsx";

const Drawer = createDrawerNavigator();

const App = () => {
  const appService = container.resolve(AppService);
  useEffect(() => {
    (async () => {
      await appService.getData();
    })();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Search">
        <Drawer.Screen name="Search" component={SearchScreen} options={{
          headerRight: () => <Button title="Logout" />,
          drawerIcon: () => <Ionicons name='home' size={30} color='#130f40' />
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
