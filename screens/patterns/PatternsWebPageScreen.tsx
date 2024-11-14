import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MPattern } from "../../models/wpp/pattern.ts";

export default function PatternsWebPageScreen({ route, navigation }:any) {
  const {patterns, patternIndex}: {patterns: MPattern[], patternIndex: number} = route.params;
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const [url, setUrl] = useState(patterns[patternIndex].URL);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onPatternChange = async (e: MPattern) => {
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
        labelField="PATTERN"
        valueField="ID"
        value={patterns[patternIndex]}
        data={patterns}
        onChange={onPatternChange}
      />
      <View className="grow">
        <WebView
          source={webViewSource}
        />
      </View>
    </View>
  );
}
