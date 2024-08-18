import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import * as React from "react";
import { PhrasesLangService } from "../../view-models/wpp/phrases-lang.service.ts";
import { MLangPhrase } from "../../models/wpp/lang-phrase.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import StylesApp from "../../components/StylesApp.ts";

export default function PhrasesLangDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const phrasesLangService = container.resolve(PhrasesLangService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = phrasesLangService.langPhrases.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MLangPhrase : phrasesLangService.newLangPhrase());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeTextInput = (id: string, e: string) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.PHRASE = settingsService.autoCorrectInput(item.PHRASE);
    await (item.ID ? phrasesLangService.update(item) : await phrasesLangService.create(item));
    handleCloseDialog();
  };

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{padding: 8, backgroundColor: 'white'}}>
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <View style={{marginRight: 8}}>
              <Button title="Cancel" onPress={handleCloseDialog} />
            </View>
            <Button title="Save" onPress={save} />
          </View>
          <View style={StylesApp.row}>
            <View style={StylesApp.rowLeft}>
              <Text>ID:</Text>
            </View>
            <View style={StylesApp.rowRight}>
              <TextInput
                style={StylesApp.textinput}
                value={item.ID.toString()}
                editable={false}
              />
            </View>
          </View>
          <View style={StylesApp.row}>
            <View style={StylesApp.rowLeft}>
              <Text>PHRASE:</Text>
            </View>
            <View style={StylesApp.rowRight}>
              <TextInput
                style={StylesApp.textinput}
                value={item.PHRASE}
                onChangeText={e => onChangeTextInput("PHRASE", e)}
              />
            </View>
          </View>
          <View style={StylesApp.row}>
            <View style={StylesApp.rowLeft}>
              <Text>TRANSLATION:</Text>
            </View>
            <View style={StylesApp.rowRight}>
              <TextInput
                style={StylesApp.textinput}
                value={item.TRANSLATION}
                onChangeText={e => onChangeTextInput("TRANSLATION", e)}
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
