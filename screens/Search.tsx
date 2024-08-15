import * as React from 'react';
import { Button, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../view-models/misc/app.service.ts";
import { Login } from "./Login.tsx";
import { useEffect, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalVars } from "../common/common.ts";

export function HomeScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCount, updateLoginCount] = useReducer(x => x + 1, 0);

  const logout = async () => {
    await AsyncStorage.removeItem('userid');
    GlobalVars.userid = "";
    updateLoginCount();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={logout} title="Logout" />
    });
  }, []);

  useEffect(() => {
    (async () => {
      const loggedIn = await AsyncStorage.getItem('userid');
      if (!loggedIn) {
        setShowLogin(true);
      } else {
        GlobalVars.userid = loggedIn!;
      }
    })();
  }, [loginCount]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title={`Go to notifications ${appService.isInitialized}`}
      />
      {showLogin && <Login isDialogOpened={showLogin} handleCloseDialog={() => setShowLogin(false)} />}
    </View>
  );
}

export function NotificationsScreen({ navigation }:any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
