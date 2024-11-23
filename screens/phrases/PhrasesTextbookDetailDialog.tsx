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

  const handleChange = (id: string) => (e: any) => {
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
            onChange={e => handleChange("UNIT")(e.value)}
          />
          <Text>PART:</Text>
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.parts.find(o => o.value === item.PART)}
            data={settingsService.parts}
            onChange={e => handleChange("PART")(e.value)}
          />
          <Text>SEQNUM:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={item.SEQNUM.toString()}
              onChangeText={handleChange("SEQNUM")}
            />
          </View>
          <Text>PHRASEID: {item.PHRASEID}</Text>
          <Text>PHRASE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.PHRASE}
              onChangeText={handleChange("PHRASE")}
            />
          </View>
          <Text>NOTE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.TRANSLATION}
              onChangeText={handleChange("TRANSLATION")}
            />
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
