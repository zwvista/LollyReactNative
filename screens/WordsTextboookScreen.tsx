import { Button, FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { AppService } from "../view-models/misc/app.service.ts";
import { container } from "tsyringe";
import { WordsUnitService } from "../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import WordsTextbookDetailDialog from "./WordsTextbookDetailDialog.tsx";
import { Dropdown } from "react-native-element-dropdown";
import { stylesApp } from "../App.tsx";

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

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await wordsUnitService.getDataInLang(filter, filterType, textbookFilter);
      forceUpdate();
    })();
  }, [refreshCount]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

  return (
    <View style={{padding: 8}}>
      <View style={{flexDirection: "row"}}>
        <View style={{flexGrow: 1}}>
          <TextInput value={filter} onChangeText={setFilter}/>
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
            value={settingsService.wordFilterTypes.find(o => o.value === filterType)}
            data={settingsService.wordFilterTypes}
            onChange={item => setFilterType(item.value)}
          />
        </View>
      </View>
      <FlatList
        data={wordsUnitService.textbookWords}
        renderItem={({item}) =>
          <TouchableWithoutFeedback onPress={() => showDetailDialog(item.ID)}>
            <Text style={styles.item}>{item.WORD}</Text>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <WordsTextbookDetailDialog id={detailId} isDialogOpened={showDetail}
                                                handleCloseDialog={() => setShowDetail(false)}/>}
    </View>
  );
}
