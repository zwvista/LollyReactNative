import { Button, Modal, Text, TextInput, View } from "react-native";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import * as React from "react";
import { PatternsService } from "../view-models/wpp/patterns.service.ts";
import { MPattern } from "../models/wpp/pattern.ts";
import { stylesApp } from "../App.tsx";

export default function PatternsDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = patternsService.patterns.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MPattern : patternsService.newPattern());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeTextInput = (id: string, e: string) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.PATTERN = settingsService.autoCorrectInput(item.PATTERN);
    await (item.ID ? patternsService.update(item) : patternsService.create(item));
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
            <TextInput
              style={stylesApp.textinput}
              value={item.ID.toString()}
              editable={false}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PATTERN:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.PATTERN}
              onChangeText={e => onChangeTextInput("PATTERN", e)}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>NOTE:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.NOTE}
              onChangeText={e => onChangeTextInput("NOTE", e)}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>TAGS:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={stylesApp.textinput}
              value={item.TAGS}
              onChangeText={e => onChangeTextInput("TAGS", e)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
