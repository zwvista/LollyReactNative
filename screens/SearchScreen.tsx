import * as React from 'react';
import { Button, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../view-models/misc/app.service.ts";
import LoginDialog from "./LoginDialog.tsx";
import { useEffect, useReducer, useState } from "react";
import { GlobalVars } from "../common/common.ts";
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

export default function SearchScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const [showLogin, setShowLogin] = useState(false);
  const storage = new MMKVLoader().initialize();
  const [loggedIn, setLoggedIn] = useMMKVStorage('userid', storage, '');
  const [loginCount, updateLoginCount] = useReducer(x => x + 1, 0);

  const logout = async () => {
    setLoggedIn('');
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
      if (!loggedIn) {
        setShowLogin(true);
      } else {
        GlobalVars.userid = loggedIn;
        await appService.getData();
      }
    })();
  }, [loginCount]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title={`Go to notifications ${appService.isInitialized}`}
      />
      {showLogin && <LoginDialog isDialogOpened={showLogin} handleCloseDialog={() => setShowLogin(false)} />}
    </View>
  );
}
