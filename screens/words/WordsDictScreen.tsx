import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MDictionary } from "../../models/misc/dictionary.ts";
import { useEffect, useReducer, useState } from "react";
import WebView from "react-native-webview";
import OnlineDict from "../../components/OnlineDict.ts";
import { ValueOnly } from "../../App.tsx";
import stylesApp from "../../components/stylesApp.ts";

export default function WordsDictScreen({ route, navigation }:any) {
  const {words, wordIndex}: {words: ValueOnly[], wordIndex: number} = route.params;
  const settingsService = container.resolve(SettingsService);
  const [word, setWord] = useState(words[wordIndex].value);
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const onlineDict = new OnlineDict(settingsService);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onWordChange = async (e: ValueOnly) => {
    setWord(e.value);
    onRefresh();
  };

  const onDictChange = async (e: MDictionary) => {
    settingsService.selectedDictReference = e;
    await settingsService.updateDictReference();
    onRefresh();
  };

  useEffect(() => {
    (async () =>
      await onlineDict.searchDict(word, settingsService.selectedDictReference, setWebViewSource)
    )();
  }, [refreshCount]);

  return (
    <View style={{flex:1}}>
      <View style={stylesApp.row}>
        <View style={{width: '50%'}}>
          <Dropdown
            style={stylesApp.dropdown}
            labelField="value"
            valueField="value"
            value={words[wordIndex]}
            data={words}
            onChange={onWordChange}
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
      <View style={{flexGrow: 1}}>
        <WebView
          source={webViewSource}
        />
      </View>
    </View>
  );
}
