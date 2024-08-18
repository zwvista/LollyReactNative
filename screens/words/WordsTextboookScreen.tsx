import { FlatList, Linking, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import WordsTextbookDetailDialog from "./WordsTextbookDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import { getPreferredRangeFromArray, googleString } from "../../common/common.ts";
import Clipboard from '@react-native-clipboard/clipboard';
import YesNoDialog from "../../components/YesNoDialog.tsx";

export default function WordsTextbookScreen({ navigation }:any) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onTextbookFilterTypeChange = (e: MSelectItem) => {
    setTextbookFilter(e.value);
    onRefresh();
  }

  const onFilterTypeChange = (e: MSelectItem) => {
    setFilterType(e.value);
    onRefresh();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MUnitWord) => {
    settingsService.speak(item.WORD);
  };

  const onLongPressItem = (item: MUnitWord) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Get Note",
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
        case 0:
          // Delete
          YesNoDialog('delete', `Do you really want to delete the word "${item.WORD}"?`,
            async () => await wordsUnitService.delete(item));
          break;
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 2:
          // Get Note
          await wordsUnitService.getNote(item);
          break;
        case 3:
          // Clear Note
          await wordsUnitService.clearNote(item);
          break;
        case 4:
          // Copy Word
          Clipboard.setString(item.WORD);
          break;
        case 5:
          // Google Word
          await googleString(item.WORD);
          break;
        case 6:
          // Online Dictionary
          const url = settingsService.selectedDictReference.urlString(item.WORD, settingsService.autoCorrects);
          await Linking.openURL(url);
          break;
      }
    });
  };

  const onPressItemRight = (index: number) => {
    const [start, end] = getPreferredRangeFromArray(index, wordsUnitService.textbookWords.length, 50);
    navigation.navigate("Word Dictionary", {
      words: wordsUnitService.textbookWords.slice(start, end).map(o => ({value: o.WORD})),
      wordIndex: index - start,
    });
  };

  useEffect(() => {
    (async () => {
      await wordsUnitService.getDataInLang(filter, filterType, textbookFilter);
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
      <View className="flex-row">
        <View className="w-1/2">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.textbookFilters.find(o => o.value === textbookFilter)}
            data={settingsService.textbookFilters}
            onChange={onTextbookFilterTypeChange}
          />
        </View>
        <View className="w-1/2">
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
      <View className="grow">
        <FlatList
          keyExtractor={item => item.ID.toString()}
          ItemSeparatorComponent={(props) =>
            <View style={{height: 1, backgroundColor: 'gray'}} />
          }
          data={wordsUnitService.textbookWords}
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
                <View className="grow">
                  <Text style={StylesApp.itemText1}>{item.WORD}</Text>
                  <Text style={StylesApp.itemText2}>{item.NOTE}</Text>
                </View>
                <FontAwesome name='chevron-right' size={20} onPress={() => onPressItemRight(index)} />
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <WordsTextbookDetailDialog id={detailId} isDialogOpened={showDetail}
                                                handleCloseDialog={() => setShowDetail(false)}/>}
    </View>
  );
}
