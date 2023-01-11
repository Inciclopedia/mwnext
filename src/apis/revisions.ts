import {AxiosResponse} from 'axios';
import HttpRequest from '@/services/http-request';

export enum RvProp {
    ids, flags, timestamp, user, userid, size, slotsize, sha1, slotsha1, contentmodel,
    comment, parsedcomment, content, tags, roles, parsetree
}

export interface RevisionParams {
    titles?: string;
    pageids?: string;
    revids?: string;
    rvprop?: RvProp[];
    rvslots?: string;
    rvlimit?: number;
    rvstartid?: number;
    rvendid?: number;
    rvstart?: Date;
    rvend?: Date;
    rvdir?: "newer" | "older";
    rvuser?: string;
    rvexcludeuser?: string;
    rvtag?: string;
    rvcontinue?: string;
}

export interface RevisionInfo {
    revid?: number;
    parentid?: number;
    minor?: string;
    user?: string;
    userid?: number;
    size?: number;
    slotsize?: number;
    sha1?: string;
    slotsha1?: string;
    roles?: string[];
    contentmodel?: string;
    parsetree?: string;
    contentformat?: string;
    anon?: string;
    timestamp?: string;
    comment?: string;
    parsedcomment?: string;
    tags?: string[];
    "*"?: string;
}


export interface PageRevisionInfo {
    pageid: number;
    ns: number;
    title: string;
    revisions: RevisionInfo[];
}

export interface RevisionsResponse {
    batchcomplete?: string;
    query?: { pages: Record<string, PageRevisionInfo>}
}

export const getRevisions = async (params: RevisionParams): Promise<AxiosResponse<RevisionsResponse>> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "query");
    urlParams.append("prop", "revisions");
    urlParams.append("format", "json");
    for (const key of Object.getOwnPropertyNames(params)) {
        const value = params[key as keyof RevisionParams];
        if (!value) {
            continue;
        }
        if (value instanceof Date) {
            urlParams.append(key, (value as Date).toISOString());
        } else if (Array.isArray(value)) {
            let pipe = "";
            for (const item of value) {
                if (typeof item === "string") {
                    pipe = value.join("|");
                    break;
                } else {
                    pipe = value.map((it) => RvProp[it as RvProp]).join("|");
                }
            }
            urlParams.append(key, pipe);
        } else {
            urlParams.append(key, value.toString());
        }
    }
    return HttpRequest.get('/api.php?' + urlParams.toString());
}

export default getRevisions;