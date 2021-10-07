import { User } from "./UserTypes";

export interface ApiBaseResponse {
  code: string;
  message: string;
}

export interface UserGetDto {
  elo_score: number | null;
  name: string | null;
  player_id: number | null;
}

export interface GameGetDto {
  batch_id: number | null;
  date: Date | null;
  match_id: number | null;
  pgn: string | null;
  player_1_id: User["id"] | null;
  player_1_score: number | null;
  player_2_id: User["id"] | null;
  player_2_score: number | null;
  status_flag: number | null;
  time: Date | null;
  winner_id: string | null;
}

export type ApiEloResponse = ApiBaseResponse & { payload: UserGetDto[] };

export type ApiGameResponse = ApiBaseResponse & { payload: GameGetDto[] };

export type ApiAuthResponse = ApiBaseResponse & { payload: string };

export type ApiBotGameResponse = ApiBaseResponse & { payload: string };

export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type ForgotDto = {
  username: string;
  email: string;
};

export type GameDto = {
  fen: string;
  id: number;
};
