import { FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { AppService } from "../view-models/misc/app.service.ts";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { useEffect, useReducer, useState } from "react";
import { PatternsService } from "../view-models/wpp/patterns.service.ts";
import DropDownPicker from "react-native-dropdown-picker";
import PatternsDetailDialog from "./PatternsDetailDialog.tsx";

export default function PatternsScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await patternsService.getData(filter, filterType);
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
          <TextInput value={filter} onChangeText={setFilter} />
        </View>
        <View style={{width: '30%'}}>
          <DropDownPicker
            open={open}
            value={filterType}
            items={settingsService.patternFilterTypes}
            setOpen={setOpen}
            setValue={setFilterType}
          />
        </View>
      </View>
      <FlatList
        data={patternsService.patterns}
        renderItem={({item}) =>
          <TouchableWithoutFeedback onPress={ () => showDetailDialog(item.ID)}>
            <Text style={styles.item}>{item.PATTERN}</Text>
          </TouchableWithoutFeedback>
        }
      />
      {showDetail && <PatternsDetailDialog id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </View>
  );
}
