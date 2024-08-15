import { FlatList, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { AppService } from "../view-models/misc/app.service.ts";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { WordsLangService } from "../view-models/wpp/words-lang.service.ts";
import DropDownPicker from "react-native-dropdown-picker";

export default function WordsLangScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

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

  useEffect(() => {
    (async () => {
      // await wordsLangService.getData(filter, filterType);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <View>
      <DropDownPicker
        open={open}
        value={filterType}
        items={settingsService.wordFilterTypes}
        setOpen={setOpen}
        setValue={setFilterType}
      />
      <FlatList
        data={wordsLangService.langWords}
        renderItem={({item}) => <Text style={styles.item}>{item.WORD}</Text>}
      />
    </View>
  );
}
