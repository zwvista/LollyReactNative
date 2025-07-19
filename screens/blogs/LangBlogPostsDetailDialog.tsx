import { Button, Keyboard, SafeAreaView, Text, TouchableNativeFeedback, View } from "react-native";
import { container } from "tsyringe";
import * as React from "react";
import Modal from "react-native-modal";
import { DetailDialogProps } from "../../App.tsx";
import { LangBlogGroupsService } from "../../view-models/blogs/lang-blog-groups.service.ts";

export default function LangBlogPostsDetailDialog(
  {id, isDialogOpened, handleCloseDialog}: DetailDialogProps
) {
  const langBlogGroupsService = container.resolve(LangBlogGroupsService);
  const item = langBlogGroupsService.langBlogPosts.find(value => value.ID === id)!;

  return (
    <Modal isVisible={isDialogOpened}>
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="p-2 bg-white">
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <Button title="Close" onPress={handleCloseDialog} />
          </View>
          <Text>ID: {item.ID}</Text>
          <Text>TITLE:{item.TITLE}</Text>
          <Text>URL:{item.URL}</Text>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </Modal>
  );
}
