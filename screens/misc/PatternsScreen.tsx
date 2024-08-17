import { FlatList, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
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
  };

  const onLongPressItem = (item: MPattern) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Copy Pattern",
        "Google Pattern",
        "Cancel"
      ],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 0
    }, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
      }
    });
  };

  const onPressItemRight = (index: number) => {
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableWithoutFeedback onPress={() => showDetailDialog(0)}>
          <FontAwesome name='plus-circle' size={30} color='blue' />
        </TouchableWithoutFeedback>
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
        <View style={{width: '30%'}}>
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
      <FlatList
        ItemSeparatorComponent={(props) =>
          <View style={{height: 1, backgroundColor: 'gray'}} />
        }
        data={patternsService.patterns}
        renderItem={({item, index}) =>
          <TouchableWithoutFeedback
            onPress={() => onPressItem(item)}
            onLongPress={() => onLongPressItem(item)}
          >
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={{flexGrow: 1}}>
                <Text style={stylesApp.itemtext1}>{item.PATTERN}</Text>
                <Text style={stylesApp.itemtext2}>{item.TAGS}</Text>
              </View>
              <TouchableWithoutFeedback onPress={() => onPressItemRight(index)}>
                <FontAwesome name='chevron-right' size={20} />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <PatternsDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
