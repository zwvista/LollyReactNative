import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { MReviewOptions } from "../../models/misc/review-options.ts";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import { container } from "tsyringe";
import WordsReviewService from "../../view-models/words/words-review.service.ts";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import StylesApp from "../../components/StylesApp.ts";

export default function WordsReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const options = new MReviewOptions();
  const handleCloseDialog = async (ok: boolean) => {
    setShowOptions(false);
    if (ok) await service.newTest();
  };
  const service = container.resolve(WordsReviewService);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <FontAwesome name='circle-plus' size={30} onPress={() => setShowOptions(true)} />
    });
  }, []);

  return (
    <View className="p-4">
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
      <View className="flex-row">
        <View>
          <Button title="Speak" onPress={() => {}} />
        </View>
        <View className="grow">
          <BouncyCheckbox
            text="Speak"
            isChecked={service.isSpeaking}
            onPress={() => {}}
          />
        </View>
        <View>
          <Button title={service.checkNextStringRes} onPress={() => {}} />
        </View>
      </View>
      <View className="flex-row">
        <View className="grow">
          {service.onRepeatVisible && <BouncyCheckbox
            text="On Repeat"
            isChecked={service.onRepeat}
            onPress={() => {}}
          />}
        </View>
        <View className="grow">
          {service.moveForwardVisible && <BouncyCheckbox
              text="Forward"
              isChecked={service.moveForward}
              onPress={() => {}}
          />}
        </View>
        <View>
          <Button title={service.checkPrevStringRes} onPress={() => {}} />
        </View>
      </View>
      <View className="justify-items-center">
        {service.wordHintVisible && <Text>{service.wordHintString}</Text>}
        {service.noteTargetVisible && <Text>{service.noteTargetString}</Text>}
        <Text>{service.translationString}</Text>
        <TextInput
          style={StylesApp.textinput}
          value={service.wordInputString}
          onChangeText={e => {}}
        />
      </View>
      {showOptions && <ReviewOptionsDialog options={options} isDialogOpened={showOptions} handleCloseDialog={handleCloseDialog} />}
    </View>
  );
}
