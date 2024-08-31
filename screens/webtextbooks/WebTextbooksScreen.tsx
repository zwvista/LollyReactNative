import { FlatList, Text, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { WebTextbooksService } from "../../view-models/misc/webtextbooks.service.ts";
import WebTextbooksDetailDialog from "./WebTextbooksDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MWebTextbook } from "../../models/misc/webtextbook.ts";
import { getPreferredRangeFromArray } from "../../common/common.ts";

export default function WebTextbooksScreen({ navigation }:any) {
  const webTextbooksService = container.resolve(WebTextbooksService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [textbookFilter, setTextbookFilter] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onTextbookFilterChange = (e: MSelectItem) => {
    setTextbookFilter(e.value);
    onRefresh();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MWebTextbook) => {
    settingsService.speak(item.TEXTBOOKNAME);
  };

  const onPressItemRight = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, webTextbooksService.webTextbooks.length, 50);
    navigation.navigate("WebTextbooks Web Page", {
      webTextbooks: webTextbooksService.webTextbooks.slice(start, end),
      webTextbookIndex: index - start,
    });
  };

  const onLongPressItem = (item: MWebTextbook) => {
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
          onPressItemRight(webTextbooksService.webTextbooks.indexOf(item));
          break;
      }
    });
  };

  useEffect(() => {
    (async () => {
      await webTextbooksService.getData(textbookFilter);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <View className="p-2">
      <View className="flex-row">
        <View className="grow">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.webTextbookFilters.find(o => o.value === textbookFilter)}
            data={settingsService.webTextbookFilters}
            onChange={onTextbookFilterChange}
          />
        </View>
      </View>
      <View className="grow">
        <FlatList
          keyExtractor={item => item.ID.toString()}
          ItemSeparatorComponent={(props) =>
            <View style={{height: 1, backgroundColor: 'gray'}} />
          }
          data={webTextbooksService.webTextbooks}
          renderItem={({item, index}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={StylesApp.row}>
                <View className="grow">
                  <Text style={StylesApp.itemText1}>{item.TEXTBOOKNAME}</Text>
                  <Text style={StylesApp.itemText2}>{item.TITLE}</Text>
                </View>
                <FontAwesome name='chevron-right' size={20} onPress={() => onPressItemRight(index)} />
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <WebTextbooksDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
