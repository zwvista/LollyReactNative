import { Button, FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PhrasesLangService } from "../../view-models/wpp/phrases-lang.service.ts";
import PhrasesLangDetailDialog from "./PhrasesLangDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../../App.tsx";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MSelectItem } from "../../common/selectitem.ts";

export default function PhrasesLangScreen({ navigation }:any) {
  const phrasesLangService = container.resolve(PhrasesLangService);
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
      await phrasesLangService.getData(filter, filterType);
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
        data={phrasesLangService.langPhrases}
        renderItem={({item}) =>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <View style={{flexGrow: 1}}>
              <Text style={stylesApp.itemtext1}>{item.PHRASE}</Text>
              <Text style={stylesApp.itemtext2}>{item.TRANSLATION}</Text>
            </View>
            <TouchableWithoutFeedback onPress={ () => showDetailDialog(item.ID)}>
              <FontAwesome name='chevron-right' size={20} />
            </TouchableWithoutFeedback>
          </View>
        }
      />
      {showDetail && <PhrasesLangDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
