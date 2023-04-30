import {$user_api} from "../http.js";
import {events, eventService} from "./EventService.js";


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
            let response = await $user_api.post(`/api/v1/auth`, {
                username: cred.username,
                password: cred.password,
                roles: ['CLIENT']
            });
            console.log(response)
            let data = response.data;
            this.token = data.accessToken;
            localStorage.setItem('token', data.accessToken);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async registration(cred) {
        let response = await $user_api.post(`/api/v1/users`, {
            username: cred.username,
            password: cred.password
        })
        return response.data;
    }

    async signout() {
        localStorage.removeItem('token');
        this.token = undefined;
    }

    authenticated() {
        console.log(this.token);
        return this.token != null;
    }

    async me() {
        let response = await $user_api.get(`/api/v1/users/me`);
        return response.data;
    }

    async modify(fieldName, value) {
        await $user_api.put(`/api/v1/users/me/${fieldName}`, {value: value});
    }

}

export const userService = new UserService();
