import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { PhrasesUnitService } from "../../view-models/phrases/phrases-unit.service.ts";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";
import { Dropdown } from "react-native-element-dropdown";
import { MSelectItem } from "../../common/selectitem.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function PhrasesTextbookDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const [item] = useState(Object.create(phrasesUnitService.textbookPhrases.find(value => value.ID === id)!) as MUnitPhrase);
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
    item.PHRASE = settingsService.autoCorrectInput(item.PHRASE);
    await phrasesUnitService.update(item);
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
          <Text>TEXTBOOK: {item.TEXTBOOKNAME}</Text>
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
          <Text>PHRASEID: {item.PHRASEID}</Text>
          <Text>PHRASE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.PHRASE}
              onChangeText={e => onChangeTextInput("PHRASE", e)}
            />
          </View>
          <Text>NOTE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.TRANSLATION}
              onChangeText={e => onChangeTextInput("TRANSLATION", e)}
            />
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
