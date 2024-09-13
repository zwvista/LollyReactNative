import Modal from "react-native-modal";
import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useReducer } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { MReviewOptions } from "../../models/misc/review-options.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function ReviewOptionsDialog(
  {options, isDialogOpened, handleCloseDialog}: {
    options: MReviewOptions,
    isDialogOpened: boolean,
    handleCloseDialog: () => void
  }
) {
  const settingsService = container.resolve(SettingsService);
  const reviewModes = settingsService.reviewModes.map(v => ({label: v, value: v}));
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onOptionChange = (id: string, e: any) => {
    (options as any)[id] = e;
    forceUpdate();
  };

  const save = () => {

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
          <Text>Mode:</Text>
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={options.mode}
            data={reviewModes}
            onChange={e => onOptionChange("mode", e.value)}
          />
          <BouncyCheckbox
            text="Order(Shuffled):"
            isChecked={options.shuffled}
            onPress={e => onOptionChange("shuffled", e)}
          />
          <BouncyCheckbox
            text="Speak(Enabled):"
            isChecked={options.speakingEnabled}
            onPress={e => onOptionChange("speakingEnabled", e)}
          />
          <BouncyCheckbox
            text="On Repeat:"
            isChecked={options.onRepeat}
            onPress={e => onOptionChange("onRepeat", e)}
          />
          <BouncyCheckbox
            text="Move forward:"
            isChecked={options.moveForward}
            onPress={e => onOptionChange("moveForward", e)}
          />
          <Text>Interval:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.interval.toString()}
              onChangeText={e => onOptionChange("interval", e)}
            />
          </View>
          <Text>Group:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.groupSelected.toString()}
              onChangeText={e => onOptionChange("groupSelected", e)}
            />
          </View>
          <Text>Groups:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.groupCount.toString()}
              onChangeText={e => onOptionChange("groupCount", e)}
            />
          </View>
          <Text>Review:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.reviewCount.toString()}
              onChangeText={e => onOptionChange("reviewCount", e)}
            />
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
