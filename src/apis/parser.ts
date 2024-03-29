import {AxiosResponse} from 'axios';
import HttpRequest from '@/services/http-request';

export enum WikiProp {
    text,
    langlinks,
    categories,
    categorieshtml,
    links,
    templates,
    images,
    externallinks,
    sections,
    revid,
    displaytitle,
    subtitle,
    headhtml,
    modules,
    jsconfigvars,
    encodedjsconfigvars,
    indicators,
    iwlinks,
    wikitext,
    properties,
    limitreportdata,
    limitreporthtml,
    parsetree,
    parsewarnings,
    parsewarningshtml,
    headitems
}

export interface ParserArguments {
    title?: string;
    text?: string;
    revid?: number;
    summary?: string;
    page?: string;
    pageid?: number;
    redirects?: boolean;
    oldid?: number;
    prop?: WikiProp[];
    wrapoutputclass?: string;
    pst?: boolean;
    onlypst?: boolean;
    section?: string;
    sectiontitle?: string;
    disablelimitreport?: boolean;
    disableeditsection?: boolean;
    disablestylededuplication?: boolean;
    showstrategykeys?: boolean;
    preview?: boolean;
    sectionpreview?: boolean;
    disabletoc?: boolean;
    useskin?: string;
    contentformat?: string;
    contentmodel?: string;
    mobileformat?: boolean;
    templatesandboxprefix?: string[];
    templatesandboxtitle?: string;
    templatesandboxtext?: string;
    templatesandboxcontentmodel?: string;
    templatesandboxcontentformat?: string;
}

export interface Category {
    sortkey?: string;
    "*"?: string;
}

export interface Link {
    ns?: number;
    exists?: boolean;
    "*"?: string;
}

export interface Template {
    ns?: number;
    exists?: boolean;
    "*"?: string;
}

export interface Section {
    toclevel?: number;
    level?: string;
    line?: string;
    number?: string;
    index?: string;
    fromtitle?: string;
    byteoffset?: number;
    anchor?: string;
    linkAnchor?: string;
}

export interface Property {
    name?: string;
    "*": string;
}

export interface LangLink {
    lang: string;
    url: string;
    langname: string;
}


export interface ParserResult {
    title?: string;
    pageid?: number;
    revid?: number;
    text?: string;
    wikitext?: string;
    langlinks?: LangLink[];
    categories?: Category[];
    links?: Link[];
    templates?: Template[];
    images?: string[];
    externallinks?: string[];
    sections?: Section[];
    showtoc?: boolean;
    parsewarnings?: string[];
    displaytitle?: string;
    iwlinks?: Link[];
    properties?: Property[];
    headhtml?: string;
}

export interface ParserError {
    code: string;
    info: string;
    "*"?: string;
}

export interface ParserResponse {
    parse?: ParserResult;
    error?: ParserError;
    servedby?: string;
}


const parseWikitext = async (params: ParserArguments): Promise<AxiosResponse<ParserResponse>> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "parse");
    urlParams.append("format", "json");
    urlParams.append("formatversion", "2");
    for (const key of Object.getOwnPropertyNames(params)) {
        const value = params[key as keyof ParserArguments];
        if (!value) {
            continue;
        }
        if (Array.isArray(value)) {
            let pipe = "";
            for (const item of value) {
                if (typeof item === "string") {
                    pipe = value.join("|");
                    break;
                } else {
                    pipe = value.map((it) => WikiProp[it as WikiProp]).join("|");
                }
            }
            urlParams.append(key, pipe);
        } else {
            urlParams.append(key, value.toString());
        }
    }

    return HttpRequest.get('/api.php?' + urlParams.toString());
}

export const getWikitext = async (page: string): Promise<string> => {
    const response = await parseWikitext({
        page,
        prop: [WikiProp.wikitext]
    });
    if (response.status < 400 && response.data && response.data.parse) {
        return Promise.resolve(response.data.parse.wikitext);
    } else {
        return Promise.reject();
    }
}

export default parseWikitext;