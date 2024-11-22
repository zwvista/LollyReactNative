import Modal from "react-native-modal";
import { Button, FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import stylesApp from "../../components/StylesApp.ts";
import * as React from "react";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MSelectItem } from "../../common/selectitem.ts";
import { WordsUnitService } from "../../view-models/words/words-unit.service.ts";
import WordsUnitBatchEditService from "../../view-models/words/words-unit-batch-edit.service.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function WordsUnitBatchEditDialog(
  {isDialogOpened, handleCloseDialog}: {isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const settingsService = container.resolve(SettingsService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const [wordsUnitBatchEditService] = useState(new WordsUnitBatchEditService(wordsUnitService, settingsService));
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeCheckBox = (id: string, e: boolean) => {
    (wordsUnitBatchEditService as any)[id] = e;
    forceUpdate();
  };
  const onUnitChange = (e: MSelectItem) => {
    wordsUnitBatchEditService.unit = e.value;
    forceUpdate();
  };
  const onPartChange = (e: MSelectItem) => {
    wordsUnitBatchEditService.part = e.value;
    forceUpdate();
  };
  const onSeqnumChange = (e: string) => {
    wordsUnitBatchEditService.seqnum = +e;
    forceUpdate();
  };

  const onPressItem = (item: MUnitWord) => {
    item.isChecked = !item.isChecked;
    forceUpdate();
  };

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1">
          <View className="p-2 bg-white">
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
              <View style={{marginRight: 8}}>
                <Button title="Cancel" onPress={handleCloseDialog} />
              </View>
              <Button title="Save" onPress={wordsUnitBatchEditService.save} />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="UNIT:"
                isChecked={wordsUnitBatchEditService.unitChecked}
                onPress={e => onChangeCheckBox("unitChecked", e)}
              />
              <Dropdown
                style={[StylesApp.dropdown, !wordsUnitBatchEditService.unitChecked && StylesApp.dropdownDisable]}
                // @ts-ignore
                className="grow"
                labelField="label"
                valueField="value"
                value={settingsService.units.find(o => o.value === wordsUnitBatchEditService.unit)}
                data={settingsService.units}
                onChange={onUnitChange}
                disable={!wordsUnitBatchEditService.unitChecked}
              />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="PART:"
                isChecked={wordsUnitBatchEditService.partChecked}
                onPress={e => onChangeCheckBox("partChecked", e)}
              />
              <Dropdown
                style={[StylesApp.dropdown, !wordsUnitBatchEditService.partChecked && StylesApp.dropdownDisable]}
                // @ts-ignore
                className="grow"
                labelField="label"
                valueField="value"
                value={settingsService.parts.find(o => o.value === wordsUnitBatchEditService.part)}
                data={settingsService.parts}
                onChange={onPartChange}
                disable={!wordsUnitBatchEditService.partChecked}
              />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="SEQNUM (+):"
                isChecked={wordsUnitBatchEditService.seqnumChecked}
                onPress={e => onChangeCheckBox("seqnumChecked", e)}
              />
              <TextInput
                style={StylesApp.textinput}
                className="grow"
                keyboardType="numeric"
                value={wordsUnitBatchEditService.seqnum.toString()}
                onChangeText={e => onSeqnumChange(e)}
                readOnly={!wordsUnitBatchEditService.seqnumChecked}
              />
            </View>
            <View className="grow">
              <FlatList
                keyExtractor={item => item.ID.toString()}
                ItemSeparatorComponent={(props) =>
                  <View style={{height: 1, backgroundColor: 'gray'}} />
                }
                data={wordsUnitService.unitWords}
                renderItem={({item, index}) =>
                  <TouchableNativeFeedback
                    onPress={() => onPressItem(item)}
                  >
                    <View style={StylesApp.row}>
                      <View>
                        <Text style={StylesApp.ups}>{item.UNITSTR}</Text>
                        <Text style={StylesApp.ups}>{item.PARTSTR}</Text>
                        <Text style={StylesApp.ups}>{item.SEQNUM}</Text>
                      </View>
                      <View className="grow">
                        <Text style={StylesApp.itemText1}>{item.WORD}</Text>
                        <Text style={StylesApp.itemText2}>{item.NOTE}</Text>
                      </View>
                      {item.isChecked && <FontAwesome name='check' size={20} />}
                    </View>
                  </TouchableNativeFeedback>
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
