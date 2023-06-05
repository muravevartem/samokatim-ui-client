import axios from "axios";
import {userService} from "./service/UserService.js";
import {AppEvents, eventBus} from "./service/EventBus.js";

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
    if (error.response.status === 401)
        eventBus.raise(AppEvents.UnAuthorized);
    throw error;
};

let handbookApi = axios.create({
    baseURL: (process.env.NODE_ENV === 'developmet')
        ? 'http://localhost:8080'
        : 'https://api.1304294-cu57808.tw1.ru',
    withCredentials: true,
});

handbookApi.interceptors.request.use(onFulfilledRequest, onRejectedRequest)
handbookApi.interceptors.response.use(onFulfilledResponse, onRejectedResponse)

export const $api = handbookApi;
