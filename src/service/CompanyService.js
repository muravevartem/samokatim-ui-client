import {$handbook_api} from "../http.js";

class CompanyService {
    async search(text, pageable) {
        let response = await $handbook_api.get(`/api/v1/admin/organizations?search=${encodeURIComponent(text)}&page=${pageable.page}&size=${pageable.size}`);
        return response.data;
    }
}

export const companyService = new CompanyService();
