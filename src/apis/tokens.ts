import { AxiosResponse } from 'axios';
import HttpRequest from '@/services/http-request';

export interface LoginToken {
    logintoken: string;
}

export interface LoginTokenResponse {
    batchcomplete: string;
    query: {tokens: LoginToken};
}

export const getLoginToken = async (): Promise<AxiosResponse<LoginTokenResponse>> =>
  HttpRequest.get('/api.php', {
      params: {
          "action": "query",
          "meta": "tokens",
          "type": "login",
          "format": "json"
      }
  });