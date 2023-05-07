import {$api} from "../http.js";

class CompanyService {
    async search(text, pageable) {
        let response = await $api.get(`/api/v1/organizations?search=${encodeURIComponent(text)}&page=${pageable.page}&size=${pageable.size}`);
        return response.data;
    }
}

export const companyService = new CompanyService();
