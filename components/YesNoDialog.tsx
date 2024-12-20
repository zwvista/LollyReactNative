import { Alert } from "react-native";

export default function YesNoDialog(
  title: string,
  message?: string,
  onPressYes?: () => void,
) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'No',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Yes',
        onPress: onPressYes,
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
    },
  );
}
