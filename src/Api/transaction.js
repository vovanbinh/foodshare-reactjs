import axios from "axios";
import axiosClient from "./axiosClient";

const transactionsApi = {

  history_transactions(params) {
    const url = `/api/history-transactions`;
    return axiosClient.get(url, { params });
  },

  confirmReceived(transaction_id) {
    const url = `/api/confirm-received`;
    return axiosClient.post(url, transaction_id);
  },

  notifiConfirm(data) {
    const url = `/api/notifi-confirm`;
    return axiosClient.post(url, data);
  },

  notifiRefuse(transaction_id) {
    const url = `/api/notifi-refuse`;
    return axiosClient.post(url, transaction_id);
  },

  notifiViewed(notifi_id) {
    const url = `/api/notifi-viewed`;
    return axiosClient.post(url, notifi_id);
  },

  viewedNoticeDonatedFood(notifi_id) {
    const url = `/api/notifi-viewed-donatedfood`;
    return axiosClient.post(url, notifi_id);
  },

  detailTransaction(transaction_id) {
    const url = `/api/detail-transaction/${transaction_id}`;
    return axiosClient.get(url);
  },

  getDetailPageReceiverList(foodId) {
    const url = `/api/get-detail-page-receiver-list/${foodId}`;
    return axiosClient.get(url);
  },

  errorNotifications(data) {
    const url = `/api/error-notifications`;
    return axiosClient.post(url, data);
  },

  getTotalNoticeTransaction() {
    const url = '/api/get-total-notice-transaction';
    return axiosClient.get(url);
  },
  getTotalNoticeSub() {
    const url = '/api/get-total-notice-sub';
    return axiosClient.get(url);
  },
};
export default transactionsApi;
