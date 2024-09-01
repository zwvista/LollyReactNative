import { Button, Keyboard, SafeAreaView, Text, TouchableNativeFeedback, View } from "react-native";
import { container } from "tsyringe";
import * as React from "react";
import { OnlineTextbooksService } from "../../view-models/misc/onlinetextbooks.service.ts";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";

export default function OnlineTextbooksDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const onlineTextbooksService = container.resolve(OnlineTextbooksService);
  const item = onlineTextbooksService.onlineTextbooks.find(value => value.ID === id)!;

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="p-2 bg-white">
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <Button title="Close" onPress={handleCloseDialog} />
          </View>
          <Text>ID: {item.ID}</Text>
          <Text>TEXTBOOK:{item.TEXTBOOKNAME}</Text>
          <Text>UNIT:{item.UNIT}</Text>
          <Text>TITLE:{item.TITLE}</Text>
          <Text>URL:{item.URL}</Text>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
