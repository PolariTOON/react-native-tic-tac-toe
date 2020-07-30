import {AppRegistry} from "react-native";
import {Game} from "./tictactoe.tsx";
AppRegistry.registerComponent("tictactoe", () => {
  return Game;
});
