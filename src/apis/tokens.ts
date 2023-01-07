import { AxiosResponse } from 'axios';
import HttpRequest from '@/services/http-request';

export interface LoginToken {
    logintoken: string;
}

export interface CsrfToken {
    csrftoken: string;
}

export interface TokenResponse<T> {
    batchcomplete: string;
    query: {tokens: T};
}

export const getLoginToken = async (): Promise<AxiosResponse<TokenResponse<LoginToken>>> =>
  HttpRequest.get('/api.php', {
      params: {
          "action": "query",
          "meta": "tokens",
          "type": "login",
          "format": "json"
      }
  });

export const getCsrfToken = async (): Promise<AxiosResponse<TokenResponse<CsrfToken>>> =>
    HttpRequest.get('/api.php', {
        params: {
            "action": "query",
            "meta": "tokens",
            "type": "csrf",
            "format": "json"
        }
    });