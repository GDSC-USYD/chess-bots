import { User } from "./UserTypes";

export interface ApiBaseResponse {
  code: string;
  message: string;
}

export interface UserGetDto {
  elo_score: number;
  name: string;
  player_id: number;
}

export type ApiEloResponse = ApiBaseResponse & { payload: UserGetDto[] };

export type ApiAuthResponse = ApiBaseResponse & { payload: string };

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
