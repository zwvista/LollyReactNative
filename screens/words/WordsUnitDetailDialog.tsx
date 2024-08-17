import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { container } from "tsyringe";
import { useReducer, useState } from "react";
import { WordsUnitService } from "../../view-models/wpp/words-unit.service.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import * as React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { MSelectItem } from "../../common/selectitem.ts";
import { DetailDialogProps, stylesApp } from "../../App.tsx";
import Modal from "react-native-modal";

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
        <SafeAreaView style={{padding: 8, backgroundColor: 'white'}}>
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <View style={{marginRight: 8}}>
              <Button title="Cancel" onPress={handleCloseDialog} />
            </View>
            <Button title="Save" onPress={save} />
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>ID:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.ID.toString()}
                editable={false}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>UNIT:</Text>
            </View>
            <View style={stylesApp.rowRight}>
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
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>PART:</Text>
            </View>
            <View style={stylesApp.rowRight}>
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
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>SEQNUM:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                keyboardType="numeric"
                value={item.SEQNUM.toString()}
                onChangeText={e => onChangeTextInput("SEQNUM", e)}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>WORDID:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.WORDID.toString()}
                editable={false}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>WORD:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.WORD}
                onChangeText={e => onChangeTextInput("WORD", e)}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>NOTE:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.NOTE}
                onChangeText={e => onChangeTextInput("NOTE", e)}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>FAMIID:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.FAMIID.toString()}
                editable={false}
              />
            </View>
          </View>
          <View style={stylesApp.row}>
            <View style={stylesApp.rowLeft}>
              <Text>ACCURACY:</Text>
            </View>
            <View style={stylesApp.rowRight}>
              <TextInput
                style={stylesApp.textinput}
                value={item.ACCURACY}
                editable={false}
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
