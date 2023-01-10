import HttpRequest from "@/services/http-request";

export const loadStyle = async (skin: string): Promise<string> => {
    const result = await HttpRequest.get('/load.php', {
        params: {
            "modules": "site.styles",
            "only": "styles",
            skin
        },
        withCredentials: false
    });
    if (result && result.status < 400 && result.data) {
        return result.data;
    } else {
        return Promise.reject("invalid style");
    }
}
