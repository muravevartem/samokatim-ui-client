import {AxiosError} from "axios";

export const errorService = {
    beautify: (e) => {
        if (e instanceof AxiosError) {
            let errorData = e.response.data;
            return {
                message: errorData.message ? errorData.message : `Неизвестная ошибка (${e.code})`,
                color: 'red'
            };
        }
        return {
            message: 'Неизвестная ошибка',
            color: 'red'
        }
    }
}
