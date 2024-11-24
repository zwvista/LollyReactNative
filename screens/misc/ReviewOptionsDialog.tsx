import Modal from "react-native-modal";
import { Button, Keyboard, SafeAreaView, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import * as React from "react";
import { useReducer } from "react";
import { Dropdown } from "react-native-element-dropdown";
import StylesApp from "../../components/StylesApp.ts";
import { container } from "tsyringe";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { clone } from "lodash";
import { IReviewOptions } from "../../models/misc/review-options.ts";

export default function ReviewOptionsDialog(
  {service, isDialogOpened, handleCloseDialog}: {
    service: IReviewOptions,
    isDialogOpened: boolean,
    handleCloseDialog: (ok: boolean) => void
  }
) {
  const settingsService = container.resolve(SettingsService);
  const [options,] = React.useState(clone(service.options));
  const reviewModes = settingsService.reviewModes.map(v => ({label: v, value: v}));
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (id: string) => (e: any) => {
    (options as any)[id] = e;
    forceUpdate();
  };

  const save = () => {
    service.options = clone(options);
    handleCloseDialog(true);
  };

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="p-2 bg-white">
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <View style={{marginRight: 8}}>
              <Button title="Cancel" onPress={() => handleCloseDialog(false)} />
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
            onChange={e => handleChange("mode")(e.value)}
          />
          <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="Order(Shuffled):"
            isChecked={options.shuffled}
            onPress={handleChange("shuffled")}
          />
          <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="Speak(Enabled):"
            isChecked={options.speakingEnabled}
            onPress={handleChange("speakingEnabled")}
          />
          <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="On Repeat:"
            isChecked={options.onRepeat}
            onPress={handleChange("onRepeat")}
          />
          <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="Move forward:"
            isChecked={options.moveForward}
            onPress={handleChange("moveForward")}
          />
          <Text>Interval:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.interval.toString()}
              onChangeText={handleChange("interval")}
            />
          </View>
          <Text>Group:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.groupSelected.toString()}
              onChangeText={handleChange("groupSelected")}
            />
          </View>
          <Text>Groups:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.groupCount.toString()}
              onChangeText={handleChange("groupCount")}
            />
          </View>
          <Text>Review:</Text>
          <View className="w-full">
            <TextInput
              style={StylesApp.textinput}
              keyboardType="numeric"
              value={options.reviewCount.toString()}
              onChangeText={handleChange("reviewCount")}
            />
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
