import { User } from "./UserTypes";

export interface ApiBaseResponse {
  code: string;
  message: string;
}

export type ApiEloResponse = ApiBaseResponse & { payload: User[] };

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
