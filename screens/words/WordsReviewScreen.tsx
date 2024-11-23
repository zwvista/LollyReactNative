import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import { container } from "tsyringe";
import WordsReviewService from "../../view-models/words/words-review.service.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import StylesApp from "../../components/StylesApp.ts";

export default function WordsReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const handleCloseDialog = async (ok: boolean) => {
    setShowOptions(false);
    if (ok) await service.newTest();
  };
  const service = container.resolve(WordsReviewService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeCheckBox = (id: string, e: boolean) => {
    (service as any)[id] = e;
    forceUpdate();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <FontAwesome name='circle-plus' size={30} onPress={() => setShowOptions(true)} />
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
        <View className="grow">
          {service.accuracyVisible && (<Text>{service.accuracyString}</Text>)}
        </View>
        <View>
          {service.correctVisible && <Text className="font-bold text-green-500">Correct</Text>}
          {service.incorrectVisible && <Text className="font-bold text-red-500">Incorrect</Text>}
        </View>
      </View>
      <View className="flex-row pt-2">
        <View>
          <Button title="Speak" onPress={() => {}} />
        </View>
        <View className="flex-grow justify-center items-center">
          <BouncyCheckbox
            className="flex-none items-center"
            textStyle={{textDecorationLine: "none"}}
            textContainerStyle={{flex: 0, marginLeft: 16}}
            text="Speak"
            isChecked={service.isSpeaking}
            onPress={e => onChangeCheckBox("isSpeaking", e)}
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
            onPress={e => onChangeCheckBox("onRepeat", e)}
          />}
        </View>
        <View className="grow justify-center">
          {service.moveForwardVisible && <BouncyCheckbox
            textStyle={{textDecorationLine: "none"}}
            text="Forward"
            isChecked={service.moveForward}
            onPress={e => onChangeCheckBox("moveForward", e)}
          />}
        </View>
        <View>
          <Button title={service.checkPrevStringRes} onPress={() => service.check(false)} />
        </View>
      </View>
      <View className="grow justify-center">
        <View className="items-center">
          {service.wordTargetVisible && <Text className="text-4xl">{service.wordTargetString}</Text>}
          {service.noteTargetVisible && <Text className="text-3xl pt-2">{service.noteTargetString}</Text>}
        </View>
        <View className="flex-row pt-2">
          <Text>{service.translationString}</Text>
        </View>
        <View className="flex-row pt-2">
          <TextInput
            className="grow"
            style={StylesApp.textinput}
            value={service.wordInputString}
            onChangeText={e => {}}
          />
        </View>
      </View>
      {showOptions && <ReviewOptionsDialog isDialogOpened={showOptions} handleCloseDialog={handleCloseDialog} />}
    </View>
  );
}
