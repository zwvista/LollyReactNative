import Modal from "react-native-modal";
import { Button, View } from "react-native";

export interface ModalActionsItem {
  title: string,
}

export default function ModalActionsDialog(
  {data, isDialogOpened, handleCloseDialog}: {
    data: ModalActionsItem[],
    isDialogOpened: boolean,
    handleCloseDialog: (index: number) => void
  }
) {
  return (
    <Modal isVisible={isDialogOpened}>
      <View style={{backgroundColor: 'white'}}>
        {
          data.map((o, index) =>
            <View style={{marginBottom: 8}}>
              <Button
                key={index}
                title={o.title}
                onPress={() => handleCloseDialog(index)}
              />
            </View>
          )
        }
        <Button title="Cancel" onPress={() => handleCloseDialog(-1)} />
      </View>
    </Modal>
  );
}
