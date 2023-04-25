import {$handbook_api} from "../http";

class PaymentService {
    async getRatesForOrganization(orgId) {
        let response = await $handbook_api.get(`/api/v1/rates?org=${orgId}`);
        return response.data;
    }

    async getMyRentOfEquipment(equipmentId) {
        let response = await $handbook_api.get(`/api/v1/rents?equipment=${equipmentId}`)
        return response.data;
    }

    async getMyActiveRent() {
        let response = await $handbook_api.get(`/api/v1/rents?active&my`);
        return response.data;
    }

    async startRent(rent) {
        let response = await $handbook_api.post(`/api/v1/rents`, {
            t: 123124,
            equipmentId: rent.equipmentId
        });
        return response.data;
    }

    async stopRent(rent) {
        let response = await $handbook_api.put(`/api/v1/rents/${rent.id}/complete`);
        return response.data;
    }

    async getRent(rentId) {
        let response = await $handbook_api.get(`/api/v1/rents/${rentId}`);
        return response.data;
    }
}

export const paymentService = new PaymentService();