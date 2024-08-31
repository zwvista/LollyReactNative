import { View } from "react-native";
import * as React from "react";
import { useState } from "react";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import { MReviewOptions } from "../../models/misc/review-options.ts";

export default function PhrasesReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(false);
  const options = new MReviewOptions();
  return (
    <View>

      {showOptions && <ReviewOptionsDialog options={options} isDialogOpened={showOptions} handleCloseDialog={() => setShowOptions(false)} />}
    </View>
  );
}
