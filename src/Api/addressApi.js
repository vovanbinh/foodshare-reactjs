
import axiosClient from "./axiosClient";
const addressApi = {
    getAllAddress(data) {
        const url = '/api/get-all-address';
        return axiosClient.get(url, data);
    },

    addNewAddress(data) {
        const url = '/api/add-new-address';
        return axiosClient.post(url, data);
    },

    updateAddress(data) {
        const url = '/api/update-address';
        return axiosClient.post(url, data);
    },
    
    removeAddress(addressId) {
        const url = `/api/delete-address`;
        return axiosClient.post(url, addressId);
    },
}
export default addressApi;