import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MSelectItem } from "../../common/selectitem.ts";
import { UnitBlogPostsService } from "../../view-models/blogs/unit-blog-posts.service.ts";

export default function UnitBlogPostsScreen({ navigation }:any) {
  const unitBlogPostsService = container.resolve(UnitBlogPostsService);
  const settingsService = container.resolve(SettingsService);
  const unit = settingsService.units.find(x => x.value === settingsService.USUNITTO);
  const [webViewSource, setWebViewSource] = useState({html: ''});
  const [html, setHtml] = useState('');
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);

  const onUnitChange = async (e: MSelectItem) => {
    setHtml(await unitBlogPostsService.getHtml(e.value));
    onRefresh();
  };

  useEffect(() => {
    setWebViewSource({html: html});
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="label"
        valueField="value"
        value={unit}
        data={settingsService.units}
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
