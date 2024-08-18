import { FlatList, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import WordsUnitDetailDialog from "./WordsUnitDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome.js";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import Clipboard from '@react-native-clipboard/clipboard';
import { googleString } from "../../common/common.ts";
import { async } from "rxjs";

export default function WordsUnitScreen({ navigation }:any) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const [editMode, setEditMode] = useState(false);
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

  const onPressMenu = () => {
    showActionSheetWithOptions({
      options: [
        "Add",
        "Retrieve All Notes",
        "Retrieve Notes If Empty",
        "Clear All Notes",
        "Clear Notes If Empty",
        "Batch Edit",
        "Cancel"
      ],
      cancelButtonIndex: 6
    }, async (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          // Add
          showDetailDialog(0);
          break;
      }
    });
  };

  const onPressItem = (item: MUnitWord) => {
    if (editMode)
      showDetailDialog(item.ID);
    else
      settingsService.speak(item.WORD);
  };

  const onLongPressItem = (item: MUnitWord) => {
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
    }, async (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 4:
          // Copy Word
          Clipboard.setString(item.WORD);
          break;
        case 5:
          // Google Word
          await googleString(item.WORD);
          break;
      }
    });
  };

  const onPressItemRight = (index: number) => {
    navigation.navigate("Word Dictionary", {
      words: wordsUnitService.unitWords.map(o => ({value: o.WORD})),
      wordIndex: index,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View style={{flexDirection: "row"}}>
          <FontAwesome name='edit' size={30} color={editMode ? 'red' : 'black'} onPress={() => setEditMode(!editMode)} />
          <MaterialCommunityIcons name='dots-vertical' size={30} onPress={onPressMenu} />
        </View>
    });
  }, [editMode]);

  useEffect(() => {
    (async () => {
      await wordsUnitService.getDataInTextbook(filter, filterType);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <View style={{padding: 8}}>
      <View style={{flexDirection: "row"}}>
        <View style={{flexGrow: 1}}>
          <TextInput
            style={StylesApp.textinput}
            value={filter}
            onChangeText={setFilter}
            returnKeyType='search'
            onSubmitEditing={onRefresh}
          />
        </View>
        <View style={StylesApp.rowLeft}>
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.wordFilterTypes.find(o => o.value === filterType)}
            data={settingsService.wordFilterTypes}
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
          data={wordsUnitService.unitWords}
          renderItem={({item, index}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={StylesApp.row}>
                <View>
                  <Text style={StylesApp.unitPart}>{item.UNITSTR}</Text>
                  <Text style={StylesApp.unitPart}>{item.PARTSTR}</Text>
                  <Text style={StylesApp.unitPart}>{item.SEQNUM}</Text>
                </View>
                <View style={{flexGrow: 1}}>
                  <Text style={StylesApp.itemText1}>{item.WORD}</Text>
                  <Text style={StylesApp.itemText2}>{item.NOTE}</Text>
                </View>
                <TouchableNativeFeedback onPress={() => onPressItemRight(index)}>
                  <FontAwesome name='chevron-right' size={20} />
                </TouchableNativeFeedback>
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <WordsUnitDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
