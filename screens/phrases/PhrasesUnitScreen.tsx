import { FlatList, RefreshControl, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { PhrasesUnitService } from "../../view-models/phrases/phrases-unit.service.ts";
import PhrasesUnitDetailDialog from "./PhrasesUnitDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import Clipboard from '@react-native-clipboard/clipboard';
import { googleString } from "../../common/common.ts";
import YesNoDialog from "../../components/YesNoDialog.tsx";
import PhrasesUnitBatchEditDialog from "./PhrasesUnitBatchEditDialog.tsx";

export default function PhrasesUnitScreen({ navigation }:any) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const {showActionSheetWithOptions} = useActionSheet();
  const [showBatchEdit, setShowBatchEdit] = useState(false);

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [refreshing, setRefreshing] = useState(false);

  const onFilterTypeChange = (e: MSelectItem) => {
    setFilterType(e.value);
    onReload();
  }

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  const onPressMenu = () => {
    showActionSheetWithOptions({
      options: [
        "Add",
        "Batch Edit",
        "Cancel"
      ],
      cancelButtonIndex: 2
    }, async (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          // Add
          showDetailDialog(0);
          break;
        case 1:
          // Batch Edit
          setShowBatchEdit(true);
          break;
      }
    });
  };

  const onPressItem = (item: MUnitPhrase) => {
    if (editMode)
      showDetailDialog(item.ID);
    else
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View className="flex-row">
          <FontAwesome name='edit' size={30} color={editMode ? 'red' : 'black'} onPress={() => setEditMode(!editMode)} />
          <MaterialCommunityIcons name='dots-horizontal' size={30}  onPress={onPressMenu} />
        </View>
    });
  }, [editMode]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => {
      await phrasesUnitService.getDataInTextbook(filter, filterType);
      setRefreshing(false);
    })();
  }, [filter, filterType]);
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
        <View style={StylesApp.rowLeft}>
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
          data={phrasesUnitService.unitPhrases}
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
      {showDetail && <PhrasesUnitDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
      {showBatchEdit && <PhrasesUnitBatchEditDialog isDialogOpened={showBatchEdit} handleCloseDialog={() => setShowBatchEdit(false)} />}
    </View>
  );
}
