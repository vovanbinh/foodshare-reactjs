import axios from "axios";
import axiosClient from "./axiosClient";

const categoriesApi = {

    getCategories(params) {
        const url = '/api/get-categories';
        return axiosClient.get(url, { params });
    },

    getFoodWithCategory(category, params) {
        const url = `/api/getFoodWithCategory/${category}`;
        return axiosClient.get(url, { params: params });
    },
    
}
export default categoriesApi;