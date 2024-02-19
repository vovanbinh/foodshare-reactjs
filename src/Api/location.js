import axios from "axios";
import axiosClient from "./axiosClient";

const locationApi = {
    getProvince(params) {
        const url = '/api/get-provinces';
        return axiosClient.get(url, { params });
    },

    getDistricts(provinceID) {
        const url = `/api/get-all-district-of-provinceId/${ provinceID }`;
        return axiosClient.get(url);
    },
    
    getWards(DistrictID) {
        const url = `/api/get-all-ward-of-districtId/${ DistrictID }`;
        return axiosClient.get(url);
    },
}
export default locationApi;