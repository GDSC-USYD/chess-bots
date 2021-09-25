import { User } from "./UserTypes";

export interface Game {
  player1: User["id"];
  player2: User["id"];
  mmrChange1: number;
  mmrChange2: number;
  winner: User["id"];
  timestamp: Date | null;
  pgn: string;
}
