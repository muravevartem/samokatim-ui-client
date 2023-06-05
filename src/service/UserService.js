import {events, eventService} from "./EventService.js";
import {$api} from "../http.js";


class UserService {
    constructor() {
        this.token = localStorage.getItem('token');
        eventService.subscribe(events.error403, () => {
            localStorage.removeItem('token');
            this.token = null
        })
    }

    async signin(cred) {
        try {
            let response = await $api.post(`/api/v1/auth`, {
                username: cred.username,
                password: cred.password
            });
            let data = response.data;
            this.token = data.accessToken;
            localStorage.setItem('token', data.accessToken);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async registration(cred) {
        let response = await $api.post(`/api/v1/clients`, {
            email: cred.email,
        })
        return response.data;
    }

    async resetPassword(cred) {
        let response = await $api.put(`/api/v1/users/reset-password`, cred);
        return response.data;
    }

    async signout() {
        localStorage.removeItem('token');
        this.token = undefined;
    }

    authenticated() {
        return this.token;
    }

    async me() {
        let response = await $api.get(`/api/v1/clients/me`);
        return response.data;
    }

    async modify(fieldName, value) {
        await $api.put(`/api/v1/clients/me/${fieldName}`, {value: value});
    }

    async completeInvite(id, body) {
        let response = await $api.put(`/api/v1/user-invites/${id}`, body);
        return response.data
    }
}

export const userService = new UserService();
