import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MOnlineTextbook } from "../../models/misc/onlinetextbook.ts";

export default function OnlineTextbooksWebPageScreen({ route, navigation }:any) {
  const {onlineTextbooks, onlineTextbookIndex}: {onlineTextbooks: MOnlineTextbook[], onlineTextbookIndex: number} = route.params;
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const [onlineTextbook, setOnlineTextbook] = useState(onlineTextbooks[onlineTextbookIndex].TITLE);
  const [url, setUrl] = useState(onlineTextbooks[onlineTextbookIndex].URL);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onOnlineTextbookChange = async (e: MOnlineTextbook) => {
    setOnlineTextbook(e.TITLE);
    setUrl(e.URL);
    onRefresh();
  };

  useEffect(() => {
    setWebViewSource({uri: url});
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="TITLE"
        valueField="ID"
        value={onlineTextbooks[onlineTextbookIndex]}
        data={onlineTextbooks}
        onChange={onOnlineTextbookChange}
      />
      <View className="grow">
        <WebView
          source={webViewSource}
        />
      </View>
    </View>
  );
}
