import React from "react";
import {
  Pressable,
  View,
  Text,
} from "react-native";
import {styles} from "./styles.js";
const noPlayer = "";
const players = ["O", "X"];
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const size = 3;
const length = size ** 2;
function calcLength() {
  return length;
}
function calcNoPlayer() {
  return noPlayer;
}
function calcPlayer(step) {
  return players[step % players.length];
}
function isWinner(board, player) {
  for (const [a, b, c] of lines) {
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];
    if (cellA === player && cellB === player && cellC === player) {
      return true;
    }
  }
  return false;
}
function Status({status, undo, redo}) {
  const {step, winner} = status;
  const text = winner ? (
    `Winner: ${calcPlayer(step)}`
  ) : step === calcLength() ? (
    "No winner..."
  ) : (
    `Turn: ${calcPlayer(step + 1)}`
  );
  return (
    <View style={styles.status}>
      <View style={styles.statusParagraph}>
        <Text style={styles.statusParagraphText}>{text}</Text>
      </View>
      <View style={styles.statusMenu}>
        <Pressable style={styles.statusMenuButton} onPress={() => undo()}>
          <Text style={styles.statusMenuButtonText}>Undo</Text>
        </Pressable>
        <Pressable style={styles.statusMenuButton} onPress={() => redo()}>
          <Text style={styles.statusMenuButtonText}>Redo</Text>
        </Pressable>
      </View>
    </View>
  );
}
function Board({board, fill}) {
  const cells = [];
  for (const [index, player] of board.entries()) {
    cells.push(
      <Pressable style={styles.boardGridRowButton} key={index} onPress={() => fill(index)}>
        <Text style={styles.boardGridRowButtonText}>{player}</Text>
      </Pressable>
    );
  }
  const rows = [];
  for (let index = 0; index < size; ++index) {
    const slice = cells.slice(index * 3, (index + 1) * 3);
    rows.push(
      <View style={styles.boardGridRow} key={index}>{slice}</View>
    );
  }
  return (
    <View style={styles.board}>
      <View style={styles.boardGrid}>{rows}</View>
    </View>
  );
}
export default class Game extends React.Component {
  constructor(props) {
    super(props);
    const step = 0;
    const length = calcLength();
    const noPlayer = calcNoPlayer();
    const board = Array.from({length}).fill(noPlayer);
    const winner = false;
    const history = [{board, winner}];
    this.state = {step, history};
  }
  render() {
    const {step, history} = this.state;
    const {board, winner} = history[step];
    const status = {step, winner};
    return (
      <View style={styles.root}>
        <Status status={status} undo={() => this.undo()} redo={() => this.redo()}/>
        <Board board={board} fill={(index) => this.fill(index)}/>
      </View>
    );
  }
  fill(index) {
    const {step, history} = this.state;
    const {board, winner} = history[step];
    const noPlayer = calcNoPlayer();
    if (winner || board[index] !== noPlayer) {
      return;
    }
    const nextStep = step + 1;
    const nextBoard = board.slice();
    const nextPlayer = calcPlayer(nextStep);
    nextBoard[index] = nextPlayer;
    const nextWinner = isWinner(nextBoard, nextPlayer);
    const nextHistory = history.slice(0, nextStep);
    nextHistory.push({board: nextBoard, winner: nextWinner});
    this.setState({step: nextStep, history: nextHistory});
  }
  undo() {
    const {step, history} = this.state;
    if (step === 0) {
      return;
    }
    const nextStep = step - 1;
    const nextHistory = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
  redo() {
    const {step, history} = this.state;
    if (step + 1 === history.length) {
      return;
    }
    const nextStep = step + 1;
    const nextHistory = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
}
