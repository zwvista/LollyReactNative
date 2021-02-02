import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen, NotificationsScreen } from './screens/Search'

// https://stackoverflow.com/questions/60316864/react-navigation-drawer-v5
// https://stackoverflow.com/questions/60233339/react-native-hamburger-onpress-issue

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{drawerIcon: () => <Ionicons name='md-home' size={30} color='#130f40' />}}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{drawerIcon: () => <Ionicons name='md-notifications' size={30} color='#130f40' />}}/>
    </Drawer.Navigator>
  );
};

export default () => {
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
