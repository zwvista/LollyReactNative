import { FlatList, RefreshControl, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { PhrasesUnitService } from "../../view-models/phrases/phrases-unit.service.ts";
import PhrasesTextbookDetailDialog from "./PhrasesTextbookDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";
import Clipboard from '@react-native-clipboard/clipboard';
import { googleString } from "../../common/common.ts";
import YesNoDialog from "../../components/YesNoDialog.tsx";

export default function PhrasesTextbookScreen({ navigation }:any) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [refreshing, setRefreshing] = useState(false);

  const onTextbookFilterTypeChange = (e: MSelectItem) => {
    setTextbookFilter(e.value);
    onReload();
  }

  const onFilterTypeChange = (e: MSelectItem) => {
    setFilterType(e.value);
    onReload();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressItem = (item: MUnitPhrase) => {
    settingsService.speak(item.PHRASE);
  };

  const onLongPressItem = (item: MUnitPhrase) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Copy Phrase",
        "Google Phrase",
        "Cancel"
      ],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 0
    }, async (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          // Delete
          YesNoDialog('delete', `Do you really want to delete the phrase "${item.PHRASE}"?`,
            async () => await phrasesUnitService.delete(item));
          break;
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 2:
          // Copy Phrase
          Clipboard.setString(item.PHRASE);
          break;
        case 3:
          // Google Phrase
          await googleString(item.PHRASE);
          break;
      }
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => {
      await phrasesUnitService.getDataInLang(filter, filterType, textbookFilter);
      setRefreshing(false);
    })();
  }, [filter, filterType, textbookFilter]);
  useEffect(onRefresh, [reloadCount]);

  return (
    <View className="p-2">
      <View className="flex-row">
        <View className="grow">
          <TextInput
            style={StylesApp.textinput}
            value={filter}
            onChangeText={setFilter}
            returnKeyType='search'
            onSubmitEditing={onReload}
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
            value={settingsService.phraseFilterTypes.find(o => o.value === filterType)}
            data={settingsService.phraseFilterTypes}
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
          data={phrasesUnitService.textbookPhrases}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({item, index}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={StylesApp.row}>
                <View>
                  <Text style={StylesApp.ups}>{item.UNITSTR}</Text>
                  <Text style={StylesApp.ups}>{item.PARTSTR}</Text>
                  <Text style={StylesApp.ups}>{item.SEQNUM}</Text>
                </View>
                <View className="grow">
                  <Text style={StylesApp.itemText1}>{item.PHRASE}</Text>
                  <Text style={StylesApp.itemText2}>{item.TRANSLATION}</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <PhrasesTextbookDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
