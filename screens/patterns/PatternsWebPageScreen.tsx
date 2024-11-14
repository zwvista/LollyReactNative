import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MPattern } from "../../models/wpp/pattern.ts";
import { PatternsWebPageService } from "../../view-models/wpp/patterns-webpage.ts";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

export default function PatternsWebPageScreen({ route, navigation }:any) {
  const {patterns, patternIndex}: {patterns: MPattern[], patternIndex: number} = route.params;
  const [service,] = useState(new PatternsWebPageService(patterns, patternIndex));
  const [webViewSource, setWebViewSource] = useState({uri: 'https://google.com'});
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const flingFun = (direction: number, delta: number) => Gesture.Fling()
    .runOnJS(true)
    .direction(direction)
    .onStart(() => {
      service.next(delta);
      onRefresh();
    });
  const fling = Gesture.Race(flingFun(Directions.RIGHT, 1), flingFun(Directions.LEFT, -1));

  const onPatternChange = async (e: MPattern) => {
    service.selectedPatternIndex = service.patterns.indexOf(e);
    onRefresh();
  };

  useEffect(() => {
    setWebViewSource({uri: service.selectedPattern.URL});
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="PATTERN"
        valueField="ID"
        value={service.selectedPattern}
        data={service.patterns}
        onChange={onPatternChange}
      />
      <GestureDetector gesture={fling}>
        <View className="grow">
          <WebView
            source={webViewSource}
          />
        </View>
      </GestureDetector>
    </View>
  );
}
