import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { container } from "tsyringe";
import * as React from "react";
import { useReducer, useState } from "react";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import { Dropdown } from "react-native-element-dropdown";
import { MSelectItem } from "../../common/selectitem.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function WordsUnitDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsUnitService.unitWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MUnitWord : wordsUnitService.newUnitWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onUnitChange = (e: MSelectItem) => {
    item.UNIT = e.value;
    forceUpdate();
  };

  const onPartChange = (e: MSelectItem) => {
    item.PART = e.value;
    forceUpdate();
  };

  const onChangeTextInput = (id: string, e: string) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsUnitService.update(item) : wordsUnitService.create(item));
    handleCloseDialog();
  };

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="p-2 bg-white">
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <View style={{marginRight: 8}}>
              <Button title="Cancel" onPress={handleCloseDialog} />
            </View>
            <Button title="Save" onPress={save} />
          </View>
          <Text>ID: {item.ID}</Text>
          <Text>UNIT:</Text>
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.units.find(o => o.value === item.UNIT)}
            data={settingsService.units}
            onChange={onUnitChange}
          />
          <Text>PART:</Text>
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.parts.find(o => o.value === item.PART)}
            data={settingsService.parts}
            onChange={onPartChange}
          />
          <Text>SEQNUM:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={item.SEQNUM.toString()}
              onChangeText={e => onChangeTextInput("SEQNUM", e)}
            />
          </View>
          <Text>WORDID: {item.WORDID}</Text>
          <Text>WORD:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.WORD}
              onChangeText={e => onChangeTextInput("WORD", e)}
            />
          </View>
          <Text>NOTE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.NOTE}
              onChangeText={e => onChangeTextInput("NOTE", e)}
            />
          </View>
          <Text>FAMIID: {item.FAMIID}</Text>
          <Text>ACCURACY: {item.ACCURACY}</Text>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
