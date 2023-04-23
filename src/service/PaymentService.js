import {$handbook_api} from "../http";

class PaymentService {
    async getRatesForOrganization(orgId) {
        let response = await $handbook_api.get(`/api/v1/rates?org=${orgId}`);
        return response.data;
    }
}

export const paymentService = new PaymentService();