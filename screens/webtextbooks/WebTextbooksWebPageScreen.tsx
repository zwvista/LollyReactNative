import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MWebTextbook } from "../../models/misc/webtextbook.ts";

export default function WebTextbooksWebPageScreen({ route, navigation }:any) {
  const {webTextbooks, webTextbookIndex}: {webTextbooks: MWebTextbook[], webTextbookIndex: number} = route.params;
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const [webTextbook, setWebTextbook] = useState(webTextbooks[webTextbookIndex].TITLE);
  const [url, setUrl] = useState(webTextbooks[webTextbookIndex].URL);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onWebTextbookChange = async (e: MWebTextbook) => {
    setWebTextbook(e.TITLE);
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
        value={webTextbooks[webTextbookIndex]}
        data={webTextbooks}
        onChange={onWebTextbookChange}
      />
      <View className="grow">
        <WebView
          source={webViewSource}
        />
      </View>
    </View>
  );
}
