import {AxiosError} from "axios";

class ErrorConverter {
    convert(e) {
        if (e instanceof AxiosError) {
            let data = e.response.data;
            if (data.message) {
                return data.message
            }
            return e.code
        }
        return "Внутренняя ошибка"
    }

    convertToToastBody(e) {
        console.log(e)
        if (e instanceof AxiosError) {
            let data = e.response.data;
            if (data.message) {
                return {
                    status: 'error',
                    title: data.message,
                    description: data.description
                }
            }
            return {
                status: 'error',
                title: e.code
            }
        }
        return {
            status: 'error',
            title: "Неизвестная ошибка"
        }
    }
}

export const errorConverter = new ErrorConverter();
