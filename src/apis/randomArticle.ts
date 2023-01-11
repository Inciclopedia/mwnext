import HttpRequest from "@/services/http-request";
import { AxiosResponse } from "axios";

export interface RandomApiParams {
    rnnamespace?: string;
    rnfilterredir?: "all" | "redirects" | "nonredirects";
    rnlimit?: number;
    rncontinue?: string;
}

export interface RandomEntry {
    id?: number;
    ns?: number;
    title?: string;
}

export interface RandomQuery {
    random?: Array<RandomEntry>;
}

export interface RandomContinue {
    rncontinue?: string;
    continue?: string;
}

export interface RandomResponse {
    batchcomplete?: string;
    continue?: RandomContinue;
    query?: RandomQuery;
}

export const randomArticle = async (params: RandomApiParams): Promise<AxiosResponse<RandomResponse>> =>
    HttpRequest.get('/api.php', {
        params: {
            "action": "query",
            "format": "json",
            "list": "random",
            ...params
        }
    })


