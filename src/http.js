import axios from "axios";
import {userService} from "./service/UserService.js";
import {events, eventService} from "./service/EventService.js";

let userApi = axios.create({
    baseURL: 'https://client.1304294-cu57808.tw1.ru',
    withCredentials: true,
});

let onFulfilledRequest = function (config) {
    if (userService.token) {
        config.headers.Authorization = `Bearer ${userService.token}`
    }
    return config;
};
let onRejectedRequest = function (error) {
};

let onFulfilledResponse = function (r) {
    return r;
};
let onRejectedResponse = function (error) {
    if (error.response.status === 403)
        eventService.raise(events.error403);
    throw error;
};

userApi.interceptors.request.use(onFulfilledRequest, onRejectedRequest)
userApi.interceptors.response.use(onFulfilledResponse, onRejectedResponse)

export const $user_api = userApi;

let handbookApi = axios.create({
    // baseURL: 'https://handbook.1304294-cu57808.tw1.ru',
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

handbookApi.interceptors.request.use(onFulfilledRequest, onRejectedRequest)
handbookApi.interceptors.response.use(onFulfilledResponse, onRejectedResponse)

export const $handbook_api = handbookApi;

let monitorApi = axios.create({
    baseURL: 'https://monitor.1304294-cu57808.tw1.ru',
    withCredentials: true,
});

monitorApi.interceptors.request.use(onFulfilledRequest, onRejectedRequest)
monitorApi.interceptors.response.use(onFulfilledResponse, onRejectedResponse)

export const $monitor_api = monitorApi;
