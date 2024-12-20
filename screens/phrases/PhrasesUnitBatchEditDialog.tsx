import Modal from "react-native-modal";
import { Button, FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import stylesApp from "../../components/StylesApp.ts";
import * as React from "react";
import { useReducer, useState } from "react";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { PhrasesUnitService } from "../../view-models/phrases/phrases-unit.service.ts";
import PhrasesUnitBatchEditService from "../../view-models/phrases/phrases-unit-batch-edit.service.ts";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";

export default function PhrasesUnitBatchEditDialog(
  {isDialogOpened, handleCloseDialog}: {isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const settingsService = container.resolve(SettingsService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const [phrasesUnitBatchEditService] = useState(new PhrasesUnitBatchEditService(phrasesUnitService, settingsService));
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (id: string) => (e: any) => {
    (phrasesUnitBatchEditService as any)[id] = e;
    forceUpdate();
  };

  const onPressItem = (item: MUnitPhrase) => {
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
              <Button title="Save" onPress={phrasesUnitBatchEditService.save} />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="UNIT:"
                isChecked={phrasesUnitBatchEditService.unitChecked}
                onPress={handleChange("unitChecked")}
              />
              <Dropdown
                style={[StylesApp.dropdown, !phrasesUnitBatchEditService.unitChecked && StylesApp.dropdownDisable]}
                // @ts-ignore
                className="grow"
                labelField="label"
                valueField="value"
                value={settingsService.units.find(o => o.value === phrasesUnitBatchEditService.unit)}
                data={settingsService.units}
                onChange={e => handleChange("unit")(e.value)}
                disable={!phrasesUnitBatchEditService.unitChecked}
              />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="PART:"
                isChecked={phrasesUnitBatchEditService.partChecked}
                onPress={handleChange("partChecked")}
              />
              <Dropdown
                style={[StylesApp.dropdown, !phrasesUnitBatchEditService.partChecked && StylesApp.dropdownDisable]}
                // @ts-ignore
                className="grow"
                labelField="label"
                valueField="value"
                value={settingsService.parts.find(o => o.value === phrasesUnitBatchEditService.part)}
                data={settingsService.parts}
                onChange={e => handleChange("part")(e.value)}
                disable={!phrasesUnitBatchEditService.partChecked}
              />
            </View>
            <View style={stylesApp.row}>
              <BouncyCheckbox
                textStyle={{textDecorationLine: "none"}}
                className="w-1/3"
                text="SEQNUM (+):"
                isChecked={phrasesUnitBatchEditService.seqnumChecked}
                onPress={handleChange("seqnumChecked")}
              />
              <TextInput
                style={StylesApp.textinput}
                className="grow"
                keyboardType="numeric"
                value={phrasesUnitBatchEditService.seqnum.toString()}
                onChangeText={handleChange("seqnum")}
                readOnly={!phrasesUnitBatchEditService.seqnumChecked}
              />
            </View>
            <View className="grow">
              <FlatList
                keyExtractor={item => item.ID.toString()}
                ItemSeparatorComponent={(props) =>
                  <View style={{height: 1, backgroundColor: 'gray'}} />
                }
                data={phrasesUnitService.unitPhrases}
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
                        <Text style={StylesApp.itemText1}>{item.PHRASE}</Text>
                        <Text style={StylesApp.itemText2}>{item.TRANSLATION}</Text>
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
