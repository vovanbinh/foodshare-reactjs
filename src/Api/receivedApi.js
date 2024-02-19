import axios from "axios";
import axiosClient from "./axiosClient";

const ReceivedApi = {

    rating(params) {
        const url = `/api/rating/`;
        return axiosClient.post(url,params );
    },
    
}
export default ReceivedApi;