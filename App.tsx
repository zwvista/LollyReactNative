/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack";
import {HomeScreen, NotificationsScreen} from "./screens/Search";
import SettingsScreen from "./screens/SettingsScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{drawerIcon: () => <Ionicons name='md-home' size={30} color='#130f40' />}}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{drawerIcon: () => <Ionicons name='md-notifications' size={30} color='#130f40' />}}/>
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{drawerIcon: () => <Ionicons name='md-settings' size={30} color='#130f40' />}}/>
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            title: 'My home',
            headerStyle: {
              backgroundColor: '#5f27cd',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <Ionicons name='md-menu' style={{paddingLeft: "4%"}} size={30} color='white' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
              );
            }
          }}
          component={DrawerComponent}
          name="Drawer"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
