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
    padding: 5,
    backgroundColor: dark,
  },
  boardTrack: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  boardTrackButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: light,
  },
  boardTrackButtonText: {
    color: dark,
    lineHeight: 20,
    fontSize: 16,
  },
});
