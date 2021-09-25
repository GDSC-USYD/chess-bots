import api from "./api";
import {
  ApiAuthResponse,
  ApiEloResponse,
  ForgotDto,
  LoginDto,
  RegisterDto,
} from "../types/ApiTypes";
import { User } from "../types/UserTypes";

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
    formData.append("id_value", "4"); //TODO: change route on backend
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
