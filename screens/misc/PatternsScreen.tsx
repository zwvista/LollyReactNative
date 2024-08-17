import { FlatList, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PatternsService } from "../../view-models/wpp/patterns.service.ts";
import PatternsDetailDialog from "./PatternsDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MPattern } from "../../models/wpp/pattern.ts";
import { getPreferredRangeFromArray } from "../../common/common.ts";
import Clipboard from '@react-native-clipboard/clipboard';

export default function PatternsScreen({ navigation }:any) {
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onFilterTypeChange = (e: MSelectItem) => {
    setFilterType(e.value);
    onRefresh();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MPattern) => {
    settingsService.speak(item.PATTERN);
  };

  const onPressItemRight = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, patternsService.patterns.length, 50);
    navigation.navigate("Patterns Web Page", {
      patterns: patternsService.patterns.slice(start, end),
      patternIndex: index - start,
    });
  };

  const onLongPressItem = (item: MPattern) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Browse Web Page",
        "Copy Pattern",
        "Google Pattern",
        "Cancel"
      ],
      cancelButtonIndex: 5,
      destructiveButtonIndex: 0
    }, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 2:
          // Browse Web Page
          onPressItemRight(patternsService.patterns.indexOf(item));
          break;
        case 3:
          // Copy Pattern
          Clipboard.setString(item.PATTERN);
          break;
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <FontAwesome name='plus-circle' size={30} onPress={() => showDetailDialog(0)} />
    });
  }, []);

  useEffect(() => {
    (async () => {
      await patternsService.getData(filter, filterType);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <View style={{padding: 8}}>
      <View style={{flexDirection: "row"}}>
        <View style={{flexGrow: 1}}>
          <TextInput
            style={stylesApp.textinput}
            value={filter}
            onChangeText={setFilter}
            returnKeyType='search'
            onSubmitEditing={onRefresh}
          />
        </View>
        <View style={stylesApp.rowLeft}>
          <Dropdown
            style={stylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.patternFilterTypes.find(o => o.value === filterType)}
            data={settingsService.patternFilterTypes}
            onChange={onFilterTypeChange}
          />
        </View>
      </View>
      <View style={{flexGrow: 1}}>
        <FlatList
          keyExtractor={item => item.ID.toString()}
          ItemSeparatorComponent={(props) =>
            <View style={{height: 1, backgroundColor: 'gray'}} />
          }
          data={patternsService.patterns}
          renderItem={({item, index}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={stylesApp.row}>
                <View style={{flexGrow: 1}}>
                  <Text style={stylesApp.itemtext1}>{item.PATTERN}</Text>
                  <Text style={stylesApp.itemtext2}>{item.TAGS}</Text>
                </View>
                <FontAwesome name='chevron-right' size={20} onPress={() => onPressItemRight(index)} />
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <PatternsDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
