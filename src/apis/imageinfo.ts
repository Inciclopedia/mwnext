import HttpRequest from '@/services/http-request';

const getFileUrl = async (filename: string): Promise<string> => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "query");
    urlParams.append("format", "json");
    urlParams.append("prop", "imageinfo");
    urlParams.append("titles", filename);
    urlParams.append("iiprop", "url");
    const response = await HttpRequest.get('/api.php?' + urlParams.toString());
    if (response.status < 400) {
        return Promise.resolve(((Object.values((Object.values(response.data.query.pages)[0] as any).imageinfo)[0] as any).url));
    } else {
        return Promise.reject();
    }
}

export default getFileUrl;