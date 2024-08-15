import { Modal, Text, TextInput, View } from "react-native";
import { container } from "tsyringe";
import { useReducer, useState } from "react";
import { WordsUnitService } from "../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { MUnitWord } from "../models/wpp/unit-word.ts";
import DropDownPicker from "react-native-dropdown-picker";
import * as React from "react";

export default function WordsUnitDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsUnitService.unitWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MUnitWord : wordsUnitService.newUnitWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return (
    <Modal visible={isDialogOpened} onRequestClose={handleCloseDialog}>
      <View style={{flexDirection: "row"}}>
        <View style={{width: '30%'}}>
          <Text>ID:</Text>
        </View>
        <View style={{flexGrow: 1}}>
          <TextInput id="ID" value={item.ID.toString()} />
        </View>
      </View>
    </Modal>
  );
}
