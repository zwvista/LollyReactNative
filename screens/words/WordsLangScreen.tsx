import { Button, FlatList, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { WordsLangService } from "../../view-models/wpp/words-lang.service.ts";
import WordsLangDetailDialog from "./WordsLangDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MLangWord } from "../../models/wpp/lang-word.ts";
import { getPreferredRangeFromArray } from "../../common/common.ts";

export default function WordsLangScreen({ navigation }:any) {
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

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

  const { showActionSheetWithOptions } = useActionSheet();

  const onPressItem = (item: MLangWord) => {
  };

  const onLongPressItem = (item: MLangWord) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Retrieve Note",
        "Clear Note",
        "Copy Word",
        "Google Word",
        "Online Dictionary",
        "Cancel"
      ],
      cancelButtonIndex: 7,
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

  const onPressWordDict = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, wordsLangService.langWords.length, 50);
    navigation.navigate("Word Dictionary", {
      words: wordsLangService.langWords.slice(start, end).map(o => ({value: o.WORD})),
      wordIndex: index - start,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableWithoutFeedback onPress={() => showDetailDialog(0)}>
          <MaterialCommunityIcons name='dots-vertical' size={30} color='blue' />
        </TouchableWithoutFeedback>
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={() => showDetailDialog(0)} title="Add" />
    });
  }, []);

  useEffect(() => {
    (async () => {
      await wordsLangService.getData(filter, filterType);
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
            value={settingsService.wordFilterTypes.find(o => o.value === filterType)}
            data={settingsService.wordFilterTypes}
            onChange={onFilterTypeChange}
          />
        </View>
      </View>
      <FlatList
        ItemSeparatorComponent={(props) =>
          <View style={{height: 1, backgroundColor: 'gray'}} />
        }
        data={wordsLangService.langWords}
        renderItem={({item, index}) =>
          <TouchableWithoutFeedback
            onPress={() => onPressItem(item)}
            onLongPress={() => onLongPressItem(item)}
          >
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={{flexGrow: 1}}>
                <Text style={stylesApp.itemtext1}>{item.WORD}</Text>
                <Text style={stylesApp.itemtext2}>{item.NOTE}</Text>
              </View>
              <TouchableWithoutFeedback onPress={() => onPressWordDict(index)}>
                <FontAwesome name='chevron-right' size={20} />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <WordsLangDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
