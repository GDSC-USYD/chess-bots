import { User } from "./UserTypes";

export interface Game {
  player1: User["id"];
  player2: User["id"];
  winner: User["id"];
  timestamp: Date;
}
