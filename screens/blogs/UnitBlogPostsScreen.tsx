import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { UnitBlogPostsService } from "../../view-models/blogs/unit-blog-posts.service.ts";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

export default function UnitBlogPostsScreen({ navigation }:any) {
  const unitBlogPostsService = container.resolve(UnitBlogPostsService);
  const [webViewSource, setWebViewSource] = useState({html: ''});
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const flingFun = (direction: number, delta: number) => Gesture.Fling()
    .runOnJS(true)
    .direction(direction)
    .onStart(() => {
      unitBlogPostsService.next(delta);
      onRefresh();
    });
  const fling = Gesture.Race(flingFun(Directions.RIGHT, 1), flingFun(Directions.LEFT, -1));

  const onUnitChange = (index: number) => {
    unitBlogPostsService.selectedUnitIndex = index;
    onRefresh();
  };

  useEffect(() => {
    (async () => {
      setWebViewSource({html: await unitBlogPostsService.getHtml()});
    })();
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="label"
        valueField="value"
        value={unitBlogPostsService.selectedUnit}
        data={unitBlogPostsService.units}
        onChange={e => onUnitChange(unitBlogPostsService.units.indexOf(e))}
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
