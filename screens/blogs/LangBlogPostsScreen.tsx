import { FlatList, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import LangBlogPostsDetailDialog from "./LangBlogPostsDetailDialog.tsx";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { getPreferredRangeFromArray } from "../../common/common.ts";
import { MLangBlogPost } from "../../models/blogs/lang-blog-post.ts";
import { LangBlogGroupsService } from "../../view-models/blogs/lang-blog-groups.service.ts";

export default function LangBlogPostsScreen({ navigation }:any) {
  const langBlogGroupsService = container.resolve(LangBlogGroupsService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [filter, setFilter] = useState('');
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MLangBlogPost) => {
    settingsService.speak(item.TITLE);
  };

  const onPressItemRight = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, langBlogGroupsService.langBlogPosts.length, 50);
    navigation.navigate("Online Textbooks (Web Page)", {
      langBlogPosts: langBlogGroupsService.langBlogPosts.slice(start, end),
      langBlogPostIndex: index - start,
    });
  };

  const onLongPressItem = (item: MLangBlogPost) => {
    showActionSheetWithOptions({
      options: [
        "Edit",
        "Browse Web Page",
        "Cancel"
      ],
      cancelButtonIndex: 2,
    }, async (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 1:
          // Browse Web Page
          onPressItemRight(langBlogGroupsService.langBlogPosts.indexOf(item));
          break;
      }
    });
  };

  useEffect(() => {
    (async () => {
      await langBlogGroupsService.getPosts();
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <View className="p-2">
      <View className="flex-row">
        <View className="grow">
          <TextInput
            style={StylesApp.textinput}
            value={filter}
            onChangeText={setFilter}
            returnKeyType='search'
            onSubmitEditing={onRefresh}
          />
        </View>
      </View>
      <View className="grow">
        <FlatList
          keyExtractor={item => item.ID.toString()}
          ItemSeparatorComponent={(props) =>
            <View style={{height: 1, backgroundColor: 'gray'}} />
          }
          data={langBlogGroupsService.langBlogPosts}
          renderItem={({item, index}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={StylesApp.row}>
                <View className="grow">
                  <Text style={StylesApp.itemText1}>{item.TITLE}</Text>
                </View>
                <FontAwesome name='chevron-right' size={20} onPress={() => onPressItemRight(index)} />
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <LangBlogPostsDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
