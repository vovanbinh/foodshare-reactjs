import axiosClient from "./axiosClient";
const userApi = {

    register(data) {
        const url = '/api/auth/register';
        return axiosClient.post(url, data);
    },

    verification(data) {
        const url = '/api/auth/verification';
        return axiosClient.post(url, data);
    },

    forgotPassword(data) {
        const url = '/api/auth/forgot-password';
        return axiosClient.post(url, data);
    },

    verificationForgot(data) {
        const url = '/api/auth/verification-forgot';
        return axiosClient.post(url, data);
    },

    NewPasswordForgotApi(data) {
        const url = '/api/auth/new-password-forgot';
        return axiosClient.post(url, data);
    },

    login(data) {
        const url = '/api/auth/login';
        return axiosClient.post(url, data);
    },

    loginGoogle(data) {
        const url = '/api/auth/login-google';
        return axiosClient.post(url, data);
    },

    loginFacebook(data) {
        const url = '/api/auth/login-facebook';
        return axiosClient.post(url, data);
    },

    editProfice(data) {
        const url = '/api/edit-profice';
        return axiosClient.post(url, data);
    },

    getProfice() {
        const url = '/api/get-profice';
        return axiosClient.get(url);
    },

    getPublicProfice(userId) {
        const url = `/api/get-public-profice/${userId}`;
        return axiosClient.get(url);
    },

    newImage(data) {
        const url = '/api/new-image-profice';
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        return axiosClient.post(url, data, { headers });
    },
    
    newPassword(data) {
        const url = '/api/new-password';
        return axiosClient.post(url, data);
    },

    getCountNotication(params) {
        const url = '/api/get-count-notication';
        return axiosClient.get(url, { params });
    },

    notificationSubscribers(data) {
        const url = '/api/notificationSubscribers';
        return axiosClient.post(url, data);
    },

    getNoticeDonatedFoods(params) {
        const url = '/api/getNoticeDonatedFoods';
        return axiosClient.get(url, { params });
    },
    
}
export default userApi;