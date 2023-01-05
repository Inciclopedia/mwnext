import { AxiosResponse } from 'axios';
import HttpRequest from '@/services/http-request';
import {getLoginToken} from "@/apis/tokens";
import {setAuthenticated, setCurrentUser} from "@/store/slices/authSlice";

export interface UserInfo {
    id: number;
    name: string;
    anon: string;
}

export interface UserInfoResponse {
    batchcomplete: string;
    query: {userinfo: UserInfo};
}

export interface ClientLoginResponse {
    clientlogin: {
        status: string;
        username?: string;
        message?: string;
        messagecode?: string;
    }
}

export const getCurrentUser = async (): Promise<AxiosResponse<UserInfoResponse>> =>
  HttpRequest.get('/api.php', {
      params: {
          "action": "query",
          "meta": "userinfo",
          "format": "json"
      }
  });


export const clientLogin = async (username: string, password: string, loginToken: string, callback: string): Promise<AxiosResponse<ClientLoginResponse>> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "clientlogin");
    urlParams.append("username", username);
    urlParams.append("loginreturnurl", callback);
    urlParams.append("format", "json");
    const bodyParams = "logintoken=" + encodeURIComponent(loginToken) + "&password=" + encodeURIComponent(password);
    return HttpRequest.postUrlEncoded('/api.php?' + urlParams.toString(), bodyParams);
}

export const performLogin = async (username: string, password: string): Promise<ClientLoginResponse> => {
    const tokenResponse = await getLoginToken();
    if (!tokenResponse || !tokenResponse.data || !tokenResponse.data.query || !tokenResponse.data.query.tokens || !tokenResponse.data.query.tokens.logintoken) {
        return Promise.reject("Hubo un problema interno, por favor inténtalo de nuevo");
    }
    const token = tokenResponse.data.query.tokens.logintoken;
    // TODO: set proper callback URI and MFA flow. We don't use it in uncy so it's fine for now...
    const loginResponse = await clientLogin(username, password, token, "http://localhost");
    if (!loginResponse || !loginResponse.data || !loginResponse.data.clientlogin || !loginResponse.data.clientlogin.status) {
        return Promise.reject("Hubo un problema iniciando sesión, por favor inténtalo de nuevo");
    }
    return loginResponse.data;
}
