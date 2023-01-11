import {AxiosResponse} from 'axios';
import HttpRequest from '@/services/http-request';

export interface Purge {
    ns: number;
    title: string;
    purged?: string;
    missing?: string;
}

export interface PurgeResponse {
    batchcomplete: string;
    purge: Purge[];
}

export const purge = async (titles: string): Promise<AxiosResponse<PurgeResponse>> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "purge");
    urlParams.append("format", "json");
    urlParams.append("titles", titles);
    return HttpRequest.post('/api.php?' + urlParams.toString(), {}, {headers: {"Content-Type": "application/json"}});
}

export default purge;