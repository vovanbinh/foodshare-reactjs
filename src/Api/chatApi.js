import axios from "axios";
import axiosClient from "./axiosClient";

const chatApi = {

    newMessage(data) {
        const url = '/api/new-message';
        return axiosClient.post(url, data);
    },
    getMessages(userId) {
        const url = `/api/get-messages/${userId}`;
        return axiosClient.get(url);
    },
}
export default chatApi;