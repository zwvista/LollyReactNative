import { View } from "react-native";
import * as React from "react";
import { useState } from "react";
import { MReviewOptions } from "../../models/misc/review-options.ts";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";

export default function WordsReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const options = new MReviewOptions();
  return (
    <View>

      {showOptions && <ReviewOptionsDialog options={options} isDialogOpened={showOptions} handleCloseDialog={() => setShowOptions(false)} />}
    </View>
  );
}
