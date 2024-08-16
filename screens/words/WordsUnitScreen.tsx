import { Button, FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import WordsUnitDetailDialog from "./WordsUnitDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome.js";
import { MSelectItem } from "../../common/selectitem.ts";
import { applyStyle } from "react-native-reanimated/lib/typescript/screenTransition/styleUpdater";

export default function WordsUnitScreen({ navigation }:any) {
  const wordsUnitService = container.resolve(WordsUnitService);
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={() => showDetailDialog(0)} title="Add" />
    });
  }, []);

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
        data={wordsUnitService.unitWords}
        renderItem={({item, index}) =>
          <TouchableWithoutFeedback onPress={ () => navigation.navigate("Word Dictionary", {
            words: wordsUnitService.unitWords.map(o => ({value: o.WORD})),
            wordIndex: index,
          })}>
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
            <TouchableWithoutFeedback onPress={ () => showDetailDialog(item.ID)}>
              <FontAwesome name='chevron-right' size={20} />
            </TouchableWithoutFeedback>
          </View>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <WordsUnitDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
