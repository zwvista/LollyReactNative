import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { MDictionary } from "../../models/misc/dictionary.ts";
import WebView from "react-native-webview";
import { ValueOnly } from "../../App.tsx";
import { WordsDictService } from "../../view-models/words/words-dict.service.ts";
import StylesApp from "../../components/StylesApp.ts";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

export default function WordsDictScreen({ route, navigation }:any) {
  const {words, wordIndex}: {words: ValueOnly[], wordIndex: number} = route.params;
  const [service,] = useState(new WordsDictService(words, wordIndex));
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

  const onWordChange = async (e: ValueOnly) => {
    service.onWordChange(e);
    onRefresh();
  };

  const onDictChange = async (e: MDictionary) => {
    await service.onDictChange(e);
    onRefresh();
  };

  useEffect(() => {
    (async () =>
      await service.searchDict(setWebViewSource)
    )();
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <View style={StylesApp.row}>
        <View className="w-1/2">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="value"
            valueField="value"
            value={service.selectedWord}
            data={service.words}
            onChange={onWordChange}
          />
        </View>
        <View className="w-1/2">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="NAME"
            valueField="ID"
            value={service.selectedDictReference}
            data={service.dictsReference}
            onChange={onDictChange}
          />
        </View>
      </View>
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
