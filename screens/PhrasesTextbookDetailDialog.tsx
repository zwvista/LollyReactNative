import { Button, Modal, SafeAreaView, Text, TextInput, View } from "react-native";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import * as React from "react";
import { PhrasesUnitService } from "../view-models/wpp/phrases-unit.service.ts";
import { MUnitPhrase } from "../models/wpp/unit-phrase.ts";
import { Dropdown } from "react-native-element-dropdown";
import { MSelectItem } from "../common/selectitem.ts";
import { stylesApp } from "../App.tsx";

export default function PhrasesTextbookDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
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
    <Modal visible={isDialogOpened} onRequestClose={handleCloseDialog}>
      <SafeAreaView style={{padding: 8}}>
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
            <TextInput
              style={stylesApp.textinput}
              value={item.ID.toString()}
              editable={false}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>TEXTBOOK:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.TEXTBOOKNAME}
              editable={false}
            />
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
            <TextInput
              style={stylesApp.textinput}
              value={item.SEQNUM.toString()}
              onChangeText={e => onChangeTextInput("SEQNUM", e)}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PHRASEID:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.PHRASEID.toString()}
              editable={false}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PHRASE:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.PHRASE}
              onChangeText={e => onChangeTextInput("PHRASE", e)}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>TRANSLATION:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.TRANSLATION}
              onChangeText={e => onChangeTextInput("TRANSLATION", e)}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
