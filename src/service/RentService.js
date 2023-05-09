import {$api} from "../http";

class RentService {
    async start(value) {
        let axiosResponse = await $api.post(`/api/v1/rents`, value);
        return axiosResponse.data;
    }

    async stop(rentId) {
        let axiosResponse = await $api.put(`/api/v1/rents/${rentId}/complete`);
        return axiosResponse.data;
    }

    async getAll(pageable) {
        const url = `/api/v1/rents?my&size=${pageable.size}&page=${pageable.page}&sort=${pageable.sort}`;
        let axiosResponse = await $api.get(url);
        return axiosResponse.data;
    }

    async getOne(rentId) {
        let axiosResponse = await $api.get(`/api/v1/rents/${rentId}`);
        return axiosResponse.data;
    }
}

export const rentService = new RentService();
