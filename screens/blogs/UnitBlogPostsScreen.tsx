import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { UnitBlogPostsService } from "../../view-models/blogs/unit-blog-posts.service.ts";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { MSelectItem } from "../../common/selectitem.ts";

export default function UnitBlogPostsScreen({ navigation }:any) {
  const service = container.resolve(UnitBlogPostsService);
  const [webViewSource, setWebViewSource] = useState({html: ''});
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const flingFun = (direction: number, delta: number) => Gesture.Fling()
    .runOnJS(true)
    .direction(direction)
    .onStart(() => {
      service.next(delta);
      onReload();
    });
  const fling = Gesture.Race(flingFun(Directions.RIGHT, 1), flingFun(Directions.LEFT, -1));

  const onUnitChange = (e: MSelectItem) => {
    service.selectedUnitIndex = service.units.indexOf(e);
    onReload();
  };

  useEffect(() => {
    (async () => setWebViewSource({html: await service.getHtml()}))();
  }, [reloadCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="label"
        valueField="value"
        value={service.selectedUnit}
        data={service.units}
        onChange={onUnitChange}
      />
      <GestureDetector gesture={fling}>
        <View className="grow">
          <WebView
            originWhitelist={['*']}
            source={webViewSource}
          />
        </View>
      </GestureDetector>
    </View>
  );
}
