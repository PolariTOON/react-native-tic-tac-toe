import React from "react";
import {Pressable, Text, View} from "react-native";
import {styles} from "./styles.js";
const noPlayer: string = "";
const players: string[] = ["O", "X"];
const size: number = 3;
const length: number = size ** 2;
function calcLength(): number {
  return length;
}
function calcNoPlayer(): string {
  return noPlayer;
}
function calcPlayer(step: number): string {
  return players[step % players.length];
}
function isWinner(board: string[], player: string): boolean {
  rows: for (let i: number = 0; i < size; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (board[i * size + j] !== player) {
        continue rows;
      }
    }
    return true;
  }
  columns: for (let i: number = 0; i < size; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (board[j * size + i] !== player) {
        continue columns;
      }
    }
    return true;
  }
  diagonals: for (let i: number = 0; i < 2; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (board[(i + j) * (size + 1 - i * 2)] !== player) {
        continue diagonals;
      }
    }
    return true;
  }
  return false;
}
function Status({status, clear, undo, redo}: {status: {step: number, winner: boolean}, clear: () => void, undo: () => void, redo: () => void}): JSX.Element {
  const {step, winner}: {step: number, winner: boolean} = status;
  const text: string = winner ? (
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
function Board({board, fill}: {board: string[], fill: (index: number) => void}): JSX.Element {
  const cells: Element[] = [];
  for (const [index, player] of board.entries()) {
    cells.push(
      <Pressable style={styles.boardGridRowButton} key={index} onPress={() => fill(index)}>
        <Text style={styles.boardGridRowButtonText}>{player}</Text>
      </Pressable>
    );
  }
  const rows: Element[] = [];
  for (let index: number = 0; index < size; ++index) {
    const slice: Element[] = cells.slice(index * size, (index + 1) * size);
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
export class Game extends React.Component<{}, {step: number, history: {board: string[], winner: boolean}[]}> {
  constructor(props: {}) {
    super(props);
    const step: number = 0;
    const length: number = calcLength();
    const noPlayer: string = calcNoPlayer();
    const board: string[] = Array.from<string>({length}).fill(noPlayer);
    const winner: boolean = false;
    const history: {board: string[], winner: boolean}[] = [{board, winner}];
    this.state = {step, history};
  }
  render() {
    const {step, history}: {step: number, history: {board: string[], winner: boolean}[]} = this.state;
    const {board, winner}: {board: string[], winner: boolean} = history[step];
    const status: {step: number, winner: boolean} = {step, winner};
    return (
      <View style={styles.root}>
        <Status status={status} clear={() => this.clear()} undo={() => this.undo()} redo={() => this.redo()}/>
        <Board board={board} fill={(index: number) => this.fill(index)}/>
      </View>
    );
  }
  fill(index: number) {
    const {step, history}: {step: number, history: {board: string[], winner: boolean}[]} = this.state;
    const {board, winner}: {board: string[], winner: boolean} = history[step];
    const noPlayer: string = calcNoPlayer();
    if (winner || board[index] !== noPlayer) {
      return;
    }
    const nextStep: number = step + 1;
    const nextBoard: string[] = board.slice();
    const nextPlayer: string = calcPlayer(nextStep);
    nextBoard[index] = nextPlayer;
    const nextWinner: boolean = isWinner(nextBoard, nextPlayer);
    const nextHistory: {board: string[], winner: boolean}[] = history.slice(0, nextStep);
    nextHistory.push({board: nextBoard, winner: nextWinner});
    this.setState({step: nextStep, history: nextHistory});
  }
  clear() {
    const {history}: {history: {board: string[], winner: boolean}[]} = this.state;
    const nextStep: number = 0;
    const nextHistory: {board: string[], winner: boolean}[] = history.slice(0, 1);
    this.setState({step: nextStep, history: nextHistory});
  }
  undo() {
    const {step, history}: {step: number, history: {board: string[], winner: boolean}[]} = this.state;
    if (step === 0) {
      return;
    }
    const nextStep: number = step - 1;
    const nextHistory: {board: string[], winner: boolean}[] = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
  redo() {
    const {step, history}: {step: number, history: {board: string[], winner: boolean}[]} = this.state;
    if (step + 1 === history.length) {
      return;
    }
    const nextStep: number = step + 1;
    const nextHistory: {board: string[], winner: boolean}[] = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
}
