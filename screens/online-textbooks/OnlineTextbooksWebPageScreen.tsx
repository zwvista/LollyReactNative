import { View } from "react-native";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MOnlineTextbook } from "../../models/misc/online-textbook.ts";
import { OnlineTextbooksWebPageService } from "../../view-models/online-textbooks/online-textbooks-webpage.ts";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

export default function OnlineTextbooksWebPageScreen({ route, navigation }:any) {
  const {onlineTextbooks, onlineTextbookIndex}: {onlineTextbooks: MOnlineTextbook[], onlineTextbookIndex: number} = route.params;
  const [service,] = useState(new OnlineTextbooksWebPageService(onlineTextbooks, onlineTextbookIndex));
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

  const onOnlineTextbookChange = async (e: MOnlineTextbook) => {
    service.selectedOnlineTextbookIndex = service.onlineTextbooks.indexOf(e);
    onRefresh();
  };

  useEffect(() => {
    setWebViewSource({uri: service.selectedOnlineTextbook.URL});
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="TITLE"
        valueField="ID"
        value={service.selectedOnlineTextbook}
        data={service.onlineTextbooks}
        onChange={onOnlineTextbookChange}
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
