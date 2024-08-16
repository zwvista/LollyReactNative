import { Button, Modal, Text, TextInput, View } from "react-native";
import { container } from "tsyringe";
import { useReducer, useState } from "react";
import { WordsUnitService } from "../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { MUnitWord } from "../models/wpp/unit-word.ts";
import * as React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { MSelectItem } from "../common/selectitem.ts";
import { stylesApp } from "../App.tsx";

export default function WordsUnitDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
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
            <Text>UNIT:</Text>
          </View>
          <View style={{width: '70%'}}>
            <Dropdown
            style={stylesApp.dropdown}
              labelField="label"
              valueField="value"
              value={settingsService.units.find(o => o.value === item.UNIT)}
              data={settingsService.units}
              onChange={onUnitChange}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PART:</Text>
          </View>
          <View style={{width: '70%'}}>
            <Dropdown
            style={stylesApp.dropdown}
              labelField="label"
              valueField="value"
              value={settingsService.parts.find(o => o.value === item.PART)}
              data={settingsService.parts}
              onChange={onPartChange}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>SEQNUM:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.SEQNUM.toString()} onChangeText={e => onChangeTextInput("SEQNUM", e)} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>WORDID:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.WORDID.toString()} editable={false} />
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
