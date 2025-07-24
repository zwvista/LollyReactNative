import { FlatList, Text, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { OnlineTextbooksService } from "../../view-models/online-textbooks/online-textbooks.service.ts";
import OnlineTextbooksDetailDialog from "./OnlineTextbooksDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MOnlineTextbook } from "../../models/misc/online-textbook.ts";
import { getPreferredRangeFromArray } from "../../common/common.ts";

export default function OnlineTextbooksScreen({ navigation }:any) {
  const onlineTextbooksService = container.resolve(OnlineTextbooksService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [onlineTextbookFilter, setOnlineTextbookFilter] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onOnlineTextbookFilterChange = (e: MSelectItem) => {
    setOnlineTextbookFilter(e.value);
    onReload();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MOnlineTextbook) => {
    settingsService.speak(item.TEXTBOOKNAME);
  };

  const onPressItemRight = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, onlineTextbooksService.onlineTextbooks.length, 50);
    navigation.navigate("Online Textbooks (Web Page)", {
      onlineTextbooks: onlineTextbooksService.onlineTextbooks.slice(start, end),
      onlineTextbookIndex: index - start,
    });
  };

  const onLongPressItem = (item: MOnlineTextbook) => {
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
          onPressItemRight(onlineTextbooksService.onlineTextbooks.indexOf(item));
          break;
      }
    });
  };

  useEffect(() => {
    (async () => {
      await onlineTextbooksService.getData(onlineTextbookFilter);
      forceUpdate();
    })();
  }, [reloadCount]);

  return (
    <View className="p-2">
      <View className="flex-row">
        <View className="grow">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.onlineTextbookFilters.find(o => o.value === onlineTextbookFilter)}
            data={settingsService.onlineTextbookFilters}
            onChange={onOnlineTextbookFilterChange}
          />
        </View>
      </View>
      <View className="grow">
        <FlatList
          keyExtractor={item => item.ID.toString()}
          ItemSeparatorComponent={(props) =>
            <View style={{height: 1, backgroundColor: 'gray'}} />
          }
          data={onlineTextbooksService.onlineTextbooks}
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
      {showDetail && <OnlineTextbooksDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
