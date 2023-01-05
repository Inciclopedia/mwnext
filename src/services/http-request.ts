import AxiosRequest from './axios-base';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';

class HttpRequest {
  baseRequest: AxiosInstance;
  constructor() {
    this.baseRequest = AxiosRequest;
  }

  async get(url: string, config?: AxiosRequestConfig) {
    return this.baseRequest.get(url, config);
  }

  async post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.baseRequest.post(url, data, config);
  }

  async postUrlEncoded(url: string, data: string, config?: AxiosRequestConfig) {
    return this.baseRequest.request({
      ...config,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data,
      url
  });
  }
}

export default new HttpRequest();
