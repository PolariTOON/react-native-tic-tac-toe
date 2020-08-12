import React from "react";
import {Pressable, Text, View} from "react-native";
import {styles} from "./styles.js";
type HistoryStep = {
  squares: string[];
  winner: boolean;
}
type StatusData = {
  step: number;
  winner: boolean;
}
type BoardData = {
  squares: string[];
}
type GameData = {
  step: number;
  history: HistoryStep[];
}
const size: number = 3;
const length: number = size ** 2;
const noPlayer: string = "";
const players: string[] = ["O", "X"];
function calcSize(): number {
  return size;
}
function calcLength(): number {
  return length;
}
function calcNoPlayer(): string {
  return noPlayer;
}
function calcPlayer(step: number): string {
  return players[step % players.length];
}
function isWinner(squares: string[], player: string): boolean {
  const size: number = calcSize();
  rows: for (let i: number = 0; i < size; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (squares[i * size + j] !== player) {
        continue rows;
      }
    }
    return true;
  }
  columns: for (let i: number = 0; i < size; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (squares[j * size + i] !== player) {
        continue columns;
      }
    }
    return true;
  }
  diagonals: for (let i: number = 0; i < 2; ++i) {
    for (let j: number = 0; j < size; ++j) {
      if (squares[(i + j) * (size + 1 - i * 2)] !== player) {
        continue diagonals;
      }
    }
    return true;
  }
  return false;
}
function Status({status, clear, undo, redo}: {status: StatusData, clear: () => void, undo: () => void, redo: () => void}): JSX.Element {
  const {step, winner}: StatusData = status;
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
function Board({board, fill}: {board: BoardData, fill: (index: number) => void}): JSX.Element {
  const size: number = calcSize();
  const {squares}: BoardData = board;
  const cells: JSX.Element[] = [];
  for (const [index, player] of squares.entries()) {
    cells.push(
      <Pressable style={styles.boardTrackButton} key={index} onPress={() => fill(index)}>
        <Text style={styles.boardTrackButtonText}>{player}</Text>
      </Pressable>
    );
  }
  const rows: JSX.Element[] = [];
  for (let index: number = 0; index < size; ++index) {
    const slice: JSX.Element[] = cells.slice(index * size, (index + 1) * size);
    rows.push(
      <View style={styles.boardTrack} key={index}>{slice}</View>
    );
  }
  return (
    <View style={styles.board}>{rows}</View>
  );
}
export class Game extends React.Component<{}, GameData> {
  constructor(props: {}) {
    super(props);
    const step: number = 0;
    const length: number = calcLength();
    const noPlayer: string = calcNoPlayer();
    const squares: string[] = Array.from<string>({length}).fill(noPlayer);
    const winner: boolean = false;
    const history: HistoryStep[] = [{squares, winner}];
    this.state = {step, history};
  }
  render(): JSX.Element {
    const {step, history}: GameData = this.state;
    const {squares, winner}: HistoryStep = history[step];
    const status: StatusData = {step, winner};
    const board: BoardData = {squares};
    return (
      <View style={styles.root}>
        <Status status={status} clear={() => this.clear()} undo={() => this.undo()} redo={() => this.redo()}/>
        <Board board={board} fill={(index: number) => this.fill(index)}/>
      </View>
    );
  }
  fill(index: number): void {
    const {step, history}: GameData = this.state;
    const {squares, winner}: HistoryStep = history[step];
    const noPlayer: string = calcNoPlayer();
    if (winner || squares[index] !== noPlayer) {
      return;
    }
    const nextStep: number = step + 1;
    const nextSquares: string[] = squares.slice();
    const nextPlayer: string = calcPlayer(nextStep);
    nextSquares[index] = nextPlayer;
    const nextWinner: boolean = isWinner(nextSquares, nextPlayer);
    const nextHistory: HistoryStep[] = history.slice(0, nextStep);
    nextHistory.push({squares: nextSquares, winner: nextWinner});
    this.setState({step: nextStep, history: nextHistory});
  }
  clear(): void {
    const {history}: GameData = this.state;
    const nextStep: number = 0;
    const nextHistory: HistoryStep[] = history.slice(0, 1);
    this.setState({step: nextStep, history: nextHistory});
  }
  undo(): void {
    const {step, history}: GameData = this.state;
    if (step === 0) {
      return;
    }
    const nextStep: number = step - 1;
    const nextHistory: HistoryStep[] = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
  redo(): void {
    const {step, history}: GameData = this.state;
    if (step + 1 === history.length) {
      return;
    }
    const nextStep: number = step + 1;
    const nextHistory: HistoryStep[] = history.slice();
    this.setState({step: nextStep, history: nextHistory});
  }
}
