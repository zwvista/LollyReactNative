import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MDictionary } from "../../models/misc/dictionary.ts";
import { useEffect, useState } from "react";
import WebView from "react-native-webview";
import OnlineDict from "../../components/OnlineDict.ts";

interface ValueOnly {
  value: string;
}

export default function WordsDictScreen({ route, navigation }:any) {
  const {words, wordIndex}: {words: ValueOnly[], wordIndex: number} = route.params;
  const settingsService = container.resolve(SettingsService);
  const [word, setWord] = useState(words[wordIndex].value);
  const [webViewSource, setWebViewSource] = useState({uri: 'about:blank'});
  const onlineDict = new OnlineDict(settingsService);

  const searchDict = async () => {
    await onlineDict.searchDict(word, settingsService.selectedDictReference, setWebViewSource);
  };

  const onDictChange = async (e: MDictionary) => {
    settingsService.selectedDictReference = e;
    await settingsService.updateDictReference();
    await searchDict();
  };

  useEffect(() => {
    (async () => await searchDict())();
  }, [word]);

  return (
    <View style={{flex:1}}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{width: '50%'}}>
          <Dropdown
            style={stylesApp.dropdown}
            labelField="value"
            valueField="value"
            value={words[wordIndex]}
            data={words}
            onChange={e => setWord(e.value)}
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
  );
}
