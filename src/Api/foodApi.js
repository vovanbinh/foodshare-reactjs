import axios from "axios";
import axiosClient from "./axiosClient";

const foodAip = {

    getAll(params) {
        const url = '/api/foods';
        return axiosClient.get(url, { params });
    },

    getDetail(foodSlug) {
        const url = `/api/get-detail-food/${foodSlug}`;
        return axiosClient.get(url);
    },

    getDetailDonated(foodId) {
        const url = `/api/food-donated-detail/${foodId}`;
        return axiosClient.get(url);
    },

    donateFoodApi(data) {
        const url = '/api/donate-food';
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        return axiosClient.post(url, data, { headers });
    },

    getDonateList(params) {
        const url = '/api/get-donate-list';
        return axiosClient.get(url, { params });
    },

    cancelDonate(food_id) {
        const url = `/api/cancel-donate-food`;
        return axiosClient.post(url, food_id);
    },
    
    editFoodApi(data) {
        const url = '/api/edit-donate-food';
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        return axiosClient.post(url, data, { headers });
    },

}
export default foodAip;