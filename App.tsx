import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen, NotificationsScreen } from './screens/Search'
import SettingsScreen from './screens/SettingsScreen';
import { AppService } from './view-models/app.service';

// https://stackoverflow.com/questions/60316864/react-navigation-drawer-v5
// https://stackoverflow.com/questions/60233339/react-native-hamburger-onpress-issue

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

export default class App extends React.Component<any, any> {
  appService = AppService.Instance;

  componentDidMount() {
    console.log(this.appService);
  }

  render() {
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
  }
};
