import { Button, Modal, Text, TextInput, View } from "react-native";
import { useCallback, useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import DropDownPicker from "react-native-dropdown-picker";
import * as React from "react";
import { PhrasesUnitService } from "../view-models/wpp/phrases-unit.service.ts";
import { MUnitPhrase } from "../models/wpp/unit-phrase.ts";

export default function PhrasesUnitDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const [openUnit, setOpenUnit] = useState(false);
  const [openPart, setOpenPart] = useState(false);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = phrasesUnitService.unitPhrases.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MUnitPhrase : phrasesUnitService.newUnitPhrase());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onOpenUnit = useCallback(() => {
    setOpenPart(false);
  }, []);

  const onOpenPart = useCallback(() => {
    setOpenUnit(false);
  }, []);

  const onUnitChange = (e: any) => {
    item.UNIT = e(item.UNIT);
    forceUpdate();
  };

  const onPartChange = (e: any) => {
    item.PART = e(item.PART);
    forceUpdate();
  };

  const onChangeTextInput = (id: string, e: string) => {
    (item as any)[id] = e;
    forceUpdate();
  }

  const save = async () => {
    item.PHRASE = settingsService.autoCorrectInput(item.PHRASE);
    await (item.ID ? phrasesUnitService.update(item) : phrasesUnitService.create(item));
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
        <View style={{flexDirection: "row", alignItems: "center", zIndex: 3}}>
          <View style={{width: '30%'}}>
            <Text>UNIT:</Text>
          </View>
          <View style={{width: '70%'}}>
            <DropDownPicker
              open={openUnit}
              onOpen={onOpenUnit}
              value={item.UNIT}
              items={settingsService.units}
              setOpen={setOpenUnit}
              setValue={onUnitChange}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center", zIndex: 2}}>
          <View style={{width: '30%'}}>
            <Text>PART:</Text>
          </View>
          <View style={{width: '70%'}}>
            <DropDownPicker
              open={openPart}
              onOpen={onOpenPart}
              value={item.PART}
              items={settingsService.parts}
              setOpen={setOpenPart}
              setValue={onPartChange}
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
            <Text>PHRASEID:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.PHRASEID.toString()} editable={false} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>PHRASE:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput id="WORD" value={item.PHRASE} onChangeText={e => onChangeTextInput("PHRASE", e)} />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View style={{width: '30%'}}>
            <Text>TRANSLATION:</Text>
          </View>
          <View style={{width: '70%'}}>
            <TextInput value={item.TRANSLATION} onChangeText={e => onChangeTextInput("TRANSLATION", e)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
