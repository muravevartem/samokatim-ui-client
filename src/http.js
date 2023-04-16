import axios from "axios";
import {userService} from "./service/UserService.js";
import {events, eventService} from "./service/EventService.js";

let userApi = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

userApi.interceptors.request.use(function (config) {
        if (userService.token) {
            config.headers.Authorization = `Bearer ${userService.token}`
        }
        return config;
    },
    function (error) {
    })

userApi.interceptors.response.use(function (r) {
return r;
}, function (error) {
    if (error.response.status === 403)
        eventService.raise(events.error403);
    throw error;
})

export const $user_api = userApi;
