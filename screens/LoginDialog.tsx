import * as React from 'react';
import { Button, Modal, TextInput, View } from 'react-native';
import { container } from "tsyringe";
import { useReducer } from "react";
import { GlobalVars } from "../common/common.ts";
import { LoginService } from "../view-models/misc/login.service.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { AppService } from "../view-models/misc/app.service.ts";
import { storage } from "../App.tsx";

export default function LoginDialog(
  {isDialogOpened, handleCloseDialog}: {isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const loginService = container.resolve(LoginService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [, setUserid] = useMMKVStorage('userid', storage, '');

  const onChangeUsername = (e: string) => {
    loginService.item.USERNAME = e;
    forceUpdate();
  };

  const onChangePassword = (e: string) => {
    loginService.item.PASSWORD = e;
    forceUpdate();
  };

  const login = async () => {
    const userid = await loginService.login();
    if (userid) {
      setUserid(userid);
      handleCloseDialog();
    }
  };

  return (
    <Modal visible={isDialogOpened} onRequestClose={handleCloseDialog}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput placeholder="USERNAME" style={{width: '100%'}} value={loginService.item.USERNAME} onChangeText={onChangeUsername} />
        <TextInput placeholder="PASSWORD" secureTextEntry style={{width: '100%'}} value={loginService.item.PASSWORD} onChangeText={onChangePassword} />
        <Button title="Login" onPress={login} />
      </View>
    </Modal>
  );
}
