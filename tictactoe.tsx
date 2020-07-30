import React from "react";
import {Pressable, Text, View} from "react-native";
import {styles} from "./styles.js";
const noPlayer = "";
const players = ["O", "X"];
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
  rows: for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (board[i * size + j] !== player) {
        continue rows;
      }
    }
    return true;
  }
  columns: for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (board[j * size + i] !== player) {
        continue columns;
      }
    }
    return true;
  }
  diagonals: for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < size; ++j) {
      if (board[(i + j) * (size + 1 - i * 2)] !== player) {
        continue diagonals;
      }
    }
    return true;
  }
  return false;
}
function Status({status, clear, undo, redo}) {
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
        <Pressable style={styles.statusMenuButton} onPress={() => clear()}>
          <Text style={styles.statusMenuButtonText}>Clear</Text>
        </Pressable>
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
    const slice = cells.slice(index * size, (index + 1) * size);
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
export class Game extends React.Component {
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
        <Status status={status} clear={() => this.clear()} undo={() => this.undo()} redo={() => this.redo()}/>
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
  clear() {
    const {history} = this.state;
    const nextStep = 0;
    const nextHistory = history.slice(0, 1);
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
