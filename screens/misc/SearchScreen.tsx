import * as React from 'react';
import { Button, TextInput, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../../view-models/misc/app.service.ts";
import LoginDialog from "./LoginDialog.tsx";
import { useEffect, useReducer, useState } from "react";
import { GlobalVars } from "../../common/common.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import WebView from "react-native-webview";
import { storage, stylesApp } from "../../App.tsx";
import OnlineDict from "../../components/OnlineDict.ts";
import { Dropdown } from "react-native-element-dropdown";
import { MLanguage } from "../../models/misc/language.ts";
import { MDictionary } from "../../models/misc/dictionary.ts";

export default function SearchScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const settingsService = container.resolve(SettingsService);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useMMKVStorage('userid', storage, '');
  const [loginCount, updateLoginCount] = useReducer(x => x + 1, 0);
  const [word, setWord] = useState('');
  const [webViewSource, setWebViewSource] = useState({uri: 'about:blank'});
  const onlineDict = new OnlineDict(settingsService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const logout = async () => {
    setLoggedIn('');
    GlobalVars.userid = "";
    updateLoginCount();
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    updateLoginCount();
  };

  const onLangChange = async (e: MLanguage) => {
    settingsService.selectedLang = e;
    await settingsService.updateLang();
    forceUpdate();
  };

  const searchDict = async () => {
    await onlineDict.searchDict(word, settingsService.selectedDictReference, setWebViewSource);
  };

  const onDictChange = async (e: MDictionary) => {
    settingsService.selectedDictReference = e;
    await settingsService.updateDictReference();
    await searchDict();
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
        await searchDict();
      }
    })();
  }, [loginCount]);

  return (
    <View style={{flex:1}}>
      {!appService.isInitialized ? <View /> : (
        <View style={{flex:1}}>
          <View style={{width: '100%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={word}
              onChangeText={setWord}
            />
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <View style={{width: '50%'}}>
              <Dropdown
                style={stylesApp.dropdown}
                labelField="NAME"
                valueField="ID"
                value={settingsService.selectedLang}
                data={settingsService.languages}
                onChange={onLangChange}
              />
            </View>
            <View style={{width: '50%'}}>
              <Dropdown
            style={stylesApp.dropdown}
                labelField="NAME"
                valueField="ID"
                value={settingsService.selectedDictReference}
                data={settingsService.dictsReference}
                onChange={onDictChange}
              />
            </View>
          </View>
          <View style={{flex: 1, alignSelf: "stretch"}}>
            <WebView
              source={webViewSource}
            />
          </View>
        </View>
      )}
      {showLogin && <LoginDialog isDialogOpened={showLogin} handleCloseDialog={handleCloseLogin} />}
    </View>
  );
}