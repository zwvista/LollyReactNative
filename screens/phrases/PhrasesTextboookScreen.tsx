import { FlatList, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PhrasesUnitService } from "../../view-models/wpp/phrases-unit.service.ts";
import PhrasesTextbookDetailDialog from "./PhrasesTextbookDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";

export default function PhrasesTextbookScreen({ navigation }:any) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
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
  };

  const onLongPressItem = (item: MUnitPhrase) => {
    showActionSheetWithOptions({
      options: [
        "Delete",
        "Edit",
        "Retrieve Note",
        "Clear Note",
        "Copy Word",
        "Google Word",
        "Cancel"
      ],
      cancelButtonIndex: 6,
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View style={{flexDirection: "row"}}>
          <TouchableWithoutFeedback onPress={() => setEditMode(!editMode)}>
            <FontAwesome name='edit' size={30} color={editMode ? 'red' : 'black'} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onPressMenu}>
            <MaterialCommunityIcons name='dots-vertical' size={30} color='blue' />
          </TouchableWithoutFeedback>
        </View>
    });
  }, [editMode]);

  useEffect(() => {
    (async () => {
      await phrasesUnitService.getDataInLang(filter, filterType, textbookFilter);
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
            onChange={item => setTextbookFilter(item.value)}
          />
        </View>
        <View style={{width: '50%'}}>
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
      <FlatList
        ItemSeparatorComponent={(props) =>
          <View style={{height: 1, backgroundColor: 'gray'}} />
        }
        data={phrasesUnitService.textbookPhrases}
        renderItem={({item}) =>
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
                <Text style={stylesApp.itemtext1}>{item.PHRASE}</Text>
                <Text style={stylesApp.itemtext2}>{item.TRANSLATION}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <PhrasesTextbookDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
