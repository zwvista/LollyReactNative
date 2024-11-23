import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { WordsLangService } from "../../view-models/words/words-lang.service.ts";
import { MLangWord } from "../../models/wpp/lang-word.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function WordsLangDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsLangService.langWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.newLangWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (id: string, e: any) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsLangService.update(item) : wordsLangService.create(item));
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
          <Text>WORD:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.WORD}
              onChangeText={e => handleChange("WORD", e)}
            />
          </View>
          <Text>NOTE:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              value={item.NOTE}
              onChangeText={e => handleChange("NOTE", e)}
            />
          </View>
          <Text>FAMIID: {item.FAMIID}</Text>
          <Text>ACCURACY: {item.ACCURACY}</Text>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
