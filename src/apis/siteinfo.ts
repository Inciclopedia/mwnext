import HttpRequest from '@/services/http-request';
import {AxiosResponse} from "axios";

export interface Namespace {
    id: string;
    case: string;
    canonical: string;
    subpages?: string;
    namespaceprotection?: string;
    defaultcontentmodel?: string;
    content?: string;
    "*": string;
}

export interface NamespacesResponse {
    batchcomplete?: string;
    query: {
        namespaces: Record<string, Namespace>;
    }
}

const getNamespaces = async (): Promise<AxiosResponse<NamespacesResponse>> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "query");
    urlParams.append("meta", "siteinfo");
    urlParams.append("siprop", "namespaces");
    urlParams.append("format", "json");
    return HttpRequest.get('/api.php?' + urlParams.toString());
}

export default getNamespaces;