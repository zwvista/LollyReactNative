import * as React from 'react';
import { Button, TextInput, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../view-models/misc/app.service.ts";
import LoginDialog from "./LoginDialog.tsx";
import { useCallback, useEffect, useReducer, useState } from "react";
import { GlobalVars } from "../common/common.ts";
import { useMMKVStorage } from "react-native-mmkv-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import WebView from "react-native-webview";
import { storage } from "../App.tsx";
import OnlineDict from "../components/OnlineDict.ts";

export default function SearchScreen({ navigation }:any) {
  const [openLang, setOpenLang] = useState(false);
  const [openDict, setOpenDict] = useState(false);
  const appService = container.resolve(AppService);
  const settingsService = container.resolve(SettingsService);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useMMKVStorage('userid', storage, '');
  const [loginCount, updateLoginCount] = useReducer(x => x + 1, 0);
  const [word, setWord] = useState('');
  const [webViewSource, setWebViewSource] = useState({ uri: 'https://infinite.red' });
  const onlineDict = container.resolve(OnlineDict);
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

  const onOpenLang = useCallback(() => {
    setOpenDict(false);
  }, []);

  const onOpenDict = useCallback(() => {
    setOpenLang(false);
  }, []);

  const onLangChange = async (e: any) => {
    const index = settingsService.languages.findIndex(o => o.ID === e(settingsService.selectedLang.ID));
    settingsService.selectedLang = settingsService.languages[index];
    await settingsService.updateLang();
    forceUpdate();
  };

  const onDictChange = async (e: any) => {
    const index = settingsService.dictsReference.findIndex(o => o.ID === e(settingsService.selectedDictReference.ID));
    settingsService.selectedDictReference = settingsService.dictsReference[index];
    await settingsService.updateDictReference();
    await onlineDict.searchDict(word, settingsService.selectedDictReference, setWebViewSource);
    forceUpdate();
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
        forceUpdate();
      }
    })();
  }, [loginCount]);

  return (
    <View style={{flex:1}}>
      {!appService.isInitialized ? <View /> : (
        <View style={{flex:1}}>
          <View style={{width: '100%'}}>
            <TextInput value={word} onChangeText={setWord} />
          </View>
          <View style={{flexDirection: "row", alignItems: "center", zIndex: 2}}>
            <View style={{width: '50%'}}>
              <DropDownPicker
                open={openLang}
                onOpen={onOpenLang}
                value={settingsService.selectedLang.ID}
                items={settingsService.languages.map(o => ({label: o.NAME, value: o.ID}))}
                setOpen={setOpenLang}
                setValue={onLangChange}
              />
            </View>
            <View style={{width: '50%'}}>
              <DropDownPicker
                open={openDict}
                onOpen={onOpenDict}
                value={settingsService.selectedDictReference?.ID ?? null}
                items={settingsService.dictsReference.map(o => ({label: o.NAME, value: o.ID}))}
                setOpen={setOpenDict}
                setValue={onDictChange}
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
