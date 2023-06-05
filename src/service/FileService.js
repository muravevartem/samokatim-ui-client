import {$api} from "../http.js";

class FileService {
    async upload(file) {
        let formData = new FormData();
        formData.append('file', file);

        let axiosResponse = await $api.post(`/api/v1/files`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        return axiosResponse.data;
    }

    url(file) {
        if (file) {
            let url = `${$api.defaults.baseURL}/api/v1/files/${file.id}`;
            return url
        }
        return '/icons/domain-custom.png'
    }
}

export const fileService = new FileService();
