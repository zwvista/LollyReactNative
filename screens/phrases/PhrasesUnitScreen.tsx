import { FlatList, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PhrasesUnitService } from "../../view-models/wpp/phrases-unit.service.ts";
import PhrasesUnitDetailDialog from "./PhrasesUnitDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import stylesApp from "../../components/StylesApp.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import Clipboard from '@react-native-clipboard/clipboard';

export default function PhrasesUnitScreen({ navigation }:any) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
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
        "Batch Edit",
        "Cancel"
      ],
      cancelButtonIndex: 2
    }, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          // Add
          showDetailDialog(0);
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
    }, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 1:
          // Edit
          showDetailDialog(item.ID);
          break;
        case 2:
          // Copy Phrase
          Clipboard.setString(item.PHRASE);
          break;
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View style={{flexDirection: "row"}}>
          <FontAwesome name='edit' size={30} color={editMode ? 'red' : 'black'} onPress={() => setEditMode(!editMode)} />
          <MaterialCommunityIcons name='dots-vertical' size={30}  onPress={onPressMenu} />
        </View>
    });
  }, [editMode]);

  useEffect(() => {
    (async () => {
      await phrasesUnitService.getDataInTextbook(filter, filterType);
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
            value={settingsService.phraseFilterTypes.find(o => o.value === filterType)}
            data={settingsService.phraseFilterTypes}
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
          data={phrasesUnitService.unitPhrases}
          renderItem={({item}) =>
            <TouchableNativeFeedback
              onPress={() => onPressItem(item)}
              onLongPress={() => onLongPressItem(item)}
            >
              <View style={stylesApp.row}>
                <View>
                  <Text style={stylesApp.unitPart}>{item.UNITSTR}</Text>
                  <Text style={stylesApp.unitPart}>{item.PARTSTR}</Text>
                  <Text style={stylesApp.unitPart}>{item.SEQNUM}</Text>
                </View>
                <View style={{flexGrow: 1}}>
                  <Text style={stylesApp.itemText1}>{item.PHRASE}</Text>
                  <Text style={stylesApp.itemText2}>{item.TRANSLATION}</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          }
        />
      </View>
      {showDetail && <PhrasesUnitDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
