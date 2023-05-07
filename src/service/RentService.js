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
}

export const rentService = new RentService();
