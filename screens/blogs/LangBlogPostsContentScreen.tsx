import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import WebView from "react-native-webview";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { LangBlogPostsContentService } from "../../view-models/blogs/lang-blog-posts-content.service.ts";
import { MLangBlogPost } from "../../models/blogs/lang-blog-post.ts";
import { LangBlogGroupsService } from "../../view-models/blogs/lang-blog-groups.service.ts";

export default function LangBlogPostsContentScreen({ route, navigation }:any) {
  const {LangBlogGroupsService, posts, selectedPostIndex}: {LangBlogGroupsService: LangBlogGroupsService, posts: MLangBlogPost[], selectedPostIndex: number} = route.params;
  const [service,] = useState(new LangBlogPostsContentService(LangBlogGroupsService, posts, selectedPostIndex));
  const [webViewSource, setWebViewSource] = useState({html: ''});
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const flingFun = (direction: number, delta: number) => Gesture.Fling()
    .runOnJS(true)
    .direction(direction)
    .onStart(() => {
      service.next(delta);
      onRefresh();
    });
  const fling = Gesture.Race(flingFun(Directions.RIGHT, 1), flingFun(Directions.LEFT, -1));

  const onPostChange = (e: MLangBlogPost) => {
    service.selectedPostIndex = service.posts.indexOf(e);
    onRefresh();
  };

  useEffect(() => {
    (async () => setWebViewSource({html: await service.langBlogGroupsService.getHtml()}))();
  }, [refreshCount]);

  return (
    <View className="flex-1">
      <Dropdown
        style={StylesApp.dropdown}
        labelField="TITLE"
        valueField="ID"
        value={service.selectedPost}
        data={service.posts}
        onChange={onPostChange}
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
