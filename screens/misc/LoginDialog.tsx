import * as React from 'react';
import {
  Alert,
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { container } from "tsyringe";
import { LoginService } from "../../view-models/misc/login.service.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage, stylesApp } from "../../App.tsx";
import Modal from "react-native-modal";
import { Formik } from "formik";
import { MUser } from "../../models/misc/user.ts";
import { FormikHelpers } from "formik/dist/types";

export default function LoginDialog(
  {isDialogOpened, handleCloseDialog}: {isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const loginService = container.resolve(LoginService);
  const [, setUserid] = useMMKVStorage('userid', storage, '');

  const login = async (values: MUser, formikHelpers: FormikHelpers<MUser>) => {
    loginService.item = values;
    const userid = await loginService.login();
    if (userid) {
      setUserid(userid);
      handleCloseDialog();
    } else {
      Alert.alert('Wrong username or password!');
    }
  };

  return (
    <Modal isVisible={isDialogOpened}>
      <Formik
        initialValues={loginService.item}
        onSubmit={login}
      >
        {({handleChange, handleSubmit, values}) =>
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={stylesApp.containerDialog}>
              <View style={stylesApp.row}>
                <View style={stylesApp.rowLeft}>
                  <Text>USERNAME:</Text>
                </View>
                <View style={stylesApp.rowRight}>
                  <TextInput
                    style={stylesApp.textinput}
                    value={values.USERNAME}
                    onChangeText={handleChange('USERNAME')}
                  />
                </View>
              </View>
              <View style={stylesApp.row}>
                <View style={stylesApp.rowLeft}>
                  <Text>PASSWORD:</Text>
                </View>
                <View style={stylesApp.rowRight}>
                  <TextInput
                    style={stylesApp.textinput}
                    secureTextEntry
                    value={values.PASSWORD}
                    onChangeText={handleChange('PASSWORD')}
                  />
                </View>
              </View>
              <View style={stylesApp.row}>
                <Button title="Login" onPress={() => handleSubmit()} />
              </View>
            </SafeAreaView>
          </TouchableNativeFeedback>
        }
      </Formik>
    </Modal>
  );
}
