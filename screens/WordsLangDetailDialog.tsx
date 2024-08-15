import { Button, Modal, Text, TextInput, View } from "react-native";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import * as React from "react";
import { WordsLangService } from "../view-models/wpp/words-lang.service.ts";
import { MLangWord } from "../models/wpp/lang-word.ts";

export default function WordsLangDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsLangService.langWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.newLangWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeTextInput = (id: string, e: string) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsLangService.update(item) : wordsLangService.create(item));
    handleCloseDialog();
  };

  return (
    <Modal visible={isDialogOpened} onRequestClose={handleCloseDialog}>
      <View style={{padding: 8}}>
        <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
          <View style={{marginRight: 8}}>
            <Button title="Cancel" onPress={handleCloseDialog} />
          </View>
          <Button title="Save" onPress={save} />
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>ID:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.ID.toString()} editable={false} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>WORD:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput id="WORD" value={item.WORD} onChangeText={e => onChangeTextInput("WORD", e)} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>NOTE:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.NOTE} onChangeText={e => onChangeTextInput("NOTE", e)} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>FAMIID:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.FAMIID.toString()} editable={false} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>ACCURACY:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.ACCURACY} editable={false} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
