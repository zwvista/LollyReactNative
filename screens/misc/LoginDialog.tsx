import * as React from 'react';
import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { container } from "tsyringe";
import { useReducer } from "react";
import { LoginService } from "../../view-models/misc/login.service.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage, stylesApp } from "../../App.tsx";
import Modal from "react-native-modal";
import { Formik, useFormik } from "formik";
import { MUser } from "../../models/misc/user.ts";

export default function LoginDialog(
  {isDialogOpened, handleCloseDialog}: {isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const loginService = container.resolve(LoginService);
  const [, setUserid] = useMMKVStorage('userid', storage, '');

  const formik = useFormik({
    initialValues: loginService.item,
    onSubmit: async (values: MUser) => {
      loginService.item = values;
      const userid = await loginService.login();
      if (userid) {
        setUserid(userid);
        handleCloseDialog();
      }
    }
  });

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <Formik initialValues={loginService.item} onSubmit={() => formik.handleSubmit()}>
          <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: 'white'}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={{width: '30%'}}>
                <Text>USERNAME:</Text>
              </View>
              <View style={{width: '70%'}}>
                <TextInput
                  style={stylesApp.textinput}
                  {...formik.getFieldProps('USERNAME')}
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
                  secureTextEntry
                  {...formik.getFieldProps('PASSWORD')}
                />
              </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
              <Button title="Login" onPress={() => formik.handleSubmit()} />
            </View>
          </SafeAreaView>
        </Formik>
      </TouchableNativeFeedback>
    </Modal>
  );
}
