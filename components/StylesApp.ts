import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const StylesApp = StyleSheet.create({
  containerDialog: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e6e6e6',
  },
  rowCompact: styles.row,
  row: {
    ...styles.row,
    marginTop: 8,
  },
  rowLeft: {
    width: '30%',
  },
  rowRight: {
    width: '70%',
  },
  textinput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  dropdownDisable: {
    backgroundColor: 'darkgray',
  },
  unitPart: {
    color: '#0000FF',
  },
  itemText1: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#FFA500',
  },
  itemText2: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#FF00FF',
  },
});

export default StylesApp;
