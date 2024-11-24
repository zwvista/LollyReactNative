import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import { container } from "tsyringe";
import WordsReviewService from "../../view-models/words/words-review.service.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import StylesApp from "../../components/StylesApp.ts";
import { SettingsService } from "../../view-models/misc/settings.service.ts";

export default function WordsReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const handleCloseDialog = async (ok: boolean) => {
    setShowOptions(false);
    if (ok) await service.newTest();
  };
  const settingsService = container.resolve(SettingsService);
  const service = container.resolve(WordsReviewService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (id: string) => (e: any) => {
    (service as any)[id] = e;
    forceUpdate();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <FontAwesome name='circle-arrow-down' size={30} onPress={() => setShowOptions(true)} />
    });
    service.onTestUpdated = () => forceUpdate();
    return () => {
      service.onTestUpdated = undefined;
      service.stopTimer();
    }
  }, []);

  return (
    <View className="flex-grow p-4">
      <View className="flex-row">
        <View>
          {service.indexVisible && (<Text>{service.indexString}</Text>)}
        </View>
        <View className="grow justify-center items-center">
          {service.accuracyVisible && (<Text>{service.accuracyString}</Text>)}
        </View>
        <View>
          {service.correctVisible && <Text className="font-bold text-green-500">Correct</Text>}
          {service.incorrectVisible && <Text className="font-bold text-red-500">Incorrect</Text>}
        </View>
      </View>
      <View className="flex-row pt-2">
        <View>
          <Button title="Speak" onPress={() => settingsService.speak(service.currentWord)} />
        </View>
        <View className="grow justify-center items-center">
          <BouncyCheckbox
            className="flex-none items-center"
            textStyle={{textDecorationLine: "none"}}
            textContainerStyle={{flex: 0, marginLeft: 16}}
            text="Speak"
            isChecked={service.isSpeaking}
            onPress={handleChange("isSpeaking")}
          />
        </View>
        <View>
          <Button title={service.checkNextStringRes} onPress={() => service.check(true)} />
        </View>
      </View>
      <View className="flex-row pt-2">
        <View className="grow justify-center">
          {service.onRepeatVisible && <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="On Repeat"
            isChecked={service.onRepeat}
            onPress={handleChange("onRepeat")}
          />}
        </View>
        <View className="grow justify-center">
          {service.moveForwardVisible && <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="Forward"
            isChecked={service.moveForward}
            onPress={handleChange("moveForward")}
          />}
        </View>
        <View>
          {service.checkPrevVisible && <Button title={service.checkPrevStringRes} onPress={() => service.check(false)} />}
        </View>
      </View>
      <View className="grow justify-center">
        <View className="items-center">
          {service.wordTargetVisible && <Text className="text-4xl">{service.wordTargetString}</Text>}
          {service.noteTargetVisible && <Text className="text-3xl pt-2">{service.noteTargetString}</Text>}
          {service.wordHintVisible && <Text className="text-3xl pt-2">{service.wordHintString}</Text>}
        </View>
        <View className="flex-row pt-2">
          <Text>{service.translationString}</Text>
        </View>
        <View className="flex-row pt-2">
          <TextInput
            className="grow"
            style={StylesApp.textinput}
            value={service.wordInputString}
            onChangeText={handleChange("wordInputString")}
          />
        </View>
      </View>
      {showOptions && <ReviewOptionsDialog service={service} isDialogOpened={showOptions} handleCloseDialog={handleCloseDialog} />}
    </View>
  );
}
