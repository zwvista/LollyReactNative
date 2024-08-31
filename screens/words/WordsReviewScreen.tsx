import { View } from "react-native";
import { useState } from "react";
import { MReviewOptions } from "../../models/misc/review-options.ts";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import * as React from "react";

export default function WordsReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const options = new MReviewOptions();
  return (
    <View>

      {showOptions && <ReviewOptionsDialog options={options} isDialogOpened={showOptions} handleCloseDialog={() => setShowOptions(false)} />}
    </View>
  );
}
