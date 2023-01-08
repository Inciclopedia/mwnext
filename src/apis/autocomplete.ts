import HttpRequest from "@/services/http-request";

export interface AutocompleteResult {
    page?: string;
    url?: string;
}
export const autocomplete = async (query: string, limit: number): Promise<AutocompleteResult[]> => {
    const result = await HttpRequest.get('/api.php', {
        params: {
            "action": "opensearch",
            "search":  query,
            "limit": limit,
            "format": "json",
            "profile": "fuzzy-subphrases"
        }
    });
    if (result && result.status < 400 && result.data) {
        if (result.data.length > 2 && result.data[1].length > 0 && result.data[3].length > 0) {
            const results = [];
            for (let i=0; i<result.data[1].length; i++) {
                results.push({page: result.data[1][i], url: result.data[3][i]});
            }
            return results;
        } else {
            return [];
        }
    }
}
