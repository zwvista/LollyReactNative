import * as React from 'react';
import { useEffect, useReducer, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../../view-models/misc/app.service.ts";
import LoginDialog from "./LoginDialog.tsx";
import { GlobalVars } from "../../common/common.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import WebView from "react-native-webview";
import OnlineDict from "../../components/OnlineDict.ts";
import { Dropdown } from "react-native-element-dropdown";
import { MLanguage } from "../../models/misc/language.ts";
import { MDictionary } from "../../models/misc/dictionary.ts";
import { storage } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function SearchScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const settingsService = container.resolve(SettingsService);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useMMKVStorage('userid', storage, '');
  const [loginCount, updateLoginCount] = useReducer(x => x + 1, 0);
  const [word, setWord] = useState('');
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const onlineDict = new OnlineDict(settingsService);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
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

  const onDictChange = async (e: MDictionary) => {
    settingsService.selectedDictReference = e;
    await settingsService.updateDictReference();
    onReload();
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
        onReload();
      }
    })();
  }, [loginCount]);

  useEffect(() => {
    (async () => {
      if (settingsService.selectedDictReference)
        await onlineDict.searchDict(word, settingsService.selectedDictReference, setWebViewSource)
    })();
  }, [reloadCount]);

  return (
    <View className="flex-1">
      {!appService.isInitialized ? <View /> : (
        <View className="flex-1">
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={word}
              onChangeText={setWord}
              returnKeyType='search'
              onSubmitEditing={onReload}
            />
          </View>
          <View style={StylesApp.rowCompact}>
            <View className="w-1/2">
              <Dropdown
                style={StylesApp.dropdown}
                labelField="NAME"
                valueField="ID"
                value={settingsService.selectedLang}
                data={settingsService.languages}
                onChange={onLangChange}
              />
            </View>
            <View className="w-1/2">
              <Dropdown
                style={StylesApp.dropdown}
                labelField="NAME"
                valueField="ID"
                value={settingsService.selectedDictReference}
                data={settingsService.dictsReference}
                onChange={onDictChange}
              />
            </View>
          </View>
          <View className="grow">
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
