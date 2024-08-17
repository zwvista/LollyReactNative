/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './gesture-handler';
import "reflect-metadata"
import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import SearchScreen from "./screens/misc/SearchScreen";
import FontAwesome from 'react-native-vector-icons/FontAwesome.js';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from "react-native";
import WordsUnitScreen from "./screens/words/WordsUnitScreen.tsx";
import WordsTextbookScreen from "./screens/words/WordsTextboookScreen.tsx";
import WordsLangScreen from "./screens/words/WordsLangScreen.tsx";
import PhrasesUnitScreen from "./screens/phrases/PhrasesUnitScreen.tsx";
import PhrasesTextbookScreen from "./screens/phrases/PhrasesTextboookScreen.tsx";
import PhrasesLangScreen from "./screens/phrases/PhrasesLangScreen.tsx";
import PatternsScreen from "./screens/misc/PatternsScreen.tsx";
import SettingsScreen from "./screens/misc/SettingsScreen.tsx";
import { MMKVLoader } from "react-native-mmkv-storage";
import { createStackNavigator } from "@react-navigation/stack";
import WordsDictScreen from "./screens/words/WordsDictScreen.tsx";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import PatternsWebPageScreen from "./screens/misc/PatternsWebPageScreen.tsx";

export const storage = new MMKVLoader().initialize();
export interface DetailDialogProps {
  id: number,
  isDialogOpened: boolean,
  handleCloseDialog: () => void,
}
export interface ValueOnly {
  value: string;
}
export const stylesApp = StyleSheet.create({
  textinput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownDisable: {
    backgroundColor: 'darkgray'
  },
  unitpart: {color: '#0000FF'},
  itemtext1: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#FFA500'
  },
  itemtext2: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#FF00FF'
  },
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Drawer.Navigator>
       <Drawer.Screen name="Search" component={SearchScreen} options={{
         drawerIcon: () => <FontAwesome name='search' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Settings" component={SettingsScreen} options={{
         drawerIcon: () => <FontAwesome name='cog' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Words in Unit" component={WordsUnitScreen} options={{
         drawerIcon: () => <FontAwesome name='bus' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Phrases in Unit" component={PhrasesUnitScreen} options={{
         drawerIcon: () => <FontAwesome name='train' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Words in Textbook" component={WordsTextbookScreen} options={{
         drawerIcon: () => <FontAwesome name='car' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Phrases in Textbook" component={PhrasesTextbookScreen} options={{
         drawerIcon: () => <FontAwesome name='taxi' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Words in Language" component={WordsLangScreen} options={{
         drawerIcon: () => <FontAwesome name='plane' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Phrases in Language" component={PhrasesLangScreen} options={{
         drawerIcon: () => <FontAwesome name='rocket' size={30} color='#130f40' />
       }}/>
       <Drawer.Screen name="Patterns in Language" component={PatternsScreen} options={{
         drawerIcon: () => <FontAwesome name='motorcycle' size={30} color='#130f40' />
       }}/>
    </Drawer.Navigator>
  );
}

// https://reactnavigation.org/docs/nesting-navigators/
// https://stackoverflow.com/questions/69974336/how-to-use-drawer-navigator-stack-navigator-combined-in-react-native
export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Word Dictionary" component={WordsDictScreen} options={{
            title: 'Word Dictionary'
          }} />
          <Stack.Screen name="Patterns Web Page" component={PatternsWebPageScreen} options={{
            title: 'Word Dictionary'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
