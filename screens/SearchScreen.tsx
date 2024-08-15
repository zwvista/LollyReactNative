import * as React from 'react';
import { Button, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../view-models/misc/app.service.ts";
import LoginDialog from "./LoginDialog.tsx";
import { useEffect, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalVars } from "../common/common.ts";

export default function SearchScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState('');
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
      setLoggedIn((await AsyncStorage.getItem('userid')) ?? '');
      if (!loggedIn) {
        setShowLogin(true);
      } else {
        GlobalVars.userid = loggedIn;
      }
    })();
  }, [loginCount]);

  return !loggedIn ? <View /> : (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title={`Go to notifications ${appService.isInitialized}`}
      />
      {showLogin && <LoginDialog isDialogOpened={showLogin} handleCloseDialog={() => setShowLogin(false)} />}
    </View>
  );
}
