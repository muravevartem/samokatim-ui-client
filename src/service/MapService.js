import {$api} from "../http.js";

class MapService {
    async getMapInfo(data) {
        let response = await $api.post(`/api/v1/map-view`, {
            northEast: data.northEast,
            southWest: data.southWest
        });
        return response.data;
    }
}

export const mapService = new MapService();
