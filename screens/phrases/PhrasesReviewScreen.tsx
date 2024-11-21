import { View } from "react-native";
import * as React from "react";
import { useState } from "react";
import ReviewOptionsDialog from "../misc/ReviewOptionsDialog.tsx";
import { MReviewOptions } from "../../models/misc/review-options.ts";

export default function PhrasesReviewScreen({ navigation }:any) {
  const [showOptions, setShowOptions] = useState(true);
  const options = new MReviewOptions();
  const handleCloseDialog = (ok: boolean) => {
    setShowOptions(false);
  };
  return (
    <View>

      {showOptions && <ReviewOptionsDialog options={options} isDialogOpened={showOptions} handleCloseDialog={handleCloseDialog} />}
    </View>
  );
}
