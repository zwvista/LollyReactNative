import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import * as React from "react";
import { AppService } from "../view-models/misc/app.service.ts";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PhrasesUnitService } from "../view-models/wpp/phrases-unit.service.ts";
import DropDownPicker from "react-native-dropdown-picker";

export default function PhrasesUnitScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    (async () => {
      await phrasesUnitService.getDataInTextbook(filter, filterType);
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
    <View style={{flexDirection: "row", padding: 8}}>
      <View style={{flexGrow: 1}}>
        <TextInput
          value={filter} onChangeText={setFilter}
        />
      </View>
      <View style={{width: '30%'}}>
        <DropDownPicker
          open={open}
          value={filterType}
          items={settingsService.phraseFilterTypes}
          setOpen={setOpen}
          setValue={setFilterType}
        />
      </View>
      <FlatList
        data={phrasesUnitService.unitPhrases}
        renderItem={({item}) => <Text style={styles.item}>{item.PHRASE}</Text>}
      />
    </View>
  );
}
