import {StyleSheet} from "react-native";
const dark = "#333";
const light = "#fff";
export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  status: {
    flexDirection: "row",
    backgroundColor: light,
  },
  statusParagraph: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 10,
    padding: 10,
  },
  statusParagraphText: {
    color: dark,
    lineHeight: 20,
    fontSize: 16,
  },
  statusMenu: {
    flexDirection: "row",
    padding: 5,
  },
  statusMenuButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: dark,
  },
  statusMenuButtonText: {
    color: light,
    lineHeight: 20,
    fontSize: 16,
  },
  board: {
    flex: 1,
    backgroundColor: dark,
  },
  boardGrid: {
    flex: 1,
    paddingVertical: 5,
  },
  boardGridRow: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  boardGridRowButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: light,
  },
  boardGridRowButtonText: {
    color: dark,
    lineHeight: 20,
    fontSize: 16,
  },
});
