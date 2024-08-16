import * as React from 'react';
import { Button, Modal, SafeAreaView, Text, TextInput, View } from 'react-native';
import { container } from "tsyringe";
import { useReducer } from "react";
import { LoginService } from "../../view-models/misc/login.service.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage, stylesApp } from "../../App.tsx";

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
      <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>USERNAME:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={loginService.item.USERNAME}
              onChangeText={onChangeUsername}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PASSWORD:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={loginService.item.PASSWORD}
              onChangeText={onChangePassword}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Button title="Login" onPress={login} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
