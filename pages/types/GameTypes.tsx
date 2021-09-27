import { User } from "./UserTypes";

export interface Game {
  player1: User["id"];
  player2: User["id"];
  mmrChange1: number;
  mmrChange2: number;
  winner: User["id"] | null;
  timestamp: Date | null;
  pgn: string;
  status: number;
}
