import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { PatternsService } from "../../view-models/patterns/patterns.service.ts";
import { MPattern } from "../../models/wpp/pattern.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function PatternsDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = patternsService.patterns.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MPattern : patternsService.newPattern());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (id: string, e: any) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.PATTERN = settingsService.autoCorrectInput(item.PATTERN);
    await (item.ID ? patternsService.update(item) : patternsService.create(item));
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
          <Text>PATTERN:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.PATTERN}
              onChangeText={e => handleChange("PATTERN", e)}
            />
          </View>
          <Text>TAGS:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.TAGS}
              onChangeText={e => handleChange("TAGS", e)}
            />
          </View>
          <Text>TITLE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.TITLE}
              onChangeText={e => handleChange("TITLE", e)}
            />
          </View>
          <Text>URL:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.URL}
              onChangeText={e => handleChange("URL", e)}
            />
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
