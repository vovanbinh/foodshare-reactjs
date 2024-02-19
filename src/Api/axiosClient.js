import axios from "axios";
import { enqueueSnackbar } from "notistack";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        "content-type": "application/json",
        "Accept": "application/json"
    },
});

axiosClient.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // let errorData = {
        //     status: "error",
        //     message: "Lỗi không xác định từ máy chủ"
        // };
        let errorData = {
            status: "",
            message: ""
        };
        if (error.response) {
            const responseData = error.response.data;
            if (error.response.status === 401) {
                enqueueSnackbar("Vui Lòng Đăng Nhập", { variant: 'error' });
            } else if (error.response.status === 422) {
                if (responseData.errors) {
                    if (responseData.message) {
                        const errorMessages = Object.values(responseData?.errors).flat();
                        enqueueSnackbar(errorMessages[0] + "", { variant: 'error' });
                    } else {
                        enqueueSnackbar(responseData?.errors + "", { variant: 'error' });
                    }
                } else {
                    enqueueSnackbar("Lỗi không xác định từ máy chủ", { variant: 'error' });
                }
                errorData = responseData.errors;
            }
        } else {
            errorData = "Network Error:".error.message;
        }
        return errorData;
    }
);

export default axiosClient;
