import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import { MPattern } from "../../models/wpp/pattern.ts";

export default function PatternsWebPageScreen({ route, navigation }:any) {
  const {patterns, patternIndex}: {patterns: MPattern[], patternIndex: number} = route.params;
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const [pattern, setPattern] = useState(patterns[patternIndex].PATTERN);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onPatternChange = async (e: MPattern) => {
    setPattern(e.PATTERN);
    onRefresh();
  };

  useEffect(() => {
    setWebViewSource({uri: pattern});
  }, [refreshCount]);

  return (
    <View style={{flex:1}}>
      <Dropdown
        style={stylesApp.dropdown}
        labelField="PATTERN"
        valueField="ID"
        value={patterns[patternIndex]}
        data={patterns}
        onChange={onPatternChange}
      />
      <View style={{flexGrow: 1}}>
        <WebView
          source={webViewSource}
        />
      </View>
    </View>
  );
}
