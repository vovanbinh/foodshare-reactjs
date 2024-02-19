import axios from "axios";
import axiosClient from "./axiosClient";

const cartApi = {

    addToCartAPI(value) {
        const url = `/api/add-to-cart`;
        const user = JSON.parse(localStorage.getItem('user'));
        const data = { value };
        if (user) {
            data.user = user;
        }
        return axiosClient.post(url, data);
    },

    getTotalCart() {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `/api/get-total-cart/${user?.id}`;
        return axiosClient.get(url);
    },

    getReceivedList(params) {
        const url = `/api/get-received-list`;
        return axiosClient.get(url, { params });
    },
    
    cancelReceived(received_id) {
        const url = `/api/cancel-received`;
        const user = JSON.parse(localStorage.getItem('user'));
        return axiosClient.post(url, received_id, user);
    }
    
}
export default cartApi;