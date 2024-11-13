import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useState } from "react";
import { container } from "tsyringe";
import { MSelectItem } from "../../common/selectitem.ts";
import { UnitBlogPostsService } from "../../view-models/blogs/unit-blog-posts.service.ts";

export default function UnitBlogPostsScreen({ navigation }:any) {
  const unitBlogPostsService = container.resolve(UnitBlogPostsService);
  const [webViewSource, setWebViewSource] = useState({html: ''});

  const onUnitChange = async (e: MSelectItem) => {
    setWebViewSource({html: await unitBlogPostsService.getHtml(e.value)});
  };

  useEffect(() => {
    (async () => {
      await onUnitChange(unitBlogPostsService.currentUnit);
    })();
  }, []);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="label"
        valueField="value"
        value={unitBlogPostsService.currentUnit}
        data={unitBlogPostsService.units}
        onChange={onUnitChange}
      />
      <View className="grow">
        <WebView
          originWhitelist={['*']}
          source={webViewSource}
        />
      </View>
    </View>
  );

}
