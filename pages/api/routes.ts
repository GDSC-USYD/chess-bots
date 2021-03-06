import { api, botapi } from "./api";
import {
  ApiAuthResponse,
  ApiBotGameResponse,
  ApiEloResponse,
  ApiGameResponse,
  ForgotDto,
  GameDto,
  LoginDto,
  RegisterDto,
} from "../../types/ApiTypes";
import { User } from "../../types/UserTypes";
import { Game } from "../../types/GameTypes";

// Check the fields
function CheckFields<T>(obj: any, fields: (keyof T)[]): T {
  for (let field of fields) {
    if (!obj.hasOwnProperty(field)) {
      throw new Error(`Missing field ${field}`);
    }
  }
  return obj as T;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const res = CheckFields<ApiEloResponse>((await api.get("/elo")).data, [
      "code",
      "message",
      "payload",
    ]);

    return res.payload.map((u) => {
      return {
        id: u.player_id ?? 0,
        username: u.name ?? "",
        mmr: u.elo_score ?? 0,
      };
    });
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getGames = async (): Promise<Game[]> => {
  try {
    const res = CheckFields<ApiGameResponse>((await api.get("/matches")).data, [
      "code",
      "message",
      "payload",
    ]);

    return res.payload.map((g) => {
      return {
        player1: g.player_1_id ?? 0,
        player2: g.player_2_id ?? 0,
        mmrChange1: g.player_1_score ?? 0,
        mmrChange2: g.player_2_score ?? 0,
        winner:
          g.winner_id && parseInt(g.winner_id) ? parseInt(g.winner_id) : null,
        timestamp: g.time && g.date ? new Date(g.date + "T" + g.time) : null,
        pgn: g.pgn ?? "",
        status: g.status_flag ?? 1,
      };
    });
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const createUser = async (data: RegisterDto): Promise<string> => {
  try {
    let formData = new FormData();
    formData.append("name", data.username);
    formData.append("password", data.password);
    formData.append("email", data.email);

    const res = CheckFields<ApiAuthResponse>(
      (await api.post("/register", formData)).data,
      ["code", "message", "payload"]
    );

    return res.payload;
  } catch (err) {
    console.log(err);
    return "";
  }
};

export const loginUser = async (data: LoginDto): Promise<string> => {
  try {
    let formData = new FormData();
    formData.append("name", data.username);
    formData.append("password", data.password);

    const res = CheckFields<ApiAuthResponse>(
      (await api.post("/login", formData)).data,
      ["code", "message", "payload"]
    );

    return res.payload;
  } catch (err) {
    console.log(err);
    return "";
  }
};

export const forgotPassword = async (data: ForgotDto): Promise<boolean> => {
  try {
    let formData = new FormData();
    formData.append("name", data.username);
    formData.append("email", data.email);

    const res = await api.post("/forgotpass", formData);

    if (res.status === 201) return true;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const updateModelUrl = async (
  url: string,
  token: string
): Promise<boolean> => {
  try {
    let formData = new FormData();
    const headers = { Authorisation: token };

    formData.append("table_name", "players");
    formData.append("var_name", "model_url");
    formData.append("var_value", url);

    const res = await api.post("/update", formData, { headers: headers });

    if (res.status === 201) return true;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const processMove = async (game: GameDto): Promise<string | null> => {
  try {
    let formData = new FormData();

    formData.append("fen", game.fen);
    formData.append("bot_player_id", game.id.toString());

    const res = CheckFields<ApiBotGameResponse>(
      (await botapi.post("/botmove", formData)).data,
      ["code", "message", "payload"]
    ).payload;

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
