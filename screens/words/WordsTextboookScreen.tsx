import { FlatList, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import WordsTextbookDetailDialog from "./WordsTextbookDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import { getPreferredRangeFromArray } from "../../common/common.ts";

export default function WordsTextbookScreen({ navigation }:any) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

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

  const { showActionSheetWithOptions } = useActionSheet();

  const onPressItem = (item: MUnitWord) => {
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
      </View>
      <View style={{flexDirection: "row"}}>
        <View style={{width: '50%'}}>
          <Dropdown
            style={stylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.textbookFilters.find(o => o.value === textbookFilter)}
            data={settingsService.textbookFilters}
            onChange={onTextbookFilterTypeChange}
          />
        </View>
        <View style={{width: '50%'}}>
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
        data={wordsUnitService.textbookWords}
        renderItem={({item, index}) =>
          <TouchableWithoutFeedback
            onPress={() => onPressItem(item)}
            onLongPress={() => onLongPressItem(item)}
          >
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View>
                <Text style={stylesApp.unitpart}>{item.UNITSTR}</Text>
                <Text style={stylesApp.unitpart}>{item.PARTSTR}</Text>
                <Text style={stylesApp.unitpart}>{item.SEQNUM}</Text>
              </View>
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
      {showDetail && <WordsTextbookDetailDialog id={detailId} isDialogOpened={showDetail}
                                                handleCloseDialog={() => setShowDetail(false)}/>}
    </View>
  );
}
